import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code, FileCode } from 'lucide-react';
import { TicketFormData } from '../types/ticket';
import {
  formatTicketAsPlainText,
  formatTicketAsMarkdown,
  formatTicketAsJSON,
  downloadFile
} from '../utils/ticketFormatter';

interface TicketPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: TicketFormData;
  onMarkSubmitted?: () => void;
}

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  isOpen,
  onClose,
  ticketData,
  onMarkSubmitted
}) => {
  const [activeFormat, setActiveFormat] = useState<'text' | 'markdown' | 'json'>('text');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const textOutput = formatTicketAsPlainText(ticketData);
  const markdownOutput = formatTicketAsMarkdown(ticketData);
  const jsonOutput = formatTicketAsJSON(ticketData);

  const getCurrentContent = () => {
    switch (activeFormat) {
      case 'markdown':
        return markdownOutput;
      case 'json':
        return jsonOutput;
      case 'text':
      default:
        return textOutput;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentContent());
      setCopied(true);
      if (onMarkSubmitted) {
        onMarkSubmitted();
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = getCurrentContent();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const filename = `Genesys_Case_${(ticketData.subject || 'Ticket').slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    if (activeFormat === 'json') {
      downloadFile(jsonOutput, `${filename}.json`, 'application/json');
    } else if (activeFormat === 'markdown') {
      downloadFile(markdownOutput, `${filename}.md`, 'text/markdown');
    } else {
      downloadFile(textOutput, `${filename}.txt`, 'text/plain');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-3xl w-full flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Generated Case Summary
            </h3>
            <p className="text-xs text-gray-500">
              Ready to copy and paste directly into Genesys MySupport Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveFormat('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeFormat === 'text'
                  ? 'bg-white text-gray-900 shadow-xs border border-gray-200 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Plain Text (MySupport)
            </button>
            <button
              onClick={() => setActiveFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeFormat === 'markdown'
                  ? 'bg-white text-gray-900 shadow-xs border border-gray-200 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Markdown
            </button>
            <button
              onClick={() => setActiveFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeFormat === 'json'
                  ? 'bg-white text-gray-900 shadow-xs border border-gray-200 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              JSON Payload
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Download</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md text-white transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Preview Box */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-900 text-gray-100 font-mono text-xs rounded-b-lg">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed select-all">
            {getCurrentContent()}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {ticketData.priority && (
              <span className="font-semibold text-gray-700">{ticketData.priority}</span>
            )}{' '}
            • {ticketData.group || 'No group'} → {ticketData.component || 'No component'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
