/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Share2,
  MonitorPlay,
  Layers,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

interface ScreenShareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStartShare: () => void;
  isSupported?: boolean;
}

export const ScreenShareGuideModal: React.FC<ScreenShareGuideModalProps> = ({
  isOpen,
  onClose,
  onConfirmStartShare,
  isSupported = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chia sẻ màn hình PowerPoint có hiệu ứng"
      subtitle="Đợt 2.3 · Trình chiếu trực tiếp với Animation và Transition đầy đủ"
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Để sau / Giữ slide nội bộ
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onConfirmStartShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Bắt đầu chia sẻ ngay</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#3D4740]">
        {/* Value Proposition Hero Banner */}
        <div className="p-3.5 rounded-xl bg-[#EEF4F0] border border-[#D9E5DC] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#324C3B] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#83A58E]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2A4433] leading-snug">
              Trình diễn bài nói với 100% hiệu ứng PowerPoint gốc
            </h4>
            <p className="text-[#4A6453] text-xs mt-0.5 leading-relaxed">
              Các hiệu ứng chữ xuất hiện (Fly In, Fade, Zoom) và chuyển slide (Morph, Push, Wipe) của PowerPoint sẽ được truyền phát trực tiếp ở độ nét cao vào phòng họp SpeakLab AI.
            </p>
          </div>
        </div>

        {/* 5-Step Guide */}
        <div>
          <h5 className="font-bold text-[#3D4740] mb-2.5 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <MonitorPlay className="w-3.5 h-3.5 text-[#83A58E]" />
            5 Bước thực hiện nhanh:
          </h5>

          <div className="space-y-2">
            {[
              {
                step: 1,
                title: 'Mở tệp PowerPoint trên máy tính của bạn',
                desc: 'Khởi chạy Microsoft PowerPoint (hoặc Google Slides / WPS Office) với tệp thuyết trình của bạn.',
              },
              {
                step: 2,
                title: 'Bật chế độ Trình chiếu (Slide Show)',
                desc: 'Nhấn phím F5 hoặc nút Slide Show trong PowerPoint để bắt đầu chiếu toàn màn hình hoặc cửa sổ.',
              },
              {
                step: 3,
                title: 'Nhấn nút "Bắt đầu chia sẻ ngay" bên dưới',
                desc: 'Hộp thoại chọn màn hình bảo mật của trình duyệt sẽ xuất hiện.',
              },
              {
                step: 4,
                title: 'Chọn thẻ "Cửa sổ" (Window) và chọn PowerPoint',
                desc: 'Ưu tiên chọn đúng cửa sổ trình chiếu PowerPoint thay vì toàn màn hình để thao tác mượt mà nhất.',
              },
              {
                step: 5,
                title: 'Thuyết trình và điều khiển phím trên PowerPoint',
                desc: 'Bấm phím cách (Space), Enter hoặc click chuột trên PowerPoint để chuyển slide. Hình ảnh và hiệu ứng sẽ tự động truyền vào SpeakLab AI.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAFBF9] border border-[#E4E9E3]"
              >
                <div className="w-5 h-5 rounded-full bg-[#83A58E] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-[#3D4740] text-xs">{item.title}</p>
                  <p className="text-[11px] text-[#768078] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Tips and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          {/* Tip 1: Single Monitor setup */}
          <div className="p-3 rounded-lg bg-[#F7F9F6] border border-[#E4E9E3] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#2A4433] text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-[#83A58E] shrink-0" />
              <span>Mẹo trình chiếu trên 1 màn hình</span>
            </div>
            <p className="text-[11px] text-[#5A665E] leading-relaxed">
              Trong PowerPoint, vào <strong>Slide Show</strong> &rarr; <strong>Set Up Slide Show</strong> &rarr; chọn <strong>"Browsed by an individual (window)"</strong>. PowerPoint sẽ chiếu trong cửa sổ riêng giúp bạn vừa nhìn thấy hội đồng vừa điều khiển slide!
            </p>
          </div>

          {/* Tip 2: Infinite Mirror prevention */}
          <div className="p-3 rounded-lg bg-[#F7F9F6] border border-[#E4E9E3] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#873631] text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#873631] shrink-0" />
              <span>Tránh hiện tượng lặp gương vô hạn</span>
            </div>
            <p className="text-[11px] text-[#5A665E] leading-relaxed">
              Tránh chọn "Toàn bộ màn hình" (Entire Screen) khi đang mở chính tab phòng họp này. Hãy chọn tab <strong>"Cửa sổ" (Window)</strong> &rarr; <strong>PowerPoint Slide Show</strong> để hình ảnh luôn hiển thị sắc nét, không bị lặp gương.
            </p>
          </div>
        </div>

        {/* Audio notice & Return mechanism */}
        <div className="p-2.5 rounded-lg bg-[#FAFBF9] border border-[#E4E9E3] text-[11px] text-[#768078] flex items-center justify-between">
          <span>
            🔄 Bất cứ lúc nào bạn cũng có thể bấm <strong>"Dừng chia sẻ"</strong> để quay lại slide nội bộ ban đầu.
          </span>
          <span className="text-[#4A6453] font-semibold text-[10px] shrink-0 ml-2">
            Không nén giảm chất lượng
          </span>
        </div>
      </div>
    </Modal>
  );
};
