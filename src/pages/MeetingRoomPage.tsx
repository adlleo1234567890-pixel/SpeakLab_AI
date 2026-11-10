/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Circle,
  FileCheck,
  ChevronLeft,
  Users,
  Presentation,
  Sparkles,
  Info,
  Sliders,
  Share2,
  AlertCircle
} from 'lucide-react';
import {
  UserProfile,
  PracticeSession,
  PresentationDeck,
  VirtualParticipant,
  ActivePage
} from '../types';
import { SlideViewer } from '../features/meeting/SlideViewer';
import { ParticipantGrid } from '../features/meeting/ParticipantGrid';
import { PresenterCameraBox } from '../features/meeting/PresenterCameraBox';
import { MeetingControls } from '../features/meeting/MeetingControls';
import { AttendeeDrawer } from '../features/meeting/AttendeeDrawer';
import { PresenterNotesDrawer } from '../features/meeting/PresenterNotesDrawer';
import { EndMeetingModal } from '../features/meeting/EndMeetingModal';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

interface MeetingRoomPageProps {
  currentUser: UserProfile;
  session: PracticeSession;
  deck: PresentationDeck;
  participants: VirtualParticipant[];
  onNavigate: (page: ActivePage) => void;
  onFinishSession: () => void;
}

export const MeetingRoomPage: React.FC<MeetingRoomPageProps> = ({
  currentUser,
  session,
  deck,
  participants,
  onNavigate,
  onFinishSession,
}) => {
  // Presentation & Meeting State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(145); // start with realistic ~2m25s demo time
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Modals & Notices
  const [showEndModal, setShowEndModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCameraNoticeModal, setShowCameraNoticeModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    judge: string;
    text: string;
  } | null>(null);

  // Mobile View Switcher: 'slide' | 'stage'
  const [mobileTab, setMobileTab] = useState<'slide' | 'stage'>('slide');

  // Elapsed time counter
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < deck.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleTriggerSimulatedQuestion = (judgeName: string) => {
    setActiveQuestion({
      judge: judgeName,
      text: `Chào em Quân, thầy muốn hỏi thêm về tính khả thi của hệ thống camera khi căng-tin vào giờ cao điểm, ánh sáng yếu hoặc học sinh bỏ rác liên tục thì thuật toán xử lý thế nào?`,
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#181F1A] text-white">
      {/* 1. Meeting Top Bar */}
      <header className="h-14 bg-[#1E2620] border-b border-[#2C382F] px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg text-[#A8B6AB] hover:text-white hover:bg-[#2A362D] transition-colors cursor-pointer"
            title="Thoát về Tổng quan"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs md:text-sm font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
                {session.title}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-[#83A58E] bg-[#28352B] px-2 py-0.5 rounded border border-[#38493B]">
                {session.modeTitle}
              </span>
            </div>
            <p className="text-[10px] text-[#A8B6AB] hidden md:block">
              Phòng họp trực tuyến giả lập · SpeakLab AI
            </p>
          </div>
        </div>

        {/* Center: Live timer & Recording status */}
        <div className="flex items-center gap-3 bg-[#151C17] px-3 py-1.5 rounded-lg border border-[#2A362D]">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#83A58E]">
            <span className="w-2 h-2 rounded-full bg-[#E5484D] animate-ping" />
            <span className="tabular-nums">{formatTimer(elapsedSeconds)}</span>
            <span className="text-[#6D7F72]">/ {formatTimer(session.durationSeconds)}</span>
          </div>

          <span className="hidden sm:inline-block text-[10px] text-[#A8B6AB] border-l border-[#2A362D] pl-2">
            Ghi hình mô phỏng
          </span>
        </div>

        {/* Right: End button and Attendee counter */}
        <div className="flex items-center gap-2">
          {/* Mobile Tab switchers */}
          <div className="md:hidden flex items-center bg-[#253027] p-0.5 rounded-lg border border-[#37473A]">
            <button
              onClick={() => setMobileTab('slide')}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors ${
                mobileTab === 'slide' ? 'bg-[#83A58E] text-white' : 'text-[#A8B6AB]'
              }`}
            >
              Slide
            </button>
            <button
              onClick={() => setMobileTab('stage')}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors ${
                mobileTab === 'stage' ? 'bg-[#83A58E] text-white' : 'text-[#A8B6AB]'
              }`}
            >
              Hội đồng
            </button>
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#873631] hover:bg-[#A33E37] text-white font-medium transition-colors cursor-pointer"
          >
            Kết thúc
          </button>
        </div>
      </header>

      {/* Simulated Question Banner / Toast if triggered */}
      {activeQuestion && (
        <div className="bg-[#2D3930] border-b border-[#3E4F41] px-4 py-2.5 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E8C27B] mt-1.5 shrink-0" />
            <div>
              <span className="font-bold text-[#E8C27B]">
                {activeQuestion.judge} (Đặt câu hỏi phản biện mô phỏng):
              </span>{' '}
              <span className="text-[#D8E6DC]">{activeQuestion.text}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveQuestion(null)}
            className="text-[#A8B6AB] hover:text-white px-2 py-1 ml-4 rounded bg-[#1C241E] text-[11px] shrink-0"
          >
            Đã trả lời / Đóng
          </button>
        </div>
      )}

      {/* 2. Main Conference Stage (Responsive Layout) */}
      <div className="flex-1 flex overflow-hidden p-2 md:p-4 gap-3 relative">
        {/* Left / Center Work Area */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-y-auto">
          {/* Top Audience & Juror Video Strip (Horizontal Carousel) */}
          <div className={`shrink-0 ${mobileTab === 'stage' ? 'block' : 'hidden md:block'}`}>
            <ParticipantGrid
              participants={participants}
              onParticipantClick={(p) => handleTriggerSimulatedQuestion(p.name)}
            />
          </div>

          {/* Main Presentation Stage & Presenter Camera Tile */}
          <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
            {/* Slide Presentation Canvas */}
            <div
              className={`flex-1 flex flex-col min-h-0 ${
                mobileTab === 'slide' ? 'flex' : 'hidden md:flex'
              }`}
            >
              <SlideViewer
                slides={deck.slides}
                currentSlideIndex={currentSlideIndex}
                onPrevSlide={handlePrevSlide}
                onNextSlide={handleNextSlide}
                onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
                onShareScreenClick={() => setShowShareModal(true)}
                onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
                isNotesOpen={isNotesOpen}
              />
            </div>

            {/* Presenter Camera Box (Sidebar on large screens or docked below) */}
            <div
              className={`lg:w-80 shrink-0 flex flex-col gap-3 ${
                mobileTab === 'stage' ? 'block' : 'hidden lg:flex'
              }`}
            >
              <PresenterCameraBox
                currentUser={currentUser}
                isMuted={isMuted}
                isCameraOff={isCameraOff}
                onToggleMic={() => setIsMuted(!isMuted)}
                onToggleCamera={() => setIsCameraOff(!isCameraOff)}
                onShowCameraNotice={() => setShowCameraNoticeModal(true)}
              />

              {/* Quick Session Coach Card */}
              <div className="p-3.5 rounded-2xl bg-[#1E2620] border border-[#2D3930] text-xs text-[#A8B6AB] space-y-2">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span className="flex items-center gap-1.5 text-xs text-[#83A58E]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Chỉ dẫn buổi nói
                  </span>
                  <span className="text-[10px] text-[#8C9E91] font-mono">
                    Slide {currentSlideIndex + 1}/{deck.slides.length}
                  </span>
                </div>
                <p className="text-[11px] text-[#C4D3C7] leading-relaxed">
                  Bạn đang ở phần: <strong>{deck.slides[currentSlideIndex]?.title}</strong>. Thầy cô giám khảo đang theo dõi kỹ phương pháp và số liệu.
                </p>
                <div className="pt-2 border-t border-[#2C392F] flex items-center justify-between text-[11px]">
                  <span>Hội đồng: {participants.filter((p) => p.role === 'judge').length} giám khảo</span>
                  <button
                    onClick={() => setIsNotesOpen(true)}
                    className="text-[#83A58E] hover:underline font-medium"
                  >
                    Xem kịch bản thoại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Drawers */}
        <AttendeeDrawer
          isOpen={isAttendeesOpen}
          onClose={() => setIsAttendeesOpen(false)}
          participants={participants}
          onTriggerSimulatedQuestion={handleTriggerSimulatedQuestion}
        />

        <PresenterNotesDrawer
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
          slide={deck.slides[currentSlideIndex] || deck.slides[0]}
          currentSlideIndex={currentSlideIndex}
          totalSlides={deck.slides.length}
        />
      </div>

      {/* 3. Bottom Meeting Controls Dock */}
      <MeetingControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMic={() => setIsMuted(!isMuted)}
        onToggleCamera={() => setIsCameraOff(!isCameraOff)}
        onShareScreenClick={() => setShowShareModal(true)}
        onToggleAttendees={() => {
          setIsAttendeesOpen(!isAttendeesOpen);
          setIsNotesOpen(false);
        }}
        isAttendeesOpen={isAttendeesOpen}
        attendeeCount={participants.length}
        onToggleNotes={() => {
          setIsNotesOpen(!isNotesOpen);
          setIsAttendeesOpen(false);
        }}
        isNotesOpen={isNotesOpen}
        onOpenSettings={() => setShowSettingsModal(true)}
        onEndMeeting={() => setShowEndModal(true)}
      />

      {/* 4. Modals */}

      {/* End Meeting Confirmation Modal */}
      <EndMeetingModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        elapsedSeconds={elapsedSeconds}
        onConfirmViewReport={() => {
          setShowEndModal(false);
          onFinishSession();
        }}
        onReturnToDashboard={() => {
          setShowEndModal(false);
          onNavigate('dashboard');
        }}
      />

      {/* Share Screen Info Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Chia sẻ màn hình"
        subtitle="Tính năng dự kiến tích hợp trong Đợt 2"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowShareModal(false)}>
            Đã hiểu
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#3D4740]">
          <div className="p-3 bg-[#EEF4F0] rounded-xl border border-[#D9E5DC] flex items-start gap-2.5">
            <Share2 className="w-4 h-4 text-[#83A58E] shrink-0 mt-0.5" />
            <p>
              Trong phiên bản Đợt 1, bạn có thể chuyển đổi linh hoạt các trang slide mẫu trực tiếp qua thanh công cụ trình chiếu. Chức năng truyền hình ảnh chia sẻ màn hình máy tính thông qua Screen Capture Web API sẽ được mở khóa ở Đợt 2.
            </p>
          </div>
        </div>
      </Modal>

      {/* Camera Info Notice Modal */}
      <Modal
        isOpen={showCameraNoticeModal}
        onClose={() => setShowCameraNoticeModal(false)}
        title="Thông tin Camera học sinh"
        subtitle="Chế độ hiển thị mô phỏng khung hình Đợt 1"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowCameraNoticeModal(false)}>
            Đóng
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#3D4740]">
          <p>
            Ô video của bạn hiện tại sử dụng khung hình định vị (placeholder) để hoàn thiện bố cục giao diện phòng họp.
          </p>
          <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E4E9E3] space-y-1.5 text-[11px] text-[#556057]">
            <p className="font-semibold text-[#3D4740]">Kế hoạch cho Đợt 2:</p>
            <p>· Kích hoạt luồng video trực tiếp từ webcam học sinh qua MediaDevices API.</p>
            <p>· Khung nhận diện AI đo góc quay mặt và tỷ lệ giao tiếp mắt với thính giả.</p>
            <p>· Phát hiện các cử chỉ tay bối rối hoặc ngập ngừng.</p>
          </div>
        </div>
      </Modal>

      {/* Meeting Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Cài đặt phòng họp mô phỏng"
        subtitle="Tùy chọn hiển thị và mức độ phản biện của hội đồng"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowSettingsModal(false)}>
            Lưu cài đặt
          </Button>
        }
      >
        <div className="space-y-4 text-xs text-[#3D4740]">
          <div>
            <label className="block font-semibold mb-1">Mức độ tương tác của hội đồng AI</label>
            <select className="w-full p-2 rounded-lg border border-[#E4E9E3] bg-white text-xs text-[#3D4740]">
              <option>Tiêu chuẩn (Gật đầu và đặt 1-2 câu hỏi khi kết thúc)</option>
              <option>Nâng cao (Phản biện ngắt quãng, thử thách phản xạ)</option>
              <option>Thân thiện (Tập trung lắng nghe, khuyến khích)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Độ trễ phản hồi âm thanh mô phỏng</label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#768078]">Tự nhiên (1.5s)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAFBF9] border border-[#E4E9E3] text-[11px] text-[#768078]">
            Lưu ý: Tất cả các cài đặt đều có hiệu lực trên môi trường mô phỏng cục bộ của Đợt 1.
          </div>
        </div>
      </Modal>
    </div>
  );
};
