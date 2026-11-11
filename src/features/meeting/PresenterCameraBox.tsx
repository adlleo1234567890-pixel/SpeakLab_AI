/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CameraOff,
  Mic,
  MicOff,
  User,
  Eye,
  Activity,
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PresenterCameraBoxProps {
  currentUser: UserProfile;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onShowCameraNotice: () => void;
}

export const PresenterCameraBox: React.FC<PresenterCameraBoxProps> = ({
  currentUser,
  isMuted,
  isCameraOff,
  onToggleMic,
  onToggleCamera,
  onShowCameraNotice,
}) => {
  return (
    <div className="relative rounded-2xl bg-[#1C231E] border border-[#2D3830] overflow-hidden flex flex-col justify-between shadow-lg h-56 md:h-64 select-none">
      {/* Top Banner: Presenter tag & Simulated HUD badge */}
      <div className="p-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-[#253028]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#38483C] text-xs font-semibold text-white">
          <span className="w-2 h-2 rounded-full bg-[#83A58E]" />
          <span>{currentUser.fullName} (Bạn · Người thuyết trình)</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMic}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isMuted
                ? 'bg-[#3D2625] text-[#F09995] border border-[#5E3230]'
                : 'bg-[#2B3B2F] text-[#9EC9A9] border border-[#3F5945]'
            }`}
            title={isMuted ? 'Mô phỏng: Bật Micro' : 'Mô phỏng: Tắt Micro'}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Center: Camera Placeholder with Explicit Disclaimer */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div
          onClick={onShowCameraNotice}
          className="w-14 h-14 rounded-full bg-[#242F27] border border-[#38493C] flex items-center justify-center text-[#83A58E] mb-2 cursor-pointer hover:scale-105 transition-transform"
        >
          {isCameraOff ? (
            <CameraOff className="w-6 h-6 text-[#7E8F82]" />
          ) : (
            <User className="w-6 h-6 text-[#98B5A1]" />
          )}
        </div>

        <p className="text-xs font-semibold text-[#D4E0D7]">
          {isCameraOff
            ? 'Camera đã tắt trong bản mô phỏng'
            : 'Camera chưa được kích hoạt – Chế độ demo'}
        </p>

        <p className="text-[11px] text-[#8C9C8F] mt-0.5 max-w-xs">
          Trong Đợt 1, khung hình giữ vai trò định hình không gian cho tính năng thị giác máy tính ở Đợt 2.
        </p>

        {/* Audio Waveform Simulator when not muted */}
        {!isMuted && (
          <div className="flex items-center gap-1 mt-3 h-4">
            {[4, 12, 18, 8, 14, 20, 10, 6, 16, 9].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className="w-1 bg-[#83A58E] rounded-full animate-pulse"
              />
            ))}
            <span className="text-[10px] text-[#8C9C8F] ml-1.5">Micro mô phỏng thu âm</span>
          </div>
        )}
      </div>

      {/* Bottom: Mock AI Telemetry HUD Preview */}
      <div className="p-2.5 bg-[#181F1A]/90 border-t border-[#2A362D] flex items-center justify-between text-[11px] text-[#A8B6AB]">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#83A58E]" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#83A58E]">
            Chỉ số HUD AI (Mô phỏng)
          </span>
        </div>

        <div className="flex items-center gap-3 tabular-nums">
          <span className="flex items-center gap-1" title="Tốc độ nói mô phỏng">
            <Activity className="w-3 h-3 text-[#83A58E]" />
            <span>125 từ/phút</span>
          </span>

          <span className="flex items-center gap-1" title="Tỷ lệ giao tiếp mắt mô phỏng">
            <Eye className="w-3 h-3 text-[#83A58E]" />
            <span>85% mắt</span>
          </span>

          <span className="hidden sm:inline-block text-[10px] bg-[#242E27] px-1.5 py-0.5 rounded text-[#83A58E]">
            0 từ đệm
          </span>
        </div>
      </div>
    </div>
  );
};
