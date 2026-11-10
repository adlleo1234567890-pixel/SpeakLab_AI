/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PracticeSession, PracticeMode, PresentationDeck } from '../types';
import {
  mockPracticeSessions,
  mockPracticeModes,
  mockPresentationDecks,
} from '../data/mockData';

class SessionService {
  private sessions: PracticeSession[] = [...mockPracticeSessions];

  /**
   * Lấy danh sách các chế độ luyện tập có sẵn
   */
  getAvailableModes(): PracticeMode[] {
    return mockPracticeModes;
  }

  /**
   * Lấy danh sách các bài trình chiếu mẫu
   */
  getAvailableDecks(): PresentationDeck[] {
    return mockPresentationDecks;
  }

  /**
   * Lấy danh sách lịch sử các buổi luyện tập
   */
  getRecentSessions(): PracticeSession[] {
    return this.sessions;
  }

  /**
   * Tìm buổi luyện tập theo ID
   */
  getSessionById(id: string): PracticeSession | undefined {
    return this.sessions.find((s) => s.id === id);
  }

  /**
   * Tạo phiên luyện tập mới (mô phỏng)
   */
  createSession(params: {
    title: string;
    modeId: 'basic' | 'defense' | 'debate';
    deckId: string;
    participantCount: number;
    durationMinutes: number;
  }): PracticeSession {
    const mode = mockPracticeModes.find((m) => m.id === params.modeId) || mockPracticeModes[0];
    const deck = mockPresentationDecks.find((d) => d.id === params.deckId) || mockPresentationDecks[0];

    const newSession: PracticeSession = {
      id: `ses_${Date.now()}`,
      title: params.title.trim() || `Buổi luyện: ${mode.title}`,
      mode: params.modeId,
      modeTitle: mode.title,
      topic: deck.category,
      durationSeconds: params.durationMinutes * 60,
      slideCount: deck.slides.length,
      participantCount: params.participantCount,
      createdAt: 'Vừa xong',
      status: 'in_progress',
      score: undefined,
    };

    this.sessions.unshift(newSession);
    return newSession;
  }
}

export const sessionService = new SessionService();
