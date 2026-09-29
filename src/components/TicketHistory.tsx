import React, { useState } from 'react';
import { History, Search, Trash2, Copy, Eye, FileDown, Check, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { GenesysTicket } from '../types/ticket';
import { formatTicketAsPlainText, downloadFile } from '../utils/ticketFormatter';

interface TicketHistoryProps {
  tickets: GenesysTicket[];
  onSelectTicket: (ticket: GenesysTicket) => void;
  onDeleteTicket: (id: string) => void;
  onClearHistory: () => void;
}

export const TicketHistory: React.FC<TicketHistoryProps> = ({
  tickets,
  onSelectTicket,
  onDeleteTicket,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.subject.toLowerCase().includes(term) ||
      t.group.toLowerCase().includes(term) ||
      t.component.toLowerCase().includes(term) ||
      t.deployment.toLowerCase().includes(term) ||
      (t.priority && t.priority.toLowerCase().includes(term))
    );
  });

  const handleCopyTicket = (ticket: GenesysTicket) => {
    const text = formatTicketAsPlainText(ticket);
    navigator.clipboard.writeText(text);
    setCopiedId(ticket.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTicket = (ticket: GenesysTicket) => {
    const text = formatTicketAsPlainText(ticket);
    const filename = `Genesys_Case_${ticket.subject.slice(0, 25).replace(/[^a-zA-Z0-9_-]/g, '_')}_${ticket.id.slice(0, 6)}.txt`;
    downloadFile(text, filename);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
      {/* History Header & Search */}
      <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Saved Case History ({tickets.length})
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Log of previously prepared or submitted tickets for Claro &amp; Genesys
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by subject, group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-gray-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {tickets.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all ticket history?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded border border-red-200 hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center">
          <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No cases recorded yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No tickets matched your search query. Try another keyword.'
              : 'Cases you create, preview, or save will appear here for easy re-use and reference.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {ticket.priority && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        ticket.priority.includes('P1')
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : ticket.priority.includes('P2')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : ticket.priority.includes('P3')
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">
                    {ticket.deployment || 'No deployment'}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {ticket.group} / {ticket.component}
                  </span>
                  {ticket.isSecurityThreat && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                      <ShieldAlert className="w-3 h-3" /> Security
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {ticket.subject || '(No Subject)'}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-1">
                  {ticket.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                  {ticket.agentsAffected !== '' && (
                    <span>• {ticket.agentsAffected} agents affected</span>
                  )}
                  {ticket.caseSubType && <span>• {ticket.caseSubType}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleCopyTicket(ticket)}
                  className={`p-2 rounded-md border text-xs font-medium transition-colors ${
                    copiedId === ticket.id
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Copy formatted case"
                >
                  {copiedId === ticket.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadTicket(ticket)}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Download .txt"
                >
                  <FileDown className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTicket(ticket)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-medium transition-colors"
                  title="Load into form"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Load</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteTicket(ticket.id)}
                  className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
