import React from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, Clock, Terminal, ShieldAlert } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../data/genesysData';

export const BestPracticesGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Genesys Cloud Support Guidelines & SLAs
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Genesys Cloud engineers require verifiable telemetry IDs, exact UTC timestamps, and diagnostic logs to begin triage. Follow these best practices to prevent delays and avoid unnecessary back-and-forth interactions.
        </p>
      </div>

      {/* Priority Matrix */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          Priority Definitions & Target Initial Response Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PRIORITY_OPTIONS.map((p) => (
            <div
              key={p.value}
              className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${p.badgeClass}`}>
                    {p.label}
                  </span>
                  <span className="text-xs font-mono font-medium text-gray-600">
                    SLA: {p.targetResponse}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Telemetry Checklist */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Mandatory Telemetry Data Points
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="space-y-2 border-l-2 border-blue-400 pl-3">
            <span className="font-semibold text-gray-900 block">Conversation ID</span>
            <p>
              Found in Genesys Cloud under <strong>Performance &gt; Interactions</strong>. Look for the UUID format: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>. Provide at least 2 distinct call examples.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-blue-400 pl-3">
            <span className="font-semibold text-gray-900 block">Exact Timestamp in UTC</span>
            <p>
              Always state the exact event occurrence in UTC time. Logs in AWS PureCloud data lakes are indexed in UTC. Specifying local time without timezone causes 24h investigation delay.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-blue-400 pl-3">
            <span className="font-semibold text-gray-900 block">Organization ID & Region</span>
            <p>
              Found in Genesys Cloud under <strong>Admin &gt; Organization Settings</strong>. Include both the Org GUID and the region domain (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">mypurecloud.com</code> or <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">sa-east-1</code>).
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-blue-400 pl-3">
            <span className="font-semibold text-gray-900 block">WebRTC Diagnostics & Logs</span>
            <p>
              For audio or softphone issues, have the agent click on their profile name &gt; <strong>Diagnostics</strong> or export browser console HAR logs (<kbd className="bg-gray-100 px-1 py-0.5 rounded border border-gray-300 text-gray-700">F12 &gt; Network &gt; Save all as HAR with content</kbd>).
            </p>
          </div>
        </div>
      </div>

      {/* Security Incident Note */}
      <div className="bg-red-50/70 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-red-900">
          <strong className="font-semibold">Security Threat Incidents:</strong>
          <p className="mt-0.5">
            If checking &quot;Is there a security threat?&quot;, do NOT include raw passwords, unmasked credit card numbers (PCI), or sensitive credentials in the ticket description. Mark the ticket and request a secure file exchange link from Genesys InfoSec if payload inspection is required.
          </p>
        </div>
      </div>
    </div>
  );
};
