/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActivePage,
  PracticeSession,
  PresentationDeck,
  VirtualParticipant,
  PracticeModeType
} from './types';
import {
  mockCurrentUser,
  mockVirtualParticipants,
  mockPresentationDecks,
  mockPracticeSessions
} from './data/mockData';
import { sessionService } from './services/sessionService';
import { reportService } from './services/reportService';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { PracticeSetupPage } from './pages/PracticeSetupPage';
import { MeetingRoomPage } from './pages/MeetingRoomPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportPage } from './pages/ReportPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [currentUser] = useState(mockCurrentUser);
  const [sessions, setSessions] = useState<PracticeSession[]>(sessionService.getRecentSessions());

  // Active Session State
  const [currentSession, setCurrentSession] = useState<PracticeSession>(sessions[0]);
  const [currentDeck, setCurrentDeck] = useState<PresentationDeck>(mockPresentationDecks[0]);
  const [participants, setParticipants] = useState<VirtualParticipant[]>(mockVirtualParticipants);
  const [selectedReportId, setSelectedReportId] = useState<string>('rep_01');

  // Handle starting a new simulated practice session
  const handleStartSession = (config: {
    title: string;
    modeId: PracticeModeType;
    deckId: string;
    participantCount: number;
    durationMinutes: number;
  }) => {
    const newSession = sessionService.createSession(config);
    const deck =
      mockPresentationDecks.find((d) => d.id === config.deckId) ||
      mockPresentationDecks[0];

    // Filter or adjust participants based on requested count
    const activeParticipants = mockVirtualParticipants.slice(
      0,
      Math.min(config.participantCount, mockVirtualParticipants.length)
    );

    setCurrentSession(newSession);
    setCurrentDeck(deck);
    setParticipants(activeParticipants);
    setSessions([...sessionService.getRecentSessions()]);
    setActivePage('meeting_room');
  };

  // Replay an existing session
  const handleReplaySession = (session: PracticeSession) => {
    setCurrentSession(session);
    setActivePage('practice_setup');
  };

  // Select a session to view report
  const handleSelectSessionForReport = (sessionId: string) => {
    const session = sessionService.getSessionById(sessionId);
    if (session && session.reportId) {
      setSelectedReportId(session.reportId);
    } else {
      setSelectedReportId('rep_01');
    }
  };

  const currentReport = reportService.getReportById(selectedReportId);

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={(page) => setActivePage(page)}
      currentUser={currentUser}
    >
      {activePage === 'dashboard' && (
        <DashboardPage
          currentUser={currentUser}
          recentSessions={sessions}
          onNavigate={(page) => setActivePage(page)}
          onSelectSessionForReport={handleSelectSessionForReport}
        />
      )}

      {activePage === 'practice_setup' && (
        <PracticeSetupPage
          availableModes={sessionService.getAvailableModes()}
          availableDecks={sessionService.getAvailableDecks()}
          onStartSession={handleStartSession}
          onCancel={() => setActivePage('dashboard')}
        />
      )}

      {activePage === 'meeting_room' && (
        <MeetingRoomPage
          currentUser={currentUser}
          session={currentSession}
          deck={currentDeck}
          participants={participants}
          onNavigate={(page) => setActivePage(page)}
          onFinishSession={() => {
            setSelectedReportId('rep_01');
            setActivePage('report');
          }}
        />
      )}

      {activePage === 'history' && (
        <HistoryPage
          sessions={sessions}
          onNavigate={(page) => setActivePage(page)}
          onSelectSessionForReport={handleSelectSessionForReport}
          onReplaySession={handleReplaySession}
        />
      )}

      {activePage === 'report' && (
        <ReportPage
          report={currentReport}
          onNavigate={(page) => setActivePage(page)}
          onPracticeAgain={() => setActivePage('practice_setup')}
        />
      )}

      {activePage === 'settings' && (
        <SettingsPage currentUser={currentUser} />
      )}
    </AppLayout>
  );
}
