import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, PhoneCall, LogOut, Network, Calendar, CheckCircle2 } from 'lucide-react';
import { QUICK_TEMPLATES } from '../data/genesysData';
import { QuickTemplate } from '../types/ticket';

interface TemplatesViewProps {
  onSelectTemplate: (template: QuickTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
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
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Genesys Cloud Incident Templates
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Pre-packaged incident templates formatted to meet Genesys Cloud Tier-2/Tier-3 triage criteria for Claro Enterprise operations. Click &quot;Apply Template&quot; to populate the case form.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUICK_TEMPLATES.map((tmpl, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg group-hover:bg-blue-50 transition-colors">
                    {getTemplateIcon(tmpl.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tmpl.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold px-2 py-0.2 rounded border bg-gray-100 text-gray-700 border-gray-200">
                        {tmpl.priority}
                      </span>
                      {tmpl.isSecurityThreat && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                          <ShieldAlert className="w-3 h-3" /> Security
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {tmpl.description}
              </p>

              <div className="p-2.5 rounded bg-gray-50 text-[11px] text-gray-600 space-y-1 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Group:</span>
                  <span className="text-gray-900">{tmpl.group}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Component:</span>
                  <span className="text-gray-900">{tmpl.component}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Deployment:</span>
                  <span className="text-gray-900 truncate max-w-[200px]">{tmpl.deployment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Agents Affected:</span>
                  <span className="font-mono text-gray-900 font-semibold">~{tmpl.agentsAffected}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Includes pre-filled telemetry &amp; steps</span>
              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 transition-all shadow-2xs"
              >
                <span>Apply Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
