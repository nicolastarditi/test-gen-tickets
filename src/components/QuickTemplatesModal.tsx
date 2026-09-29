import React from 'react';
import { X, Sparkles, ArrowRight, ShieldAlert, PhoneCall, LogOut, Network, Calendar } from 'lucide-react';
import { QUICK_TEMPLATES } from '../data/genesysData';
import { QuickTemplate } from '../types/ticket';

interface QuickTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: QuickTemplate) => void;
}

export const QuickTemplatesModal: React.FC<QuickTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  const getTemplateIcon = (name: string) => {
    if (name.includes('Voice') || name.includes('Audio')) {
      return <PhoneCall className="w-5 h-5 text-blue-600" />;
    }
    if (name.includes('Logout') || name.includes('Session')) {
      return <LogOut className="w-5 h-5 text-amber-600" />;
    }
    if (name.includes('Data Action') || name.includes('Timeout')) {
      return <Network className="w-5 h-5 text-purple-600" />;
    }
    return <Calendar className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-3xl w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Pre-Configured Enterprise Case Templates
              </h3>
              <p className="text-xs text-gray-500">
                Quickly populate the case form with Genesys-compliant incident structures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates List */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-gray-100">
          {QUICK_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="pt-3 first:pt-0 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg group-hover:bg-white shrink-0">
                  {getTemplateIcon(tmpl.name)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tmpl.name}
                    </h4>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                      {tmpl.priority}
                    </span>
                    {tmpl.isSecurityThreat && (
                      <span className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                        <ShieldAlert className="w-3 h-3" /> Security
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600">
                    {tmpl.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">
                    <span className="font-medium text-gray-700">Group:</span> {tmpl.group}
                    <span>•</span>
                    <span className="font-medium text-gray-700">Component:</span> {tmpl.component}
                    <span>•</span>
                    <span className="font-medium text-gray-700">Agents:</span> ~{tmpl.agentsAffected}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xs"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Applying a template fills in standard telemetry templates and components.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
