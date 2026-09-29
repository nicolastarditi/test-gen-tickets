import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Copy,
  Eye,
  RotateCcw,
  Check,
  AlertTriangle,
  FileText,
  Info,
  ChevronDown
} from 'lucide-react';
import { TicketFormData, ValidationErrors } from '../types/ticket';
import {
  GENESYS_GROUPS_AND_COMPONENTS,
  PRIORITY_OPTIONS,
  IMPLEMENTATION_STAGES,
  CASE_SUB_TYPES,
  DEPLOYMENT_SUGGESTIONS,
  GENESYS_DESCRIPTION_TEMPLATE
} from '../data/genesysData';

interface TicketFormProps {
  formData: TicketFormData;
  setFormData: React.Dispatch<React.SetStateAction<TicketFormData>>;
  onPreview: () => void;
  onGenerateAndCopy: () => void;
  onOpenTemplates: () => void;
  onReset: () => void;
  isCopiedSuccess?: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  formData,
  setFormData,
  onPreview,
  onGenerateAndCopy,
  onOpenTemplates,
  onReset,
  isCopiedSuccess = false
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showDeploymentSuggestions, setShowDeploymentSuggestions] = useState(false);

  // Group keys for the first select
  const groupOptions = Object.keys(GENESYS_GROUPS_AND_COMPONENTS);

  // Components dependent on currently selected group
  const componentOptions = formData.group
    ? GENESYS_GROUPS_AND_COMPONENTS[formData.group] || []
    : [];

  // Generic change handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      const numVal = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
      setFormData((prev) => ({
        ...prev,
        [name]: numVal
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Specific handler for Group change: Resets Component to empty string
  const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newGroup = e.target.value;
    setFormData((prev) => ({
      ...prev,
      group: newGroup,
      component: '' // Reset component as required by business logic
    }));

    if (errors.group || errors.component) {
      setErrors((prev) => ({
        ...prev,
        group: undefined,
        component: undefined
      }));
    }
  };

  // Insert Telemetry Checklist into Description
  const handleInsertTelemetryTemplate = () => {
    if (
      formData.description &&
      !window.confirm(
        'Append the standard Genesys telemetry format to your existing description?'
      )
    ) {
      return;
    }
    const updated = formData.description
      ? `${formData.description}\n\n${GENESYS_DESCRIPTION_TEMPLATE}`
      : GENESYS_DESCRIPTION_TEMPLATE;

    setFormData((prev) => ({ ...prev, description: updated }));
    setErrors((prev) => ({ ...prev, description: undefined }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.deployment.trim()) {
      newErrors.deployment = 'Deployment / Filter is required';
    }
    if (!formData.group) {
      newErrors.group = 'Group is required';
    }
    if (!formData.component) {
      newErrors.component = 'Component is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.implementationStage) {
      newErrors.implementationStage = 'Implementation Stage is required';
    }
    if (!formData.caseSubType) {
      newErrors.caseSubType = 'Case Sub Type is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.businessImpact.trim()) {
      newErrors.businessImpact = 'Business Impact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateClick = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerateAndCopy();
    } else {
      // Scroll to the first error
      const firstErrorEl = document.querySelector('.has-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handlePreviewClick = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPreview();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Open Case
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Specify incident details and system telemetry for Genesys Cloud technical support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Load Incident Template</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Validation Banner if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">
              Please complete all mandatory fields before generating ticket:
            </span>
            <ul className="list-disc pl-4 space-y-0.5 text-red-700">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form with CSS Grid layout */}
      <form onSubmit={handleGenerateClick} className="space-y-6">
        {/* ROW 1: Deployment / Filter | Group | Component (3 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Deployment / Filter */}
          <div className={`relative ${errors.deployment ? 'has-error' : ''}`}>
            <label
              htmlFor="deployment"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Deployment / Filter <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="deployment"
                name="deployment"
                type="text"
                value={formData.deployment}
                onChange={handleChange}
                onFocus={() => setShowDeploymentSuggestions(true)}
                placeholder="e.g. Claro AR - Production"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-hidden focus:ring-1 ${
                  errors.deployment
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowDeploymentSuggestions(!showDeploymentSuggestions)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Toggle suggestions"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Suggestions Dropdown */}
            {showDeploymentSuggestions && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-xs">
                <div className="px-3 py-1 font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                  Suggested Deployments (Claro)
                </div>
                {DEPLOYMENT_SUGGESTIONS.map((dep, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, deployment: dep }));
                      setShowDeploymentSuggestions(false);
                      if (errors.deployment) {
                        setErrors((prev) => ({ ...prev, deployment: undefined }));
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 truncate"
                  >
                    {dep}
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1 px-3 py-1 text-[11px] text-gray-500 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeploymentSuggestions(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {errors.deployment && (
              <p className="mt-1 text-xs text-red-600">{errors.deployment}</p>
            )}
          </div>

          {/* 2. Group */}
          <div className={errors.group ? 'has-error' : ''}>
            <label
              htmlFor="group"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Group <span className="text-red-500">*</span>
            </label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleGroupChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-900 transition-colors focus:outline-hidden focus:ring-1 ${
                errors.group
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Select Group --</option>
              {groupOptions.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
            {errors.group && (
              <p className="mt-1 text-xs text-red-600">{errors.group}</p>
            )}
          </div>

          {/* 3. Component (strictly dependent on Group) */}
          <div className={errors.component ? 'has-error' : ''}>
            <label
              htmlFor="component"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Component <span className="text-red-500">*</span>
            </label>
            <select
              id="component"
              name="component"
              value={formData.component}
              onChange={handleChange}
              disabled={!formData.group}
              className={`w-full px-3 py-2 text-sm rounded-lg border text-gray-900 transition-colors focus:outline-hidden focus:ring-1 ${
                !formData.group
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : errors.component
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">
                {!formData.group
                  ? 'Select Group first'
                  : '-- Select Component --'}
              </option>
              {componentOptions.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
            {errors.component && (
              <p className="mt-1 text-xs text-red-600">{errors.component}</p>
            )}
            {!formData.group && (
              <p className="mt-1 text-[11px] text-gray-400">
                Disabled until Group is selected
              </p>
            )}
          </div>
        </div>

        {/* ROW 2: Priority | Implementation Stage | Case Sub Type (3 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 4. Priority */}
          <div className={errors.priority ? 'has-error' : ''}>
            <label
              htmlFor="priority"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-900 transition-colors focus:outline-hidden focus:ring-1 ${
                errors.priority
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Select Priority --</option>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} ({p.targetResponse})
                </option>
              ))}
            </select>
            {errors.priority && (
              <p className="mt-1 text-xs text-red-600">{errors.priority}</p>
            )}
          </div>

          {/* 5. Implementation Stage */}
          <div className={errors.implementationStage ? 'has-error' : ''}>
            <label
              htmlFor="implementationStage"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Implementation Stage <span className="text-red-500">*</span>
            </label>
            <select
              id="implementationStage"
              name="implementationStage"
              value={formData.implementationStage}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-900 transition-colors focus:outline-hidden focus:ring-1 ${
                errors.implementationStage
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Select Stage --</option>
              {IMPLEMENTATION_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
            {errors.implementationStage && (
              <p className="mt-1 text-xs text-red-600">
                {errors.implementationStage}
              </p>
            )}
          </div>

          {/* 6. Case Sub Type */}
          <div className={errors.caseSubType ? 'has-error' : ''}>
            <label
              htmlFor="caseSubType"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Case Sub Type <span className="text-red-500">*</span>
            </label>
            <select
              id="caseSubType"
              name="caseSubType"
              value={formData.caseSubType}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-900 transition-colors focus:outline-hidden focus:ring-1 ${
                errors.caseSubType
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Select Case Sub Type --</option>
              {CASE_SUB_TYPES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.caseSubType && (
              <p className="mt-1 text-xs text-red-600">{errors.caseSubType}</p>
            )}
          </div>
        </div>

        {/* ROW 3: Security Threat (Checkbox) & Number of Agents Affected */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-lg bg-gray-50/80 border border-gray-200 items-center">
          {/* 7. Security Threat Checkbox */}
          <div className="md:col-span-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="isSecurityThreat"
                name="isSecurityThreat"
                type="checkbox"
                checked={formData.isSecurityThreat}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                  Is there a security threat?
                  {formData.isSecurityThreat && (
                    <span className="text-[11px] font-bold text-red-600 bg-red-100 px-1.5 py-0.2 rounded border border-red-200">
                      FLAGGED
                    </span>
                  )}
                </span>
                <p className="text-xs text-gray-500">
                  Check if this incident involves unauthorized data access, credential leakage, DDoS, or potential CVE vulnerability.
                </p>
              </div>
            </label>
          </div>

          {/* 11. Number of Agents Affected */}
          <div>
            <label
              htmlFor="agentsAffected"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Number of Agents Affected
            </label>
            <input
              id="agentsAffected"
              name="agentsAffected"
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={formData.agentsAffected}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[11px] text-gray-400">
              Optional metric for triage impact
            </span>
          </div>
        </div>

        {/* ROW 4: Subject (full width) */}
        <div className={errors.subject ? 'has-error' : ''}>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="subject"
              className="block text-xs font-semibold text-gray-700"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">
              {formData.subject.length} characters (concise &amp; specific)
            </span>
          </div>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Production: Outbound Dialer campaign failing with error 404 in Agent Workspace"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-hidden focus:ring-1 ${
              errors.subject
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* ROW 5: Description (large textarea full width) */}
        <div className={errors.description ? 'has-error' : ''}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>

            <button
              type="button"
              onClick={handleInsertTelemetryTemplate}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
            >
              <FileText className="w-3 h-3 text-blue-500" />
              <span>Insert Genesys Telemetry Template (Conversation ID, UTC, Steps)</span>
            </button>
          </div>

          <textarea
            id="description"
            name="description"
            rows={8}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the incident with exact steps to reproduce, error messages, Conversation ID(s), and timestamps in UTC..."
            className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-hidden focus:ring-1 ${
              errors.description
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-[11px] text-gray-400">
            Tip: Genesys requires at least 1-2 Conversation IDs and exact UTC timestamp for packet trace lookup.
          </p>
        </div>

        {/* ROW 6: Business Impact (textarea full width) */}
        <div className={errors.businessImpact ? 'has-error' : ''}>
          <label
            htmlFor="businessImpact"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Business Impact <span className="text-red-500">*</span>
          </label>
          <textarea
            id="businessImpact"
            name="businessImpact"
            rows={3}
            value={formData.businessImpact}
            onChange={handleChange}
            placeholder="Explain how this issue impacts operations, callers, agents, financial SLA, or call center queues..."
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-hidden focus:ring-1 ${
              errors.businessImpact
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.businessImpact && (
            <p className="mt-1 text-xs text-red-600">{errors.businessImpact}</p>
          )}
        </div>

        {/* Submit & Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="text-red-500">*</span>
            <span>Fields marked with asterisk are mandatory</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {/* Preview Button */}
            <button
              type="button"
              onClick={handlePreviewClick}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              <span>Preview Case</span>
            </button>

            {/* Primary Generate & Copy Button */}
            <button
              type="submit"
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white rounded-lg transition-all shadow-sm ${
                isCopiedSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isCopiedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ticket Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Generate &amp; Copy Ticket</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
