import React, { useState, KeyboardEvent } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Terminal, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { DEPLOYMENT_SUGGESTIONS } from '../data/genesysData';

interface IncidentInputPromptProps {
  initialText: string;
  initialDeployment: string;
  onGenerate: (text: string, deployment: string) => void;
  isLoading?: boolean;
}

const SAMPLE_PROMPTS = [
  {
    title: 'Audio Unilateral / Caída de llamada',
    badge: 'Voz / WebRTC',
    text: 'Se están cortando las llamadas a los 15 segundos en la cola de Atención Clientes de Claro AR. Los agentes experimentan audio unilateral (el cliente los escucha pero ellos no al cliente). Afecta a unos 45 agentes. Ejemplo de Conversation ID: 8a7c92b1-4f32-482a-9e11-1a2b3c4d5e6f.'
  },
  {
    title: 'Cierre forzado de sesión en Agent Workspace',
    badge: 'Workspace',
    text: 'A los agentes de Claro se les cierra la sesión de golpe con un cartel rojo de "Token Expired / Session Invalid" cada 20 minutos mientras atienden. Ya borraron caché de Chrome y sigue pasando. Afecta a más de 100 agentes en producción.'
  },
  {
    title: 'Timeout 504 en Data Action de CRM',
    badge: 'Integraciones',
    text: 'La Data Action CRM_Customer_Lookup en el IVR Architect está dando timeout de 15 segundos (error 504 Gateway Timeout). Todas las llamadas caen a la cola genérica sin datos del cliente. Correlation ID: c7e6a512-3210-44bb-99cc-112233445566.'
  },
  {
    title: 'Desfase de adherencia en WFM',
    badge: 'WFM',
    text: 'En Workforce Management, la vista de Real-Time Adherence marca a los supervisores que los agentes están fuera de adherencia en rojo, a pesar de que tienen su turno publicado de Inbound Voice y están atendiendo. Afecta a 80 operadores.'
  }
];

export const IncidentInputPrompt: React.FC<IncidentInputPromptProps> = ({
  initialText,
  initialDeployment,
  onGenerate,
  isLoading = false
}) => {
  const [contextText, setContextText] = useState(initialText);
  const [deployment, setDeployment] = useState(initialDeployment || DEPLOYMENT_SUGGESTIONS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!contextText.trim()) {
      setErrorMsg('Por favor escribe un breve contexto del problema para poder generar el ticket.');
      return;
    }
    setErrorMsg('');
    onGenerate(contextText, deployment);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Generador Rápido de Tickets para Genesys
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Describe el incidente en lenguaje natural. La app deducirá automáticamente el <strong>Group</strong>, <strong>Component</strong>, <strong>Priority</strong>, <strong>Subject</strong>, <strong>Telemetría</strong> e <strong>Impacto</strong> listos para copiar en el portal de Genesys.
            </p>
          </div>

          {/* Quick Environment Selector */}
          <div className="shrink-0">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Entorno / Deployment:
            </label>
            <select
              value={deployment}
              onChange={(e) => setDeployment(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              {DEPLOYMENT_SUGGESTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="incidentContext"
              className="block text-xs font-semibold text-gray-700"
            >
              Describe brevemente qué está sucediendo:
            </label>
            <span className="text-[11px] text-gray-400">
              Presiona <kbd className="bg-gray-100 px-1 py-0.5 rounded border border-gray-200">Ctrl</kbd> + <kbd className="bg-gray-100 px-1 py-0.5 rounded border border-gray-200">Enter</kbd> para generar
            </span>
          </div>

          <textarea
            id="incidentContext"
            rows={6}
            value={contextText}
            onChange={(e) => {
              setContextText(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ejemplo: Se están cortando las llamadas en la cola de reclamos de Claro Argentina a los 10 segundos, los agentes reportan audio unilateral (no escuchan al cliente). Ocurre en Google Chrome con unos 40 agentes. ID de conversación de prueba: 8a7c92b1-4f32-482a-9e11-1a2b3c4d5e6f..."
            className={`w-full p-4 text-sm rounded-xl border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
              errorMsg
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
          )}

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                No requiere llenar formularios repetitivos. Te entrega cada campo con botón de 1 clic para copiar.
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{isLoading ? 'Analizando incidente...' : 'Generar Ticket para Genesys'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Example Scenarios */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span>O prueba con un escenario típico en 1 clic:</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setContextText(sample.text);
                if (errorMsg) setErrorMsg('');
              }}
              className="text-left p-3.5 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {sample.title}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                    {sample.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {sample.text}
                </p>
              </div>
              <span className="text-[11px] font-medium text-blue-600 mt-2 inline-flex items-center gap-1">
                <span>Cargar texto</span> →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
