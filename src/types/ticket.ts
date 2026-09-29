export interface GenesysTicket {
  id: string;
  createdAt: string;
  deployment: string;
  group: string;
  component: string;
  priority: 'P1 - Critical' | 'P2 - Major' | 'P3 - Moderate' | 'P4 - Minor' | '';
  implementationStage: string;
  caseSubType: string;
  isSecurityThreat: boolean;
  subject: string;
  description: string;
  businessImpact: string;
  agentsAffected: number | '';
  status?: 'Draft' | 'Submitted' | 'Archived';
  notes?: string;
}

export type TicketFormData = Omit<GenesysTicket, 'id' | 'createdAt' | 'status'>;

export interface ValidationErrors {
  deployment?: string;
  group?: string;
  component?: string;
  priority?: string;
  implementationStage?: string;
  caseSubType?: string;
  subject?: string;
  description?: string;
  businessImpact?: string;
}

export interface QuickTemplate {
  name: string;
  description: string;
  deployment: string;
  group: string;
  component: string;
  priority: GenesysTicket['priority'];
  implementationStage: string;
  caseSubType: string;
  isSecurityThreat: boolean;
  subject: string;
  descriptionText: string;
  businessImpactText: string;
  agentsAffected: number;
}
