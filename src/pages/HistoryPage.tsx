/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Calendar,
  Clock,
  Presentation,
  Award,
  ChevronRight,
  RotateCcw,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { PracticeSession, PracticeModeType, ActivePage } from '../types';
import { Button } from '../components/ui/Button';
import { DemoNotice } from '../components/ui/DemoNotice';

interface HistoryPageProps {
  sessions: PracticeSession[];
  onNavigate: (page: ActivePage) => void;
  onSelectSessionForReport: (sessionId: string) => void;
  onReplaySession: (session: PracticeSession) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  sessions,
  onNavigate,
  onSelectSessionForReport,
  onReplaySession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | PracticeModeType>('all');

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode =
      selectedFilter === 'all' ? true : s.mode === selectedFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="space-y-6">
      <DemoNotice
        title="Lịch sử các buổi luyện tập"
        message="Danh sách các phiên luyện tập đã thực hiện. Bạn có thể xem lại báo cáo phân tích hoặc khởi chạy lại buổi luyện tập với các thông số tương tự."
      />

      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl border border-[#E4E9E3] p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#3D4740]">
              Tất cả các buổi luyện tập ({sessions.length})
            </h3>
            <p className="text-xs text-[#768078] mt-0.5">
              Theo dõi sự tiến bộ và điểm số qua từng lần tập dượt
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('practice_setup')}
          >
            + Buổi luyện mới
          </Button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#768078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên đề tài hoặc chủ đề..."
              className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm rounded-lg bg-white border border-[#E4E9E3] text-[#3D4740] focus:outline-none focus:ring-2 focus:ring-[#83A58E]"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#F7F9F6] rounded-lg border border-[#E4E9E3] overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-white text-[#324C3B] font-semibold shadow-2xs'
                  : 'text-[#768078] hover:text-[#3D4740]'
              }`}
            >
              Tất cả ({sessions.length})
            </button>
            <button
              onClick={() => setSelectedFilter('defense')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'defense'
                  ? 'bg-white text-[#324C3B] font-semibold shadow-2xs'
                  : 'text-[#768078] hover:text-[#3D4740]'
              }`}
            >
              Hội đồng giám khảo
            </button>
            <button
              onClick={() => setSelectedFilter('basic')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'basic'
                  ? 'bg-white text-[#324C3B] font-semibold shadow-2xs'
                  : 'text-[#768078] hover:text-[#3D4740]'
              }`}
            >
              Thuyết trình cơ bản
            </button>
            <button
              onClick={() => setSelectedFilter('debate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'debate'
                  ? 'bg-white text-[#324C3B] font-semibold shadow-2xs'
                  : 'text-[#768078] hover:text-[#3D4740]'
              }`}
            >
              Phản biện tình huống
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E9E3] p-12 text-center">
            <History className="w-10 h-10 text-[#768078] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[#3D4740]">
              Không tìm thấy buổi luyện tập phù hợp
            </p>
            <p className="text-xs text-[#768078] mt-1">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc chế độ.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-[#E4E9E3] p-5 shadow-xs hover:border-[#83A58E]/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm md:text-base font-bold text-[#3D4740]">
                    {session.title}
                  </h4>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EEF4F0] text-[#324C3B] border border-[#D9E5DC]">
                    {session.modeTitle}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F7F9F6] text-[#768078] border border-[#E4E9E3]">
                    {session.topic}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#768078]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5A7D65]" />
                    <span>{session.createdAt}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#5A7D65]" />
                    <span>
                      {Math.floor(session.durationSeconds / 60)} phút{' '}
                      {session.durationSeconds % 60 > 0
                        ? `${session.durationSeconds % 60}s`
                        : ''}
                    </span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{session.slideCount} slides</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.participantCount} người tham dự</span>
                </div>
              </div>

              {/* Score & Actions */}
              <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E4E9E3] self-end md:self-auto">
                {session.score && (
                  <div className="text-right pr-2">
                    <span className="text-base font-bold text-[#3D5C46] tabular-nums">
                      {session.score.toFixed(1)}/10
                    </span>
                    <p className="text-[10px] text-[#768078]">Điểm đánh giá</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => onReplaySession(session)}
                  title="Luyện lại bài này"
                >
                  Luyện lại
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<FileCheck className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onSelectSessionForReport(session.id);
                    onNavigate('report');
                  }}
                >
                  Xem báo cáo
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
