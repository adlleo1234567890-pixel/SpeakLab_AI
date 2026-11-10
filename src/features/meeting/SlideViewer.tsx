/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  MousePointer,
  Share2,
  BarChart3,
  GitBranch,
  Layers,
  Award,
  CheckCircle2
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!laserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLaserPos({ x, y });
  };

  const renderVisualGraphic = (type?: string) => {
    switch (type) {
      case 'chart':
        return (
          <div className="bg-[#FAFBF9] border border-[#E4E9E3] rounded-xl p-4 flex flex-col justify-between h-48">
            <div className="flex items-center justify-between text-xs text-[#768078]">
              <span className="font-semibold text-[#3D4740] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#83A58E]" />
                Tỷ lệ phân loại chính xác theo tuần thử nghiệm
              </span>
              <span>Đơn vị: %</span>
            </div>
            <div className="flex items-end justify-around h-28 pt-4 gap-3">
              {[
                { week: 'Tuần 1', val: 72 },
                { week: 'Tuần 2', val: 81 },
                { week: 'Tuần 3', val: 89 },
                { week: 'Tuần 4', val: 94 },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-[#324C3B] tabular-nums">
                    {item.val}%
                  </span>
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full max-w-[48px] bg-[#83A58E] hover:bg-[#6F917A] transition-all rounded-t-md"
                  />
                  <span className="text-[10px] text-[#768078]">{item.week}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="bg-[#FAFBF9] border border-[#E4E9E3] rounded-xl p-4 flex flex-col justify-around h-48">
            <div className="text-xs font-semibold text-[#3D4740] flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-[#83A58E]" />
              Quy trình nhận diện và đóng mở ngăn rác
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-[#E4E9E3] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#324C3B] text-[10px] font-bold mx-auto mb-1 flex items-center justify-center">
                  1
                </div>
                <p className="font-semibold text-[#3D4740]">Quét ảnh Camera</p>
                <p className="text-[10px] text-[#768078] mt-0.5">350ms xử lý biên</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#E4E9E3] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#324C3B] text-[10px] font-bold mx-auto mb-1 flex items-center justify-center">
                  2
                </div>
                <p className="font-semibold text-[#3D4740]">Phân loại MobileNet</p>
                <p className="text-[10px] text-[#768078] mt-0.5">Độ tin cậy 94.2%</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#E4E9E3] shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#324C3B] text-[10px] font-bold mx-auto mb-1 flex items-center justify-center">
                  3
                </div>
                <p className="font-semibold text-[#3D4740]">Mở ngăn rác tự động</p>
                <p className="text-[10px] text-[#768078] mt-0.5">Phản hồi 0.5s</p>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="bg-[#FAFBF9] border border-[#E4E9E3] rounded-xl p-4 flex flex-col justify-between h-48">
            <div className="text-xs font-semibold text-[#3D4740] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#83A58E]" />
              So sánh giải pháp truyền thống và SmartBin AI
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E4E9E3]">
                <p className="font-semibold text-[#768078] text-[11px]">Thùng rác thủ công</p>
                <p className="text-sm font-bold text-[#3D4740] mt-1">38% lẫn tạp chất</p>
                <p className="text-[10px] text-[#768078] mt-0.5">Phụ thuộc hoàn toàn ý thức</p>
              </div>
              <div className="p-3 bg-[#EEF4F0] rounded-lg border border-[#D9E5DC]">
                <p className="font-semibold text-[#324C3B] text-[11px]">Hệ thống SmartBin AI</p>
                <p className="text-sm font-bold text-[#2A4433] mt-1">6.5% lẫn tạp chất</p>
                <p className="text-[10px] text-[#4A6453] mt-0.5">Tự động dẫn hướng thông minh</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-[#EEF4F0] border border-[#D9E5DC] rounded-xl p-4 flex flex-col items-center justify-center text-center h-48">
            <Award className="w-8 h-8 text-[#5A7D65] mb-2" />
            <p className="text-xs font-bold text-[#2A4433]">
              Sẵn sàng cho phần hỏi đáp & phản biện
            </p>
            <p className="text-[11px] text-[#4A6453] mt-1 max-w-sm">
              Ban giám khảo và các thính giả mô phỏng đang chuẩn bị câu hỏi dành cho bạn.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1A211C] rounded-2xl border border-[#2D3830] overflow-hidden shadow-lg relative min-h-[420px]">
      {/* Top Slide Header bar inside meeting */}
      <div className="h-10 bg-[#242C26] border-b border-[#2D3830] px-4 flex items-center justify-between text-xs text-[#A8B6AB]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#83A58E]" />
          <span className="font-medium text-white truncate max-w-[200px] sm:max-w-md">
            Trình chiếu: {currentSlide.title}
          </span>
          <span className="text-[10px] bg-[#2E3A31] text-[#A8B6AB] px-2 py-0.5 rounded">
            Trang {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
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
            <span className="hidden sm:inline text-[11px]">Con trỏ laser</span>
          </button>

          <button
            onClick={onToggleNotes}
            className={`p-1.5 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer ${
              isNotesOpen
                ? 'bg-[#83A58E] text-white'
                : 'text-[#A8B6AB] hover:text-white hover:bg-[#2E3A31]'
            }`}
            title="Mở ghi chú người nói"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Kịch bản</span>
          </button>

          <button
            onClick={onShareScreenClick}
            className="p-1.5 rounded-md text-[#A8B6AB] hover:text-white hover:bg-[#2E3A31] transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="Chia sẻ màn hình (Đợt 2)"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Chia sẻ màn hình</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas Area */}
      <div
        onMouseMove={handleMouseMove}
        className="flex-1 p-4 md:p-8 flex items-center justify-center relative overflow-hidden select-none bg-[#1F2621]"
      >
        {/* The Slide Sheet: styled as a clean 16:9 presentation slide */}
        <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-2xl p-6 md:p-10 flex flex-col justify-between relative border border-[#E4E9E3] text-[#3D4740]">
          {/* Slide Header */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#768078] pb-2 border-b border-[#E4E9E3]">
              <span className="font-semibold text-[#4A6453] uppercase tracking-wider text-[10px]">
                SpeakLab AI · Nghiên cứu Khoa học 2026
              </span>
              <span className="tabular-nums font-mono">
                Slide {currentSlide.slideNumber}
              </span>
            </div>

            <h2 className="text-lg md:text-2xl font-bold text-[#3D4740] mt-3 tracking-tight">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-xs md:text-sm text-[#768078] mt-1 font-medium">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Slide Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto items-center">
            {/* Left Points */}
            <div className="space-y-2.5">
              {currentSlide.contentPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#444F47]">
                  <CheckCircle2 className="w-4 h-4 text-[#83A58E] shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </div>
              ))}

              {currentSlide.keyHighlight && (
                <div className="mt-4 p-3 rounded-lg bg-[#EEF4F0] border border-[#D9E5DC] text-xs font-semibold text-[#2A4433]">
                  💡 {currentSlide.keyHighlight}
                </div>
              )}
            </div>

            {/* Right Graphic Visualization */}
            <div>{renderVisualGraphic(currentSlide.visualGraphicType)}</div>
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E4E9E3] text-[10px] text-[#768078]">
            <span>Người trình bày: Nguyễn Minh Quân · Lớp 11A1</span>
            <span>Phòng họp mô phỏng SpeakLab AI</span>
          </div>

          {/* Simulated Laser pointer red dot */}
          {laserActive && (
            <div
              style={{
                left: `${laserPos.x}%`,
                top: `${laserPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute w-3.5 h-3.5 rounded-full bg-[#E5484D] shadow-[0_0_12px_#E5484D] pointer-events-none transition-transform duration-75 z-20"
            />
          )}
        </div>
      </div>

      {/* Bottom Slide Navigation Bar */}
      <div className="h-12 bg-[#242C26] border-t border-[#2D3830] px-4 flex items-center justify-between text-xs">
        <button
          onClick={onPrevSlide}
          disabled={currentSlideIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-[#2E3A31] hover:bg-[#3B4A3F] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Slide trước</span>
        </button>

        {/* Slide Thumbnail Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSlide(idx)}
              className={`w-7 h-6 rounded flex items-center justify-center font-mono text-[11px] transition-all cursor-pointer ${
                currentSlideIndex === idx
                  ? 'bg-[#83A58E] text-white font-bold'
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
          className="px-3 py-1.5 rounded-lg bg-[#83A58E] hover:bg-[#6F917A] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Slide tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
