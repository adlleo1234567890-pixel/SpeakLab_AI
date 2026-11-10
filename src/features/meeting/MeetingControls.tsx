/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Users,
  FileText,
  Settings,
  PhoneOff,
  Sparkles,
  Presentation
} from 'lucide-react';

interface MeetingControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onShareScreenClick: () => void;
  onToggleAttendees: () => void;
  isAttendeesOpen: boolean;
  attendeeCount: number;
  onToggleNotes: () => void;
  isNotesOpen: boolean;
  onOpenSettings: () => void;
  onEndMeeting: () => void;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  isMuted,
  isCameraOff,
  onToggleMic,
  onToggleCamera,
  onShareScreenClick,
  onToggleAttendees,
  isAttendeesOpen,
  attendeeCount,
  onToggleNotes,
  isNotesOpen,
  onOpenSettings,
  onEndMeeting,
}) => {
  return (
    <div className="h-16 md:h-18 bg-[#1B221D] border-t border-[#2D3930] px-4 flex items-center justify-between shadow-2xl z-30">
      {/* Left: Session metadata & Mode indicator */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#27332A] border border-[#3A4A3E] flex items-center justify-center text-[#83A58E]">
          <Presentation className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-tight">
            Phòng họp mô phỏng
          </p>
          <p className="text-[10px] text-[#A8B6AB] leading-tight">
            Đợt 1 · Trình diễn kiến trúc UI/UX
          </p>
        </div>
      </div>

      {/* Center: Main control buttons */}
      <div className="flex items-center gap-2 md:gap-3 mx-auto">
        {/* Microphone */}
        <button
          onClick={onToggleMic}
          className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
            isMuted
              ? 'bg-[#3D2625] text-[#F09995] hover:bg-[#4D302F] border border-[#5E3230]'
              : 'bg-[#27332A] text-white hover:bg-[#344438] border border-[#3A4A3E]'
          }`}
          title={isMuted ? 'Bật Micro (Mô phỏng)' : 'Tắt Micro (Mô phỏng)'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Camera */}
        <button
          onClick={onToggleCamera}
          className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
            isCameraOff
              ? 'bg-[#3D2625] text-[#F09995] hover:bg-[#4D302F] border border-[#5E3230]'
              : 'bg-[#27332A] text-white hover:bg-[#344438] border border-[#3A4A3E]'
          }`}
          title={isCameraOff ? 'Bật Camera (Mô phỏng)' : 'Tắt Camera (Mô phỏng)'}
        >
          {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Share Screen (notice) */}
        <button
          onClick={onShareScreenClick}
          className="p-3 rounded-xl bg-[#27332A] text-[#A8B6AB] hover:text-white hover:bg-[#344438] border border-[#3A4A3E] transition-all cursor-pointer hidden sm:flex items-center justify-center"
          title="Chia sẻ màn hình (Tính năng Đợt 2)"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Attendees List Toggle */}
        <button
          onClick={onToggleAttendees}
          className={`p-3 rounded-xl transition-all cursor-pointer relative ${
            isAttendeesOpen
              ? 'bg-[#83A58E] text-white font-semibold'
              : 'bg-[#27332A] text-[#A8B6AB] hover:text-white hover:bg-[#344438] border border-[#3A4A3E]'
          }`}
          title="Mở danh sách người tham dự mô phỏng"
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#83A58E] text-white text-[9px] font-bold flex items-center justify-center border border-[#1B221D]">
            {attendeeCount}
          </span>
        </button>

        {/* Presenter Notes */}
        <button
          onClick={onToggleNotes}
          className={`p-3 rounded-xl transition-all cursor-pointer ${
            isNotesOpen
              ? 'bg-[#83A58E] text-white font-semibold'
              : 'bg-[#27332A] text-[#A8B6AB] hover:text-white hover:bg-[#344438] border border-[#3A4A3E]'
          }`}
          title="Kịch bản thuyết trình"
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-xl bg-[#27332A] text-[#A8B6AB] hover:text-white hover:bg-[#344438] border border-[#3A4A3E] transition-all cursor-pointer"
          title="Cài đặt phòng họp mô phỏng"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Right: End Meeting CTA */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEndMeeting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#873631] hover:bg-[#A33E37] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">Kết thúc buổi luyện</span>
        </button>
      </div>
    </div>
  );
};
