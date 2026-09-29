import { GenesysTicket, TicketFormData } from '../types/ticket';

export function formatTicketAsPlainText(ticket: TicketFormData | GenesysTicket): string {
  const isThreatText = ticket.isSecurityThreat ? 'YES (CRITICAL / SECURITY REVIEW REQUIRED)' : 'No';
  const agentsText = ticket.agentsAffected !== '' ? String(ticket.agentsAffected) : 'Not specified / N/A';

  return `=======================================================
GENESYS SUPPORT CASE SUBMISSION
=======================================================
[CASE CLASSIFICATION]
Deployment / Filter:       ${ticket.deployment || 'N/A'}
Group:                     ${ticket.group || 'N/A'}
Component:                 ${ticket.component || 'N/A'}
Priority:                  ${ticket.priority || 'N/A'}
Implementation Stage:      ${ticket.implementationStage || 'N/A'}
Case Sub Type:             ${ticket.caseSubType || 'N/A'}
Security Threat:           ${isThreatText}
Agents Affected:           ${agentsText}

-------------------------------------------------------
[CASE DETAILS]
-------------------------------------------------------
Subject:
${ticket.subject || 'N/A'}

Description:
${ticket.description || 'N/A'}

Business Impact:
${ticket.businessImpact || 'N/A'}
=======================================================`;
}

export function formatTicketAsMarkdown(ticket: TicketFormData | GenesysTicket): string {
  return `# Genesys Support Case: ${ticket.subject || 'Untitled'}

### Case Classification
- **Deployment / Filter:** \`${ticket.deployment || 'N/A'}\`
- **Group:** ${ticket.group || 'N/A'}
- **Component:** ${ticket.component || 'N/A'}
- **Priority:** ${ticket.priority || 'N/A'}
- **Implementation Stage:** ${ticket.implementationStage || 'N/A'}
- **Case Sub Type:** ${ticket.caseSubType || 'N/A'}
- **Security Threat:** ${ticket.isSecurityThreat ? '⚠️ **YES**' : 'No'}
- **Agents Affected:** ${ticket.agentsAffected !== '' ? ticket.agentsAffected : 'N/A'}

---

### Subject
${ticket.subject || 'N/A'}

---

### Detailed Description & Reproduction
\`\`\`text
${ticket.description || 'N/A'}
\`\`\`

---

### Business Impact
${ticket.businessImpact || 'N/A'}
`;
}

export function formatTicketAsJSON(ticket: TicketFormData | GenesysTicket): string {
  return JSON.stringify(ticket, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
