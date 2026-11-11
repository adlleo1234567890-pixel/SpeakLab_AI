/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  MousePointer,
  Share2,
  BarChart3,
  GitBranch,
  Layers,
  Award,
  CheckCircle2,
  Eye,
  ScrollText
} from 'lucide-react';
import { PresentationSlide } from '../../types';

interface SlideViewerProps {
  slides: PresentationSlide[];
  currentSlideIndex: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSelectSlide: (index: number) => void;
  onShareScreenClick: () => void;
  onToggleNotes: () => void;
  isNotesOpen: boolean;
}

// Fixed 16:9 virtual canvas reference coordinate system (Standard presentation ratio)
const SLIDE_BASE_WIDTH = 960;
const SLIDE_BASE_HEIGHT = 540;

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  currentSlideIndex,
  onPrevSlide,
  onNextSlide,
  onSelectSlide,
  onShareScreenClick,
  onToggleNotes,
  isNotesOpen,
}) => {
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });
  const [viewMode, setViewMode] = useState<'fit' | 'scroll'>('fit');

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Dynamic measuring of available canvas area using ResizeObserver
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const updateDimensions = () => {
      if (el) {
        setContainerDimensions({
          width: el.clientWidth,
          height: el.clientHeight,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    resizeObserver.observe(el);
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Reset scroll position when slide changes or when switching to fit mode
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentSlideIndex]);

  const handleToggleViewMode = () => {
    if (viewMode === 'scroll') {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setViewMode('fit');
    } else {
      setViewMode('scroll');
    }
  };

  // Two-axis proportional scale calculation
  const paddingX = containerDimensions.width < 500 ? 12 : 24;
  const paddingY = containerDimensions.height < 400 ? 12 : 24;
  const availW = Math.max(100, containerDimensions.width - paddingX);
  const availH = Math.max(100, containerDimensions.height - paddingY);

  const scaleX = availW / SLIDE_BASE_WIDTH;
  const scaleY = availH / SLIDE_BASE_HEIGHT;
  const rawScale = Math.min(scaleX, scaleY);
  const scale = Number.isFinite(rawScale) && rawScale > 0 ? rawScale : 1;

  // Track laser position relative to the slide sheet
  const handleSlideMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!laserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
      setLaserPos({ x, y });
    }
  };

  const renderVisualGraphic = (type?: string, isScaledCanvas = true) => {
    switch (type) {
      case 'chart':
        return (
          <div className="bg-[#FAFBF9] border border-[#E4E9E3] rounded-xl p-3 md:p-4 flex flex-col justify-between h-[190px]">
            <div className="flex items-center justify-between text-xs text-[#768078]">
              <span className="font-semibold text-[#3D4740] flex items-center gap-1.5 text-xs">
                <BarChart3 className="w-3.5 h-3.5 text-[#83A58E] shrink-0" />
                <span className="truncate">Độ chính xác theo tuần thử nghiệm</span>
              </span>
              <span className="text-[10px]">Đơn vị: %</span>
            </div>
            <div className="flex items-end justify-around h-28 pt-2 gap-3">
              {[
                { week: 'T1', fullWeek: 'Tuần 1', val: 72 },
                { week: 'T2', fullWeek: 'Tuần 2', val: 81 },
                { week: 'T3', fullWeek: 'Tuần 3', val: 89 },
                { week: 'T4', fullWeek: 'Tuần 4', val: 94 },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[11px] font-bold text-[#324C3B] tabular-nums">
                    {item.val}%
                  </span>
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full max-w-[42px] bg-[#83A58E] hover:bg-[#6F917A] transition-all rounded-t-md"
                  />
                  <span className="text-[11px] text-[#768078] font-medium">{item.fullWeek}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="bg-[#FAFBF9] border border-[#E4E9E3] rounded-xl p-3 md:p-4 flex flex-col justify-around h-[190px]">
            <div className="text-xs font-semibold text-[#3D4740] flex items-center gap-1.5 mb-2">
              <GitBranch className="w-3.5 h-3.5 text-[#83A58E] shrink-0" />
              <span>Quy trình nhận diện và mở ngăn rác</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-[#E4E9E3] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#324C3B] text-[10px] font-bold mx-auto mb-1 flex items-center justify-center">
                  1
                </div>
                <p className="font-semibold text-[#3D4740] text-xs">Quét Camera</p>
                <p className="text-[10px] text-[#768078] mt-0.5">350ms</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#E4E9E3] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#324C3B] text-[10px] font-bold mx-auto mb-1 flex items-center justify-center">
                  2
                </div>
                <p className="font-semibold text-[#3D4740] text-xs">Phân loại AI</p>
                <p className="text-[10px] text-[#768078] mt-0.5">94.2%</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#E4E9E3] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#324C3B] text-[10px] font-bold mx-auto mb-1 flex items-center justify-center">
                  3
                </div>
                <p className="font-semibold text-[#3D4740] text-xs">Mở ngăn tự động</p>
                <p className="text-[10px] text-[#768078] mt-0.5">0.5s</p>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="bg-[#FAFBF9] border border-[#E4E9E3] rounded-xl p-3 md:p-4 flex flex-col justify-between h-[190px]">
            <div className="text-xs font-semibold text-[#3D4740] flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-[#83A58E] shrink-0" />
              <span>So sánh hiệu quả với phương pháp thủ công</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E4E9E3]">
                <p className="font-semibold text-[#768078] text-[11px]">Thùng rác thông thường</p>
                <p className="text-sm font-bold text-[#3D4740] mt-0.5">38% lẫn rác</p>
                <p className="text-[10px] text-[#768078] mt-0.5">Phụ thuộc cảm tính</p>
              </div>
              <div className="p-3 bg-[#EEF4F0] rounded-lg border border-[#D9E5DC]">
                <p className="font-semibold text-[#324C3B] text-[11px]">SmartBin AI Box</p>
                <p className="text-sm font-bold text-[#2A4433] mt-0.5">6.5% lẫn rác</p>
                <p className="text-[10px] text-[#4A6453] mt-0.5">Tự động dẫn hướng</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-[#EEF4F0] border border-[#D9E5DC] rounded-xl p-4 flex flex-col items-center justify-center text-center h-[190px]">
            <Award className="w-8 h-8 text-[#5A7D65] mb-2" />
            <p className="text-xs font-bold text-[#2A4433]">
              Sẵn sàng cho phần hỏi đáp & phản biện
            </p>
            <p className="text-[11px] text-[#4A6453] mt-1 max-w-xs leading-relaxed">
              Ban giám khảo và các thính giả mô phỏng đang chuẩn bị câu hỏi dành cho bạn.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1A211C] rounded-2xl border border-[#2D3830] overflow-hidden shadow-lg relative min-h-0 w-full h-full">
      {/* 1. Top Slide Header toolbar inside meeting */}
      <div className="h-11 bg-[#242C26] border-b border-[#2D3830] px-3 md:px-4 flex items-center justify-between text-xs text-[#A8B6AB] shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#83A58E] shrink-0" />
          <span className="font-medium text-white truncate max-w-[130px] sm:max-w-xs md:max-w-md">
            Slide {currentSlideIndex + 1}: {currentSlide.title}
          </span>
          <span className="text-[10px] bg-[#2E3A31] text-[#A8B6AB] px-1.5 py-0.5 rounded font-mono shrink-0">
            {currentSlideIndex + 1}/{slides.length}
          </span>
        </div>

        {/* Action Controls in toolbar */}
        <div className="flex items-center gap-1 shrink-0">
          {/* View mode toggle: Fit vs Scroll */}
          <button
            onClick={handleToggleViewMode}
            className={`p-1.5 rounded-md transition-colors text-xs flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'fit'
                ? 'bg-[#83A58E] text-white'
                : 'text-[#A8B6AB] hover:text-white hover:bg-[#2E3A31]'
            }`}
            title={viewMode === 'fit' ? 'Đang ở chế độ Vừa khung (bấm để Cuộn đọc)' : 'Đang ở chế độ Cuộn đọc (bấm để Vừa khung)'}
          >
            {viewMode === 'fit' ? <Eye className="w-3.5 h-3.5" /> : <ScrollText className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-medium hidden sm:inline">
              {viewMode === 'fit' ? `Vừa khung (${Math.round(scale * 100)}%)` : 'Cuộn đọc'}
            </span>
            <span className="text-[11px] font-medium sm:hidden">
              {viewMode === 'fit' ? 'Vừa khung' : 'Cuộn đọc'}
            </span>
          </button>

          {/* Laser Pointer */}
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`p-1.5 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer ${
              laserActive
                ? 'bg-[#83A58E] text-white'
                : 'text-[#A8B6AB] hover:text-white hover:bg-[#2E3A31]'
            }`}
            title="Bật/Tắt con trỏ laser mô phỏng"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Con trỏ laser</span>
          </button>

          {/* Notes Drawer Toggle */}
          <button
            onClick={onToggleNotes}
            className={`p-1.5 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer ${
              isNotesOpen
                ? 'bg-[#83A58E] text-white'
                : 'text-[#A8B6AB] hover:text-white hover:bg-[#2E3A31]'
            }`}
            title="Mở kịch bản người nói"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Kịch bản</span>
          </button>

          {/* Share screen button (notice) */}
          <button
            onClick={onShareScreenClick}
            className="p-1.5 rounded-md text-[#A8B6AB] hover:text-white hover:bg-[#2E3A31] transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="Chia sẻ màn hình (Tính năng Đợt 2)"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* 2. Slide Canvas Stage */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full min-h-0 flex items-center justify-center overflow-hidden bg-[#1F2621]"
      >
        {viewMode === 'fit' ? (
          /* "VỪA KHUNG" MODE: Mathematical 2-axis proportional scaling to guarantee 100% visibility */
          <div
            style={{
              width: `${Math.round(SLIDE_BASE_WIDTH * scale)}px`,
              height: `${Math.round(SLIDE_BASE_HEIGHT * scale)}px`,
              position: 'relative',
              flexShrink: 0,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <div
              onMouseMove={handleSlideMouseMove}
              style={{
                width: `${SLIDE_BASE_WIDTH}px`,
                height: `${SLIDE_BASE_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              className="bg-white rounded-xl shadow-2xl p-6 flex flex-col justify-between border border-[#E4E9E3] text-[#3D4740] select-none overflow-hidden absolute top-0 left-0"
            >
              {/* Slide Header */}
              <div className="shrink-0">
                <div className="flex items-center justify-between text-xs text-[#768078] pb-2 border-b border-[#E4E9E3]">
                  <span className="font-semibold text-[#4A6453] uppercase tracking-wider text-[11px]">
                    SpeakLab AI · Nghiên cứu Khoa học 2026
                  </span>
                  <span className="tabular-nums font-mono text-[11px] font-semibold text-[#3D4740]">
                    Slide {currentSlide.slideNumber} / {slides.length}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#3D4740] mt-2 tracking-tight leading-snug">
                  {currentSlide.title}
                </h2>
                {currentSlide.subtitle && (
                  <p className="text-xs text-[#768078] mt-0.5 font-medium leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Slide Body: 2 columns with generous breathing room */}
              <div className="grid grid-cols-2 gap-5 my-auto py-2 items-center flex-1 min-h-0">
                {/* Left Column: Points and Highlight */}
                <div className="space-y-2.5">
                  {currentSlide.contentPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#444F47]">
                      <CheckCircle2 className="w-4 h-4 text-[#83A58E] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{point}</span>
                    </div>
                  ))}

                  {currentSlide.keyHighlight && (
                    <div className="mt-3 p-3 rounded-lg bg-[#EEF4F0] border border-[#D9E5DC] text-xs font-semibold text-[#2A4433] leading-relaxed">
                      💡 {currentSlide.keyHighlight}
                    </div>
                  )}
                </div>

                {/* Right Column: Visual Graphic */}
                <div className="h-full flex flex-col justify-center">
                  {renderVisualGraphic(currentSlide.visualGraphicType, true)}
                </div>
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E4E9E3] text-[11px] text-[#768078] shrink-0 mt-auto">
                <span className="truncate max-w-[420px]">
                  Người trình bày: Nguyễn Minh Quân · Lớp 11A1 chuyên Tin
                </span>
                <span className="shrink-0 font-medium text-[#4A6453]">Phòng họp SpeakLab AI</span>
              </div>

              {/* Laser pointer dot */}
              {laserActive && (
                <div
                  style={{
                    left: `${laserPos.x}%`,
                    top: `${laserPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-4 h-4 rounded-full bg-[#E5484D] shadow-[0_0_14px_#E5484D] pointer-events-none transition-transform duration-75 z-30 ring-2 ring-white/60"
                />
              )}
            </div>
          </div>
        ) : (
          /* "CUỘN ĐỌC" MODE: Vertical document view allowing manual scroll */
          <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-auto p-3 sm:p-5 flex flex-col items-center"
          >
            <div
              onMouseMove={handleSlideMouseMove}
              className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-5 sm:p-7 flex flex-col gap-4 border border-[#E4E9E3] text-[#3D4740] select-none relative my-auto"
            >
              {/* Slide Header */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#768078] pb-2 border-b border-[#E4E9E3]">
                  <span className="font-semibold text-[#4A6453] uppercase tracking-wider text-[10px]">
                    SpeakLab AI · Nghiên cứu Khoa học 2026
                  </span>
                  <span className="tabular-nums font-mono text-[11px] font-semibold text-[#3D4740]">
                    Slide {currentSlide.slideNumber} / {slides.length}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#3D4740] mt-2.5 tracking-tight leading-snug">
                  {currentSlide.title}
                </h2>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-[#768078] mt-1 font-medium leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Slide Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="space-y-2.5">
                  {currentSlide.contentPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#444F47]">
                      <CheckCircle2 className="w-4 h-4 text-[#83A58E] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{point}</span>
                    </div>
                  ))}

                  {currentSlide.keyHighlight && (
                    <div className="mt-3 p-3 rounded-lg bg-[#EEF4F0] border border-[#D9E5DC] text-xs font-semibold text-[#2A4433] leading-relaxed">
                      💡 {currentSlide.keyHighlight}
                    </div>
                  )}
                </div>

                <div>
                  {renderVisualGraphic(currentSlide.visualGraphicType, false)}
                </div>
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#E4E9E3] text-[10px] text-[#768078] mt-2">
                <span className="truncate max-w-[280px]">
                  Người trình bày: Nguyễn Minh Quân · Lớp 11A1 chuyên Tin
                </span>
                <span className="shrink-0 font-medium text-[#4A6453]">Phòng họp SpeakLab AI</span>
              </div>

              {/* Laser pointer dot */}
              {laserActive && (
                <div
                  style={{
                    left: `${laserPos.x}%`,
                    top: `${laserPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-4 h-4 rounded-full bg-[#E5484D] shadow-[0_0_14px_#E5484D] pointer-events-none transition-transform duration-75 z-30 ring-2 ring-white/60"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Slide Navigation Bar */}
      <div className="h-12 bg-[#242C26] border-t border-[#2D3830] px-3 md:px-4 flex items-center justify-between text-xs shrink-0">
        <button
          onClick={onPrevSlide}
          disabled={currentSlideIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-[#2E3A31] hover:bg-[#3B4A3F] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
          title="Về slide trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Slide trước</span>
        </button>

        {/* Slide Thumbnail Dots */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSlide(idx)}
              className={`w-7 h-6 rounded flex items-center justify-center font-mono text-[11px] transition-all cursor-pointer shrink-0 ${
                currentSlideIndex === idx
                  ? 'bg-[#83A58E] text-white font-bold ring-1 ring-white/30'
                  : 'bg-[#2E3A31] text-[#A8B6AB] hover:text-white hover:bg-[#3B4A3F]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={onNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-3 py-1.5 rounded-lg bg-[#83A58E] hover:bg-[#6F917A] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1.5 font-semibold transition-colors cursor-pointer min-h-[36px]"
          title="Chuyển slide tiếp theo"
        >
          <span className="hidden sm:inline">Slide sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
