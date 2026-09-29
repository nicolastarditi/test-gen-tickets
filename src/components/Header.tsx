import React from 'react';
import { FileText, History, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'form' | 'history' | 'templates' | 'guidelines';
  setActiveTab: (tab: 'form' | 'history' | 'templates' | 'guidelines') => void;
  historyCount: number;
  draftSavedTime?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  draftSavedTime,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded bg-[#FA5A28] text-white font-bold text-lg shadow-xs">
              {/* Genesys-inspired accent symbol */}
              <span>G</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900 tracking-tight">
                  Genesys Support Portal
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded bg-red-50 text-red-700 border border-red-200">
                  Claro Enterprise
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Technical Case & Incident Creation Desk
              </p>
            </div>
          </div>

          {/* Nav Links / Functional Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'form'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Crear Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'templates'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Plantillas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <History className="w-4 h-4 text-gray-500" />
              <span>Historial</span>
              {historyCount > 0 && (
                <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guidelines')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'guidelines'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="hidden md:inline">Guía &amp; SLAs</span>
            </button>
          </nav>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center text-xs text-gray-500 gap-1.5">
            {draftSavedTime ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Borrador guardado</span>
              </>
            ) : (
              <span>Listo</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
