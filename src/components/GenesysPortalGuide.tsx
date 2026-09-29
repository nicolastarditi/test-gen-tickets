import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowLeft,
  Download,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';
import { TicketFormData } from '../types/ticket';
import { DeducedTicketResult } from '../services/ticketDeducer';
import {
  GENESYS_GROUPS_AND_COMPONENTS,
  PRIORITY_OPTIONS,
  IMPLEMENTATION_STAGES,
  CASE_SUB_TYPES
} from '../data/genesysData';
import { formatTicketAsPlainText, downloadFile } from '../utils/ticketFormatter';

interface GenesysPortalGuideProps {
  result: DeducedTicketResult;
  userContext: string;
  onBackToEdit: () => void;
  onNewTicket: () => void;
}

export const GenesysPortalGuide: React.FC<GenesysPortalGuideProps> = ({
  result,
  userContext,
  onBackToEdit,
  onNewTicket
}) => {
  const [ticketData, setTicketData] = useState<TicketFormData>(result.formData);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingImpact, setIsEditingImpact] = useState(false);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleCopyFullTicket = async () => {
    const fullText = formatTicketAsPlainText(ticketData);
    await copyToClipboard(fullText, 'full_ticket');
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownload = () => {
    const fullText = formatTicketAsPlainText(ticketData);
    const filename = `Genesys_Case_${(ticketData.subject || 'Ticket').slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    downloadFile(fullText, filename);
  };

  // Components dependent on group
  const availableComponents = ticketData.group
    ? GENESYS_GROUPS_AND_COMPONENTS[ticketData.group] || []
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action & Status Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToEdit}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Volver al prompt y ajustar contexto"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Ficha Estructurada para Genesys MySupport
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Listo para copiar
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Copia los campos uno a uno o copia el caso completo para pegarlo en el portal oficial de Genesys.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Descargar .txt</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFullTicket}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all shadow-xs ${
              copiedAll
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Caso Completo Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Caso Completo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reasoning & Detection Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/50 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-blue-900 block mb-1">
            Clasificación Genesys Deducida
          </span>
          <p className="text-xs text-blue-800">
            <strong>{ticketData.group}</strong> → <strong>{ticketData.component}</strong>
          </p>
          <span className="text-[11px] text-blue-600 mt-1">
            {result.reasoning.groupReason}
          </span>
        </div>

        <div className="p-3.5 rounded-lg border border-amber-100 bg-amber-50/50 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-amber-900 block mb-1">
            Prioridad Sugerida
          </span>
          <p className="text-xs text-amber-900 font-semibold">
            {ticketData.priority}
          </p>
          <span className="text-[11px] text-amber-700 mt-1">
            {result.reasoning.priorityReason}
          </span>
        </div>

        <div className={`p-3.5 rounded-lg border flex flex-col justify-between ${
          ticketData.isSecurityThreat
            ? 'border-red-200 bg-red-50 text-red-900'
            : 'border-gray-200 bg-gray-50 text-gray-800'
        }`}>
          <span className="text-[11px] font-semibold block mb-1">
            Evaluación de Seguridad
          </span>
          <p className="text-xs font-semibold">
            {ticketData.isSecurityThreat ? '⚠️ AMENAZA DE SEGURIDAD DETECTADA' : 'Sin amenaza de seguridad'}
          </p>
          <span className="text-[11px] text-gray-500 mt-1">
            {result.reasoning.securityReason}
          </span>
        </div>
      </div>

      {/* Telemetry Tips if applicable */}
      {result.tipsForUser.length > 0 && (
        <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/70 text-amber-900 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Recordatorios para la carga en Genesys:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-800 text-[11px]">
              {result.tipsForUser.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* STEP-BY-STEP GENESYS PORTAL FIELDS */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Campos a Completar en el Portal Oficial de Genesys
            </h3>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Haz clic en <strong>Copiar</strong> en cada fila
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {/* 1. Deployment / Filter */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Deployment / Filter <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Entorno y región AWS de Genesys Cloud
              </p>
            </div>
            <div className="sm:w-1/2">
              <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded text-gray-800 border border-gray-200 inline-block max-w-full truncate">
                {ticketData.deployment}
              </span>
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(ticketData.deployment, 'deployment')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  copiedField === 'deployment'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {copiedField === 'deployment' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Group */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Group <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Categoría principal en el menú de Genesys
              </p>
            </div>
            <div className="sm:w-1/2">
              <div className="flex items-center gap-2">
                <select
                  value={ticketData.group}
                  onChange={(e) => {
                    const newGroup = e.target.value;
                    const comps = GENESYS_GROUPS_AND_COMPONENTS[newGroup] || [];
                    setTicketData((prev) => ({
                      ...prev,
                      group: newGroup,
                      component: comps[0] || ''
                    }));
                  }}
                  className="text-xs font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  {Object.keys(GENESYS_GROUPS_AND_COMPONENTS).map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(ticketData.group, 'group')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  copiedField === 'group'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {copiedField === 'group' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Component */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Component <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Sub-componente específico (dependiente del Group)
              </p>
            </div>
            <div className="sm:w-1/2">
              <select
                value={ticketData.component}
                onChange={(e) =>
                  setTicketData((prev) => ({ ...prev, component: e.target.value }))
                }
                className="text-xs font-semibold text-blue-700 bg-white border border-gray-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              >
                {availableComponents.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(ticketData.component, 'component')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  copiedField === 'component'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {copiedField === 'component' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4. Priority */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Priority <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Nivel de severidad y SLA de respuesta inicial
              </p>
            </div>
            <div className="sm:w-1/2">
              <select
                value={ticketData.priority}
                onChange={(e) =>
                  setTicketData((prev) => ({
                    ...prev,
                    priority: e.target.value as TicketFormData['priority']
                  }))
                }
                className="text-xs font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label} ({p.targetResponse})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(ticketData.priority || '', 'priority')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  copiedField === 'priority'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {copiedField === 'priority' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 5. Implementation Stage & 6. Case Sub Type */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Stage &amp; Sub Type <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Etapa de despliegue y subtipo de caso
              </p>
            </div>
            <div className="sm:w-1/2 flex flex-wrap gap-2 text-xs">
              <span className="font-medium bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Stage: {ticketData.implementationStage}
              </span>
              <span className="font-medium bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Sub Type: {ticketData.caseSubType}
              </span>
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `${ticketData.implementationStage} / ${ticketData.caseSubType}`,
                    'stage_subtype'
                  )
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  copiedField === 'stage_subtype'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {copiedField === 'stage_subtype' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 7. Security Threat & 11. Agents Affected */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900">
                Security &amp; Agents Affected
              </span>
              <p className="text-[11px] text-gray-500">
                Casilla de seguridad y cantidad de agentes
              </p>
            </div>
            <div className="sm:w-1/2 flex flex-wrap items-center gap-3 text-xs">
              <span className={`font-semibold px-2 py-0.5 rounded ${
                ticketData.isSecurityThreat ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-700'
              }`}>
                Security Threat: {ticketData.isSecurityThreat ? 'SÍ (Check marcado)' : 'NO (Sin marcar)'}
              </span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                Agents: {ticketData.agentsAffected !== '' ? ticketData.agentsAffected : 'N/A'}
              </span>
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    String(ticketData.agentsAffected || '0'),
                    'agents'
                  )
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  copiedField === 'agents'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {copiedField === 'agents' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copiar N° Agentes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 8. Subject */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Subject <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Asunto claro y estructurado según estándares Genesys
              </p>
              <button
                type="button"
                onClick={() => setIsEditingSubject(!isEditingSubject)}
                className="mt-1 text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingSubject ? 'Listo' : 'Editar asunto'}</span>
              </button>
            </div>
            <div className="sm:w-1/2">
              {isEditingSubject ? (
                <input
                  type="text"
                  value={ticketData.subject}
                  onChange={(e) =>
                    setTicketData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full text-xs font-medium text-gray-900 bg-white border border-blue-400 rounded px-3 py-1.5 focus:outline-hidden"
                />
              ) : (
                <p className="text-xs font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-200">
                  {ticketData.subject}
                </p>
              )}
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(ticketData.subject, 'subject')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  copiedField === 'subject'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {copiedField === 'subject' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Asunto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 9. Description */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Description <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Cuerpo principal con telemetría técnica, timestamps UTC y pasos de reproducción
              </p>
              <button
                type="button"
                onClick={() => setIsEditingDesc(!isEditingDesc)}
                className="mt-1 text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingDesc ? 'Guardar edición' : 'Editar descripción'}</span>
              </button>
            </div>
            <div className="sm:w-1/2">
              {isEditingDesc ? (
                <textarea
                  rows={10}
                  value={ticketData.description}
                  onChange={(e) =>
                    setTicketData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full text-xs font-mono text-gray-900 bg-white border border-blue-400 rounded p-2.5 focus:outline-hidden"
                />
              ) : (
                <div className="text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {ticketData.description}
                </div>
              )}
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(ticketData.description, 'description')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  copiedField === 'description'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {copiedField === 'description' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Descripción</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 10. Business Impact */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="sm:w-1/3">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                Business Impact <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-gray-500">
                Justificación de impacto en operaciones y criticidad
              </p>
              <button
                type="button"
                onClick={() => setIsEditingImpact(!isEditingImpact)}
                className="mt-1 text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingImpact ? 'Listo' : 'Editar impacto'}</span>
              </button>
            </div>
            <div className="sm:w-1/2">
              {isEditingImpact ? (
                <textarea
                  rows={4}
                  value={ticketData.businessImpact}
                  onChange={(e) =>
                    setTicketData((prev) => ({
                      ...prev,
                      businessImpact: e.target.value
                    }))
                  }
                  className="w-full text-xs text-gray-900 bg-white border border-blue-400 rounded p-2.5 focus:outline-hidden"
                />
              ) : (
                <p className="text-xs text-gray-800 bg-gray-50 p-2.5 rounded border border-gray-200">
                  {ticketData.businessImpact}
                </p>
              )}
            </div>
            <div className="sm:w-auto shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(ticketData.businessImpact, 'businessImpact')
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  copiedField === 'businessImpact'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {copiedField === 'businessImpact' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Impacto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            ¿Necesitas crear otro ticket o ajustar el problema?
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBackToEdit}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Ajustar Contexto Original
            </button>
            <button
              type="button"
              onClick={onNewTicket}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
            >
              + Nuevo Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
