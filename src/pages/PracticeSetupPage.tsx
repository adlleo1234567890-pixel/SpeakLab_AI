/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Presentation,
  Shield,
  MessageSquare,
  Users,
  Clock,
  FileText,
  Upload,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  CheckCircle2,
  FileUp,
  Sliders
} from 'lucide-react';
import {
  PracticeModeType,
  PracticeMode,
  PresentationDeck
} from '../types';
import { Button } from '../components/ui/Button';
import { DemoNotice } from '../components/ui/DemoNotice';

interface PracticeSetupPageProps {
  availableModes: PracticeMode[];
  availableDecks: PresentationDeck[];
  onStartSession: (config: {
    title: string;
    modeId: PracticeModeType;
    deckId: string;
    participantCount: number;
    durationMinutes: number;
  }) => void;
  onCancel: () => void;
}

export const PracticeSetupPage: React.FC<PracticeSetupPageProps> = ({
  availableModes,
  availableDecks,
  onStartSession,
  onCancel,
}) => {
  const [selectedModeId, setSelectedModeId] = useState<PracticeModeType>('defense');
  const [sessionTitle, setSessionTitle] = useState('Bảo vệ Đề tài: Phân loại Rác Thông minh bằng AI');
  const [selectedDeckId, setSelectedDeckId] = useState<string>(availableDecks[0]?.id || '');
  const [participantCount, setParticipantCount] = useState<number>(6);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [showUploadNotice, setShowUploadNotice] = useState(false);

  const selectedMode =
    availableModes.find((m) => m.id === selectedModeId) || availableModes[0];
  const selectedDeck =
    availableDecks.find((d) => d.id === selectedDeckId) || availableDecks[0];

  const handleStart = () => {
    onStartSession({
      title: sessionTitle || `Buổi luyện: ${selectedMode.title}`,
      modeId: selectedModeId,
      deckId: selectedDeckId,
      participantCount,
      durationMinutes,
    });
  };

  const getModeIcon = (modeId: PracticeModeType) => {
    switch (modeId) {
      case 'basic':
        return <Presentation className="w-5 h-5 text-[#4A6954]" />;
      case 'defense':
        return <Shield className="w-5 h-5 text-[#324C3B]" />;
      case 'debate':
        return <MessageSquare className="w-5 h-5 text-[#5A7D65]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <DemoNotice
        title="Thiết lập phòng luyện tập mô phỏng"
        message="Trong Đợt 1, các thông số phòng họp và hội đồng được mô phỏng trực quan để bạn làm quen với trải nghiệm trước khi kết nối hệ thống phân tích AI."
      />

      <div className="bg-white rounded-2xl border border-[#E4E9E3] p-6 md:p-8 shadow-xs space-y-8">
        {/* Section 1: Choose Practice Mode */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#3D4740]">
                1. Chọn chế độ luyện tập
              </h3>
              <p className="text-xs text-[#768078] mt-0.5">
                Mỗi chế độ có cấu hình hội đồng và mức độ phản biện khác nhau
              </p>
            </div>
            <span className="text-xs font-semibold text-[#4A6453] bg-[#EEF4F0] px-2.5 py-1 rounded-md border border-[#D9E5DC]">
              3 chế độ dự kiến
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableModes.map((mode) => {
              const isSelected = selectedModeId === mode.id;

              return (
                <div
                  key={mode.id}
                  onClick={() => {
                    setSelectedModeId(mode.id);
                    setDurationMinutes(mode.defaultDurationMinutes);
                  }}
                  className={`relative p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#F2F6F3] border-[#83A58E] shadow-sm ring-1 ring-[#83A58E]'
                      : 'bg-white border-[#E4E9E3] hover:border-[#83A58E]/60 hover:bg-[#F7F9F6]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-[#E4E9E3] flex items-center justify-center shadow-2xs">
                        {getModeIcon(mode.id)}
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white border border-[#E4E9E3] text-[#556057]">
                        {mode.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#3D4740]">
                      {mode.title}
                    </h4>
                    <p className="text-xs text-[#768078] mt-1 leading-relaxed">
                      {mode.tagline}
                    </p>

                    <ul className="mt-3.5 space-y-1.5 text-[11px] text-[#556057]">
                      {mode.highlightFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5A7D65] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E4E9E3]/70 flex items-center justify-between text-[11px] text-[#768078]">
                    <span>
                      {mode.juryCount} giám khảo · {mode.audienceCount} thính giả
                    </span>
                    <span className="font-medium text-[#3D4740]">
                      ~{mode.defaultDurationMinutes} phút
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Session Name & Parameters */}
        <div className="pt-6 border-t border-[#E4E9E3]">
          <h3 className="text-base md:text-lg font-bold text-[#3D4740] mb-4">
            2. Thông tin buổi thuyết trình
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D4740] mb-1.5">
                Tên buổi luyện / Đề tài
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Ví dụ: Thuyết trình Dự án Nghiên cứu Khoa học 2026..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E4E9E3] text-sm text-[#3D4740] focus:outline-none focus:ring-2 focus:ring-[#83A58E] focus:border-transparent transition-all shadow-2xs"
              />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] text-[#768078]">Gợi ý nhanh:</span>
                {[
                  'Bảo vệ Đề tài: AI Phân loại Rác Học đường',
                  'Kế hoạch Khởi nghiệp Xanh: Bao bì EcoHusk',
                  'Bài nói Kỹ năng Tranh biện Tự do',
                ].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSessionTitle(sug)}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#F7F9F6] text-[#556057] hover:bg-[#EEF4F0] hover:text-[#324C3B] border border-[#E4E9E3] transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Target Duration */}
              <div>
                <label className="block text-xs font-semibold text-[#3D4740] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5A7D65]" />
                  <span>Thời lượng mục tiêu</span>
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        durationMinutes === mins
                          ? 'bg-[#EEF4F0] text-[#324C3B] border-[#83A58E] font-semibold'
                          : 'bg-white text-[#556057] border-[#E4E9E3] hover:bg-[#F7F9F6]'
                      }`}
                    >
                      {mins} phút
                    </button>
                  ))}
                </div>
              </div>

              {/* Participant Count */}
              <div>
                <label className="block text-xs font-semibold text-[#3D4740] mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#5A7D65]" />
                  <span>Quy mô thính giả mô phỏng</span>
                </label>
                <div className="flex items-center gap-2">
                  {[3, 6, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setParticipantCount(cnt)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        participantCount === cnt
                          ? 'bg-[#EEF4F0] text-[#324C3B] border-[#83A58E] font-semibold'
                          : 'bg-white text-[#556057] border-[#E4E9E3] hover:bg-[#F7F9F6]'
                      }`}
                    >
                      {cnt} người
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Presentation Deck Preparation */}
        <div className="pt-6 border-t border-[#E4E9E3]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#3D4740]">
                3. Tài liệu trình chiếu
              </h3>
              <p className="text-xs text-[#768078] mt-0.5">
                Chọn bộ slide mẫu hoặc xem trước khu vực tải tệp trình chiếu
              </p>
            </div>
            <span className="text-xs text-[#768078]">
              {selectedDeck.slides.length} trang slide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {availableDecks.map((deck) => {
              const isDeckSelected = selectedDeckId === deck.id;
              return (
                <div
                  key={deck.id}
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isDeckSelected
                      ? 'bg-[#EEF4F0] border-[#83A58E] ring-1 ring-[#83A58E]'
                      : 'bg-white border-[#E4E9E3] hover:bg-[#F7F9F6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#4A6453] bg-white px-2 py-0.5 rounded border border-[#D9E5DC]">
                      {deck.category}
                    </span>
                    <span className="text-xs text-[#768078]">
                      {deck.slides.length} slides
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#3D4740]">
                    {deck.title}
                  </h4>
                  <p className="text-xs text-[#768078] mt-1 leading-relaxed line-clamp-2">
                    {deck.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Upload Placeholder for Phase 2 */}
          <div
            onClick={() => setShowUploadNotice(true)}
            className="border-2 border-dashed border-[#D9E5DC] rounded-xl p-6 text-center hover:bg-[#F7F9F6] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#EEF4F0] text-[#4A6453] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#3D4740]">
              Tải lên tệp slide PowerPoint (.pptx) hoặc PDF của bạn
            </p>
            <p className="text-[11px] text-[#768078] mt-1">
              Khu vực chuẩn bị cho Đợt 2 · Hiện tại hệ thống sử dụng các bộ slide mẫu phong phú có sẵn
            </p>
            <span className="inline-block mt-2 text-[10px] font-medium text-[#556057] bg-white px-2.5 py-0.5 rounded border border-[#E4E9E3]">
              Bấm để xem thông tin tính năng
            </span>
          </div>

          {showUploadNotice && (
            <div className="mt-3 p-3 rounded-lg bg-[#FAFBF9] border border-[#E4E9E3] text-xs text-[#556057] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#83A58E] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#3D4740]">
                  Ghi chú phạm vi Đợt 1
                </p>
                <p className="mt-0.5 text-[#768078]">
                  Để đảm bảo tính độc lập và kiểm thử UI/UX mượt mà, ở Đợt 1 bạn có thể sử dụng các bộ slide mẫu tương tác đầy đủ đã được tích hợp sẵn phía trên. Trình parser tệp PPTX/PDF trực tiếp từ máy tính sẽ được bổ sung ở Đợt 2.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#E4E9E3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Quay lại Tổng quan
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={handleStart}
            className="w-full sm:w-auto px-8"
          >
            Vào phòng luyện tập
          </Button>
        </div>
      </div>
    </div>
  );
};
