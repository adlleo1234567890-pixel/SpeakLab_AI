/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChevronLeft,
  Users,
  Presentation,
  Sparkles,
  Info,
  Sliders,
  Share2,
  Video,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  UserProfile,
  PracticeSession,
  PresentationDeck,
  VirtualParticipant,
  ActivePage,
  PresentationSource
} from '../types';
import { SlideViewer } from '../features/meeting/SlideViewer';
import { ParticipantGrid } from '../features/meeting/ParticipantGrid';
import { PresenterCameraBox } from '../features/meeting/PresenterCameraBox';
import { MeetingControls } from '../features/meeting/MeetingControls';
import { AttendeeDrawer } from '../features/meeting/AttendeeDrawer';
import { PresenterNotesDrawer } from '../features/meeting/PresenterNotesDrawer';
import { EndMeetingModal } from '../features/meeting/EndMeetingModal';
import { ScreenShareGuideModal } from '../features/meeting/ScreenShareGuideModal';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { pptxSessionStore } from '../services/pptxService';
import { screenShareService } from '../services/screenShareService';

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
  const [activeSource, setActiveSource] = useState<PresentationSource | undefined>(
    session.presentationSource
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(145); // start with realistic ~2m25s demo time
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Screen Share State (Phase 2.3 & 2.4)
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [previousSource, setPreviousSource] = useState<PresentationSource | undefined>(undefined);
  const [showShareGuideModal, setShowShareGuideModal] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Modals & Notices
  const [showEndModal, setShowEndModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCameraNoticeModal, setShowCameraNoticeModal] = useState(false);
  const [showTitleDetailModal, setShowTitleDetailModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    judge: string;
    text: string;
  } | null>(null);

  // Mobile View Switcher: 'slide' | 'audience' | 'camera'
  const [mobileTab, setMobileTab] = useState<'slide' | 'audience' | 'camera'>('slide');

  // Stop Screen Share handler
  const handleStopScreenShare = () => {
    screenShareService.stopShare(screenStream);
    setScreenStream(null);
    setIsScreenSharing(false);

    if (previousSource) {
      setActiveSource(previousSource);
    } else {
      setActiveSource(
        session.presentationSource || {
          type: 'demo',
          deckId: deck.id,
          name: deck.title,
          slideCount: deck.slides.length,
          status: 'ready',
        }
      );
    }
  };

  // Start Screen Share handler
  const handleStartScreenShare = async () => {
    setShowShareGuideModal(false);

    const capability = screenShareService.getCapability();
    if (!capability.isSupported) {
      setShareError(capability.friendlyNotice);
      return;
    }

    try {
      const stream = await screenShareService.startShare();

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          // Native "Stop sharing" floating bar clicked in browser
          handleStopScreenShare();
        };
      }

      setPreviousSource(activeSource);
      setScreenStream(stream);
      setIsScreenSharing(true);
      setActiveSource({
        type: 'screenShare',
        name: 'Cửa sổ PowerPoint (Animation trực tiếp)',
        slideCount: activeSource?.slideCount || 1,
        status: 'ready',
        stream,
      });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'name' in err && err.name === 'NotAllowedError') {
        // User closed or dismissed the browser picker
        console.log('Người dùng đã đóng hộp thoại chia sẻ màn hình.');
      } else {
        const msg = err instanceof Error ? err.message : capability.friendlyNotice;
        console.error('Lỗi khi kích hoạt Screen Capture:', err);
        setShareError(msg);
      }
    }
  };

  // Cleanup screen tracks on unmount
  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [screenStream]);

  // Elapsed time counter with clean lifecycle management
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalSlides = activeSource?.type === 'pptx' ? (activeSource.slideCount || 1) : deck.slides.length;

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#181F1A] text-white select-none">
      {/* 1. Meeting Top Bar */}
      <header className="h-12 sm:h-14 bg-[#1E2620] border-b border-[#2C382F] px-2 sm:px-4 md:px-5 flex items-center justify-between z-30 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1 sm:p-1.5 rounded-lg text-[#A8B6AB] hover:text-white hover:bg-[#2A362D] transition-colors cursor-pointer shrink-0"
            title="Thoát về Tổng quan"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1
                onClick={() => setShowTitleDetailModal(true)}
                className="text-xs md:text-sm font-bold text-white tracking-tight truncate max-w-[120px] sm:max-w-xs md:max-w-md cursor-pointer hover:underline"
                title="Bấm để xem tên đầy đủ"
              >
                {session.title}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-[#83A58E] bg-[#28352B] px-2 py-0.5 rounded border border-[#38493B] shrink-0">
                {session.modeTitle}
              </span>
            </div>
            <p className="text-[10px] text-[#A8B6AB] hidden md:block">
              Phòng họp trực tuyến giả lập · SpeakLab AI
            </p>
          </div>
        </div>

        {/* Center: Live timer & Recording status */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-[#151C17] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#2A362D] shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-medium text-[#83A58E]">
            <span className="w-2 h-2 rounded-full bg-[#E5484D] animate-ping" />
            <span className="tabular-nums">{formatTimer(elapsedSeconds)}</span>
            <span className="text-[#6D7F72]">/ {formatTimer(session.durationSeconds)}</span>
          </div>

          <span className="hidden sm:inline-block text-[10px] text-[#A8B6AB] border-l border-[#2A362D] pl-2">
            Ghi hình mô phỏng
          </span>
        </div>

        {/* Right: Mobile View Tabs & End button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Tab switchers (Slide / Audience / Camera) */}
          <div className="lg:hidden flex items-center bg-[#253027] p-0.5 rounded-lg border border-[#37473A]">
            <button
              onClick={() => setMobileTab('slide')}
              className={`px-2 py-1 text-[10px] sm:text-xs rounded font-medium transition-colors cursor-pointer ${
                mobileTab === 'slide' ? 'bg-[#83A58E] text-white font-semibold shadow-2xs' : 'text-[#A8B6AB]'
              }`}
            >
              Slide
            </button>
            <button
              onClick={() => setMobileTab('audience')}
              className={`px-2 py-1 text-[10px] sm:text-xs rounded font-medium transition-colors cursor-pointer ${
                mobileTab === 'audience' ? 'bg-[#83A58E] text-white font-semibold shadow-2xs' : 'text-[#A8B6AB]'
              }`}
            >
              Hội đồng ({participants.length})
            </button>
            <button
              onClick={() => setMobileTab('camera')}
              className={`px-2 py-1 text-[10px] sm:text-xs rounded font-medium transition-colors cursor-pointer ${
                mobileTab === 'camera' ? 'bg-[#83A58E] text-white font-semibold shadow-2xs' : 'text-[#A8B6AB]'
              }`}
            >
              Camera
            </button>
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            className="text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#873631] hover:bg-[#A33E37] text-white font-medium transition-colors cursor-pointer shrink-0 min-h-[32px] sm:min-h-[36px] flex items-center justify-center"
          >
            Kết thúc
          </button>
        </div>
      </header>

      {/* Simulated Question Banner / Toast if triggered */}
      {activeQuestion && (
        <div className="bg-[#2D3930] border-b border-[#3E4F41] px-3 sm:px-4 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200 z-20">
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
            className="text-[#A8B6AB] hover:text-white px-2 py-1 ml-3 rounded bg-[#1C241E] text-[10px] sm:text-[11px] shrink-0 border border-[#3A4A3E] cursor-pointer"
          >
            Đã trả lời / Đóng
          </button>
        </div>
      )}

      {/* 2. Main Conference Stage (Responsive Layout) */}
      <div className="flex-1 flex overflow-hidden p-1.5 sm:p-2 md:p-4 gap-2 md:gap-3 relative min-h-0">
        {/* Left / Center Work Area */}
        <div className="flex-1 flex flex-col gap-2 md:gap-3 min-w-0 min-h-0 overflow-hidden">
          {/* Top Audience & Juror Video Strip (Horizontal Carousel on Desktop or when mobileTab === 'audience') */}
          <div
            className={`shrink-0 ${
              mobileTab === 'audience' ? 'block flex-1 overflow-y-auto' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] text-[#A8B6AB] mb-1.5 px-1">
              <span>Hội đồng mô phỏng ({participants.length} người)</span>
              <span className="text-[10px] text-[#83A58E]">Bấm vào giám khảo để mô phỏng đặt câu hỏi</span>
            </div>
            <ParticipantGrid
              participants={participants}
              onParticipantClick={(p) => handleTriggerSimulatedQuestion(p.name)}
            />
          </div>

          {/* Main Presentation Stage & Presenter Camera Tile */}
          <div className="flex-1 flex flex-col lg:flex-row gap-2 md:gap-3 min-h-0 overflow-hidden">
            {/* Slide Presentation Canvas */}
            <div
              className={`flex-1 flex flex-col min-h-0 h-full overflow-hidden ${
                mobileTab === 'slide' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <SlideViewer
                slides={deck.slides}
                currentSlideIndex={currentSlideIndex}
                onPrevSlide={handlePrevSlide}
                onNextSlide={handleNextSlide}
                onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
                onShareScreenClick={() => setShowShareGuideModal(true)}
                onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
                isNotesOpen={isNotesOpen}
                presentationSource={activeSource}
                screenStream={screenStream}
                onStopScreenShare={handleStopScreenShare}
                onSwitchToDemo={() =>
                  setActiveSource({
                    type: 'demo',
                    deckId: deck.id,
                    name: deck.title,
                    slideCount: deck.slides.length,
                    status: 'ready',
                  })
                }
              />
            </div>

            {/* Presenter Camera Box (Sidebar on large screens or dedicated tab on mobile) */}
            <div
              className={`lg:w-80 shrink-0 flex flex-col gap-3 ${
                mobileTab === 'camera' ? 'flex flex-1 overflow-y-auto' : 'hidden lg:flex'
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
                    {activeSource?.type === 'screenShare'
                      ? 'Live Screen Share'
                      : activeSource?.type === 'pptx'
                      ? `${activeSource.slideCount} slides PPTX`
                      : `Slide ${currentSlideIndex + 1}/${deck.slides.length}`}
                  </span>
                </div>
                <p className="text-[11px] text-[#C4D3C7] leading-relaxed">
                  {activeSource?.type === 'screenShare' ? (
                    <>
                      Bạn đang <strong>chia sẻ màn hình PowerPoint có hiệu ứng</strong>. Mọi hiệu ứng chuyển động và hoạt họa đang được truyền phát trực tiếp đến hội đồng.
                    </>
                  ) : activeSource?.type === 'pptx' ? (
                    <>
                      Bạn đang diễn tập với tệp: <strong>{activeSource.name}</strong>. Hội đồng mô phỏng đang lắng nghe phần trình bày mở đầu của bạn.
                    </>
                  ) : (
                    <>
                      Bạn đang ở phần: <strong>{deck.slides[currentSlideIndex]?.title}</strong>. Thầy cô giám khảo đang theo dõi kỹ phương pháp và số liệu.
                    </>
                  )}
                </p>
                <div className="pt-2 border-t border-[#2C392F] flex items-center justify-between text-[11px]">
                  <span>Hội đồng: {participants.filter((p) => p.role === 'judge').length} giám khảo</span>
                  <button
                    onClick={() => setIsNotesOpen(true)}
                    className="text-[#83A58E] hover:underline font-medium cursor-pointer"
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
          totalSlides={totalSlides}
          customTitle={activeSource?.type === 'pptx' ? `Slide ${currentSlideIndex + 1} · ${activeSource.name}` : undefined}
          customNotes={activeSource?.type === 'pptx' ? pptxSessionStore.getSlideNotes(currentSlideIndex) : undefined}
        />
      </div>

      {/* 3. Bottom Meeting Controls Dock */}
      <MeetingControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMic={() => setIsMuted(!isMuted)}
        onToggleCamera={() => setIsCameraOff(!isCameraOff)}
        onShareScreenClick={() => setShowShareGuideModal(true)}
        isScreenSharing={isScreenSharing}
        onStopScreenShare={handleStopScreenShare}
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

      {/* Title Details Modal for Mobile */}
      <Modal
        isOpen={showTitleDetailModal}
        onClose={() => setShowTitleDetailModal(false)}
        title="Thông tin buổi thuyết trình"
        subtitle="Chi tiết cấu hình phòng họp mô phỏng"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowTitleDetailModal(false)}>
            Đóng
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#3D4740]">
          <div>
            <span className="text-[#768078] block text-[11px]">Tên đề tài:</span>
            <p className="font-bold text-sm mt-0.5">{session.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4E9E3]">
            <div>
              <span className="text-[#768078] text-[11px]">Chế độ:</span>
              <p className="font-semibold text-[#4A6453]">{session.modeTitle}</p>
            </div>
            <div>
              <span className="text-[#768078] text-[11px]">Chủ đề:</span>
              <p className="font-semibold">{session.topic}</p>
            </div>
            <div>
              <span className="text-[#768078] text-[11px]">Thời lượng mục tiêu:</span>
              <p className="font-semibold font-mono">{Math.floor(session.durationSeconds / 60)} phút</p>
            </div>
            <div>
              <span className="text-[#768078] text-[11px]">Thính giả mô phỏng:</span>
              <p className="font-semibold">{participants.length} người</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* End Meeting Confirmation Modal */}
      <EndMeetingModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        elapsedSeconds={elapsedSeconds}
        onConfirmViewReport={() => {
          handleStopScreenShare();
          setIsTimerRunning(false);
          setShowEndModal(false);
          onFinishSession();
        }}
        onReturnToDashboard={() => {
          handleStopScreenShare();
          setIsTimerRunning(false);
          setShowEndModal(false);
          onNavigate('dashboard');
        }}
      />

      {/* Screen Share 5-Step Guidance Modal (Phase 2.3) */}
      <ScreenShareGuideModal
        isOpen={showShareGuideModal}
        onClose={() => setShowShareGuideModal(false)}
        onConfirmStartShare={handleStartScreenShare}
      />

      {/* Screen Share Error / Browser Support Notice Modal */}
      <Modal
        isOpen={Boolean(shareError)}
        onClose={() => setShareError(null)}
        title="Thông báo chia sẻ màn hình"
        subtitle="Không thể bắt đầu truyền luồng màn hình"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShareError(null)}>
            Đã hiểu / Tiếp tục dùng slide nội bộ
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#3D4740]">
          <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E4E9E3] text-[11px] leading-relaxed space-y-2">
            <p className="font-semibold text-[#873631]">Gặp vấn đề khi cấp quyền chia sẻ:</p>
            <p className="text-[#556057]">{shareError}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#EEF4F0] border border-[#D9E5DC] text-[11px] text-[#2A4433]">
            💡 Bạn vẫn có thể tiếp tục diễn tập thuyết trình và phản biện bằng <strong>Chế độ trình chiếu PPTX nội bộ</strong> hoặc <strong>Slide mẫu</strong> đã chuẩn bị sẵn.
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
