'use client';

import React, { useEffect, useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { useLanguage } from '@/context/LanguageContext';
import { JournalEditor } from './JournalEditor';
import { JournalTimeline } from './JournalTimeline';
import { ConsultationHistoryDashboard } from './ConsultationHistoryDashboard';
import { JournalEntryCreate } from '@/types/journal';

export const DashboardView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'journal' | 'history'>('journal');
  const [filterModule, setFilterModule] = useState<string>('ALL');

  const {
    isLoading,
    journalEntries,
    historyTimeline,
    errorMessage,
    fetchEntries,
    fetchHistory,
    createEntry,
    deleteEntry,
  } = useJournal();

  useEffect(() => {
    if (activeTab === 'journal') {
      fetchEntries(filterModule === 'ALL' ? undefined : filterModule);
    } else {
      fetchHistory();
    }
  }, [activeTab, filterModule, fetchEntries, fetchHistory]);

  const handleSaveEntry = async (data: JournalEntryCreate) => {
    await createEntry(data);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Navigation Tabs */}
      <div className="flex rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('journal')}
          className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('dashTabReflection')} ({journalEntries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('dashTabHistory')} ({historyTimeline.length})
        </button>
      </div>

      {/* Error Message (Only if explicit error) */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'journal' ? (
        <div className="space-y-6">
          {/* Write New Journal Editor */}
          <JournalEditor onSave={handleSaveEntry} isLoading={isLoading} />

          {/* Module Filter Options */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('dashTimelineHeader')}
            </h3>

            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">{t('adminFilterModule')}</option>
              <option value="general">{t('dashSourceGeneral')}</option>
              <option value="tarot">Tarot</option>
              <option value="iching">Kinh Dịch / I Ching</option>
              <option value="astrology">Tử Vi / Astrology</option>
              <option value="minh_kien">Minh Kiến AI</option>
            </select>
          </div>

          {/* Journal Entries List */}
          <JournalTimeline
            entries={journalEntries}
            onDelete={deleteEntry}
            isLoading={isLoading}
          />
        </div>
      ) : (
        /* Consultation History Dashboard */
        <ConsultationHistoryDashboard
          history={historyTimeline}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
