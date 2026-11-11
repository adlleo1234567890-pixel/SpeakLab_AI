import React, { useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  User,
  Activity,
  Sparkles,
  Info,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PresenterCameraBoxProps {
  currentUser: UserProfile;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onShowCameraNotice?: () => void;
  cameraStream?: MediaStream | null;
  audioLevel?: number;
  facingMode?: 'user' | 'environment';
  canSwitchCamera?: boolean;
  onSwitchCamera?: () => void;
  cameraError?: string | null;
  micError?: string | null;
}

export const PresenterCameraBox: React.FC<PresenterCameraBoxProps> = ({
  currentUser,
  isMuted,
  isCameraOff,
  onToggleMic,
  onToggleCamera,
  onShowCameraNotice,
  cameraStream,
  audioLevel = 0,
  facingMode = 'user',
  canSwitchCamera = false,
  onSwitchCamera,
  cameraError,
  micError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bind live camera stream to video element
  useEffect(() => {
    if (videoRef.current) {
      if (!isCameraOff && cameraStream) {
        videoRef.current.srcObject = cameraStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOff, cameraStream]);

  const hasActiveCamera = !isCameraOff && !!cameraStream;

  return (
    <div className="relative rounded-2xl bg-[#1C231E] border border-[#2D3830] overflow-hidden flex flex-col justify-between shadow-lg h-56 md:h-64 select-none">
      {/* 1. Live Video Stream or Background Overlay */}
      {hasActiveCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            facingMode === 'user' ? 'transform scale-x-[-1]' : ''
          }`}
        />
      ) : null}

      {/* Dimmer gradient overlay on top of video for text readability */}
      {hasActiveCamera && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
      )}

      {/* 2. Top Bar: Presenter badge & Micro quick toggle / Camera switch */}
      <div className="p-2.5 sm:p-3 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-1.5 bg-[#1B241E]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#38483C] text-xs font-semibold text-white max-w-[70%] truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${hasActiveCamera ? 'bg-[#83A58E] animate-pulse ring-2 ring-[#83A58E]/40' : 'bg-[#768078]'}`} />
          <span className="truncate">{currentUser.fullName} (Bạn)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Switch front/back camera button on mobile/multi-camera */}
          {hasActiveCamera && canSwitchCamera && onSwitchCamera && (
            <button
              onClick={onSwitchCamera}
              className="p-1.5 rounded-lg text-xs bg-[#1B241E]/80 hover:bg-[#2A362D] text-white border border-[#38483C] transition-colors cursor-pointer"
              title="Chuyển camera trước / sau"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Mic toggle */}
          <button
            onClick={onToggleMic}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isMuted
                ? 'bg-[#3D2625] text-[#F09995] border border-[#5E3230]'
                : 'bg-[#2B3B2F] text-[#9EC9A9] border border-[#3F5945]'
            }`}
            title={isMuted ? 'Bật Micro thật' : 'Tắt Micro thật'}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. Center Area: Placeholder when Camera is OFF, or Active Camera Status */}
      {!hasActiveCamera ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 z-10">
          <div
            onClick={onShowCameraNotice || onToggleCamera}
            className="w-13 h-13 rounded-full bg-[#242F27] border border-[#38493C] flex items-center justify-center text-[#83A58E] mb-2 cursor-pointer hover:scale-105 transition-transform"
            title="Bấm để bật camera"
          >
            <CameraOff className="w-6 h-6 text-[#7E8F82]" />
          </div>

          <p className="text-xs font-semibold text-[#D4E0D7]">
            Camera đang tắt
          </p>

          <p className="text-[11px] text-[#8C9C8F] mt-0.5 max-w-xs leading-relaxed">
            Nhấn nút Camera ở thanh điều khiển bên dưới để quan sát hình ảnh thật của bạn.
          </p>

          {/* Device Error Banner if permission was denied */}
          {cameraError && (
            <div className="mt-2 p-1.5 px-2.5 rounded-lg bg-[#3D2524] border border-[#5E3230] text-[10px] text-[#F09995] flex items-center gap-1.5 max-w-xs text-left">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-2">{cameraError}</span>
            </div>
          )}

          {/* Real Audio Volume Meter when micro is ON */}
          {!isMuted ? (
            <div className="flex flex-col items-center gap-1 mt-2.5">
              <div className="flex items-center gap-1 h-3.5">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((threshold, idx) => {
                  const isActive = audioLevel >= threshold;
                  const height = 4 + idx * 1.2;
                  return (
                    <span
                      key={idx}
                      style={{ height: `${height}px` }}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isActive
                          ? 'bg-[#83A58E] shadow-[0_0_6px_#83A58E]'
                          : 'bg-[#2E3B31]'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] text-[#8C9C8F] tabular-nums">
                {audioLevel > 5 ? `Tín hiệu micro: ${audioLevel}% (Đang thu)` : 'Micro sẵn sàng · Đang im lặng'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-[#768078]">
              <MicOff className="w-3 h-3 text-[#768078]" />
              <span>Micro đang tắt</span>
            </div>
          )}
        </div>
      ) : (
        /* When Camera is ACTIVE: floating bottom audio bar and privacy notice */
        <div className="p-3 z-10 mt-auto space-y-1.5">
          {/* Real-time Audio Level Bar Overlay */}
          {!isMuted && (
            <div className="bg-[#18221B]/85 backdrop-blur-md p-1.5 px-2.5 rounded-lg border border-[#2F4033] flex items-center justify-between text-[10px] text-[#D4E0D7]">
              <div className="flex items-center gap-1.5">
                <Mic className="w-3 h-3 text-[#83A58E]" />
                <span>Micro:</span>
                <div className="flex items-center gap-0.5 h-3">
                  {[15, 30, 45, 60, 75, 90].map((threshold, idx) => {
                    const isActive = audioLevel >= threshold;
                    return (
                      <span
                        key={idx}
                        className={`w-1 h-2 rounded-full transition-all duration-75 ${
                          isActive ? 'bg-[#83A58E]' : 'bg-[#3A4A3E]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <span className="text-[#83A58E] font-mono text-[9px] font-semibold">
                {audioLevel > 5 ? `${audioLevel}%` : 'Tĩnh'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. Bottom Footer: Privacy Notice (Section IX) */}
      <div className="p-2 bg-[#151C17]/95 border-t border-[#263329] flex items-center justify-between text-[10px] text-[#8C9C8F] z-10">
        <span className="truncate">
          {hasActiveCamera ? 'Camera trực tiếp · Chưa ghi hình' : 'Xem trước phòng luyện · Chưa ghi hình'}
        </span>
        <span className="text-[#83A58E] font-medium shrink-0 ml-1">
          Chỉ xem trước
        </span>
      </div>
    </div>
  );
};
