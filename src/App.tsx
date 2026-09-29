import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IncidentInputPrompt } from './components/IncidentInputPrompt';
import { GenesysPortalGuide } from './components/GenesysPortalGuide';
import { TicketForm } from './components/TicketForm';
import { TemplatesView } from './components/TemplatesView';
import { TicketHistory } from './components/TicketHistory';
import { BestPracticesGuide } from './components/BestPracticesGuide';
import { TicketPreviewModal } from './components/TicketPreviewModal';
import { TicketFormData, GenesysTicket, QuickTemplate } from './types/ticket';
import { deduceGenesysTicket, DeducedTicketResult } from './services/ticketDeducer';
import { Check, SlidersHorizontal, Sparkles } from 'lucide-react';

const DRAFT_TEXT_KEY = 'genesys_incident_context_text';
const DRAFT_DEP_KEY = 'genesys_incident_deployment';
const HISTORY_STORAGE_KEY = 'genesys_portal_case_history';

export default function App() {
  const [userContext, setUserContext] = useState<string>(() => {
    return localStorage.getItem(DRAFT_TEXT_KEY) || '';
  });

  const [deployment, setDeployment] = useState<string>(() => {
    return (
      localStorage.getItem(DRAFT_DEP_KEY) ||
      'Claro AR - Production (mypurecloud.com / us-east-1)'
    );
  });

  const [deducedResult, setDeducedResult] = useState<DeducedTicketResult | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'templates' | 'guidelines'>('form');
  const [viewMode, setViewMode] = useState<'prompt' | 'guide' | 'manualForm'>('prompt');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  const [history, setHistory] = useState<GenesysTicket[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Autosave context text
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_TEXT_KEY, userContext);
      localStorage.setItem(DRAFT_DEP_KEY, deployment);
      setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // ignore
    }
  }, [userContext, deployment]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleGenerateTicket = (text: string, dep: string) => {
    setUserContext(text);
    setDeployment(dep);
    const result = deduceGenesysTicket(text, dep);
    setDeducedResult(result);
    setViewMode('guide');
    setActiveTab('form');

    // Save automatically to history
    const newRecord: GenesysTicket = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      ...result.formData,
      status: 'Submitted'
    };
    setHistory((prev) => [newRecord, ...prev]);

    showToast('¡Ticket estructurado generado con éxito!');
  };

  const handleSelectTemplate = (template: QuickTemplate) => {
    const text = `${template.subject}\n\n${template.descriptionText}\n\nImpacto en el negocio: ${template.businessImpactText}`;
    setUserContext(text);
    setDeployment(template.deployment);

    const result: DeducedTicketResult = {
      formData: {
        deployment: template.deployment,
        group: template.group,
        component: template.component,
        priority: template.priority,
        implementationStage: template.implementationStage,
        caseSubType: template.caseSubType,
        isSecurityThreat: template.isSecurityThreat,
        subject: template.subject,
        description: template.descriptionText,
        businessImpact: template.businessImpactText,
        agentsAffected: template.agentsAffected
      },
      reasoning: {
        groupReason: `Plantilla preconfigurada para ${template.group}.`,
        componentReason: `Componente ${template.component} asignado por plantilla.`,
        priorityReason: `Prioridad asignada por criticidad del incidente (${template.priority}).`,
        stageReason: template.implementationStage,
        securityReason: template.isSecurityThreat
          ? 'Amenaza de seguridad marcada en plantilla'
          : 'Sin amenaza de seguridad'
      },
      detectedConversationIds: [],
      tipsForUser: ['Plantilla oficial cargada. Recuerda completar tus IDs de conversación reales.']
    };

    setDeducedResult(result);
    setViewMode('guide');
    setActiveTab('form');
    showToast(`Plantilla "${template.name}" cargada en la ficha de Genesys.`);
  };

  const handleSelectTicketFromHistory = (ticket: GenesysTicket) => {
    const result: DeducedTicketResult = {
      formData: {
        deployment: ticket.deployment,
        group: ticket.group,
        component: ticket.component,
        priority: ticket.priority,
        implementationStage: ticket.implementationStage,
        caseSubType: ticket.caseSubType,
        isSecurityThreat: ticket.isSecurityThreat,
        subject: ticket.subject,
        description: ticket.description,
        businessImpact: ticket.businessImpact,
        agentsAffected: ticket.agentsAffected
      },
      reasoning: {
        groupReason: 'Caso recuperado del historial.',
        componentReason: `Componente ${ticket.component}.`,
        priorityReason: `Prioridad ${ticket.priority}.`,
        stageReason: ticket.implementationStage,
        securityReason: ticket.isSecurityThreat
          ? 'Amenaza de seguridad marcada'
          : 'Sin amenaza'
      },
      detectedConversationIds: [],
      tipsForUser: []
    };

    setDeducedResult(result);
    setUserContext(ticket.description);
    setDeployment(ticket.deployment);
    setViewMode('guide');
    setActiveTab('form');
    showToast('Caso cargado desde el historial.');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Caso eliminado del historial.');
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Historial vaciado.');
  };

  const handleNewTicket = () => {
    setUserContext('');
    setDeducedResult(null);
    setViewMode('prompt');
    showToast('Listo para ingresar un nuevo caso.');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'form' && !deducedResult) {
            setViewMode('prompt');
          }
        }}
        historyCount={history.length}
        draftSavedTime={draftSavedTime}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-600 hover:text-emerald-900 text-xs font-semibold ml-3"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Tab 1: Form / Assistant View */}
        {activeTab === 'form' && (
          <div>
            {/* View Mode 1: Natural Language Context Prompt */}
            {viewMode === 'prompt' && (
              <IncidentInputPrompt
                initialText={userContext}
                initialDeployment={deployment}
                onGenerate={handleGenerateTicket}
              />
            )}

            {/* View Mode 2: Deduced Structured Genesys Cheat-Sheet */}
            {viewMode === 'guide' && deducedResult && (
              <GenesysPortalGuide
                result={deducedResult}
                userContext={userContext}
                onBackToEdit={() => setViewMode('prompt')}
                onNewTicket={handleNewTicket}
              />
            )}

            {/* Optional Manual Fallback View */}
            {viewMode === 'manualForm' && deducedResult && (
              <TicketForm
                formData={deducedResult.formData}
                setFormData={(val) => {
                  if (typeof val === 'function') {
                    setDeducedResult((prev) =>
                      prev ? { ...prev, formData: val(prev.formData) } : null
                    );
                  } else {
                    setDeducedResult((prev) =>
                      prev ? { ...prev, formData: val } : null
                    );
                  }
                }}
                onPreview={() => setIsPreviewOpen(true)}
                onGenerateAndCopy={() => {
                  showToast('Ticket copiado');
                }}
                onOpenTemplates={() => setActiveTab('templates')}
                onReset={handleNewTicket}
              />
            )}

            {/* Subtle Mode Switcher at bottom if on guide */}
            {viewMode === 'guide' && (
              <div className="mt-6 flex items-center justify-center text-xs text-gray-400 gap-2">
                <span>¿Prefieres ver el formulario completo con los 11 campos clásicos?</span>
                <button
                  type="button"
                  onClick={() => setViewMode('manualForm')}
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Ver Formulario Grid</span>
                </button>
              </div>
            )}

            {viewMode === 'manualForm' && (
              <div className="mt-6 flex items-center justify-center text-xs text-gray-400 gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('guide')}
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Volver a la Ficha para Genesys</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Templates */}
        {activeTab === 'templates' && (
          <TemplatesView onSelectTemplate={handleSelectTemplate} />
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <TicketHistory
            tickets={history}
            onSelectTicket={handleSelectTicketFromHistory}
            onDeleteTicket={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Tab 4: Guidelines */}
        {activeTab === 'guidelines' && <BestPracticesGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-12 text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-medium text-gray-700">
              Genesys Support Ticket Portal • Claro Enterprise
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Generación de casos asistida por lenguaje natural con mapeo estricto a las categorías y telemetría de Genesys Cloud.
            </p>
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-[11px]">
            <button
              onClick={() => setActiveTab('form')}
              className="hover:text-blue-600"
            >
              Nuevo Caso
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('templates')}
              className="hover:text-blue-600"
            >
              Plantillas
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('guidelines')}
              className="hover:text-blue-600"
            >
              Guía &amp; SLAs
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {deducedResult && (
        <TicketPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          ticketData={deducedResult.formData}
        />
      )}
    </div>
  );
}
