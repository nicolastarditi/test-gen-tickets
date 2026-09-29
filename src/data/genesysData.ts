import { QuickTemplate } from '../types/ticket';

// Exact JSON data provided in specification
export const GENESYS_GROUPS_AND_COMPONENTS: Record<string, string[]> = {
  "Account Management": [
    "Compliance",
    "Data Privacy and Security",
    "Identity and Access Management",
    "Multi Region Multi Org",
    "Org Management",
    "Platform Support Tools",
    "User and Group Management"
  ],
  "Customer Engagement": [
    "Callbacks",
    "Case Management - Workitems",
    "Co-Browse",
    "Content Management",
    "Cross Channel",
    "E-mail",
    "External Contact Management",
    "Knowledge Portal - Support Center",
    "Outbound Campaigns and Dialer",
    "Predictive Engagement",
    "Routing - Architect or Orchestration Builder",
    "SMS",
    "Social Listening",
    "Surveys",
    "Third-Party Digital Channels",
    "Video",
    "Voice",
    "Web, Mobile Messaging and Messenger Apps",
    "Work Automation"
  ],
  "Data, Analytics, and Reporting": [
    "Analytics and Reporting",
    "Custom Data Management",
    "Data Integrations and Connectors",
    "Estimated Wait Time",
    "Journey Management",
    "Speech and Text Analytics"
  ],
  "Employee Productivity": [
    "Agent Copilot",
    "Agent Scripting",
    "Agent Workspace",
    "Genesys Cloud Copilot",
    "Mobile App - Tempo",
    "Mobile App - UCC",
    "Navigation UI",
    "Third-Party Desktop Embeddable Framework",
    "Unified Communication and Collaboration",
    "Usability"
  ],
  "Integrations": [
    "A35",
    "Email Wizard",
    "Health CX",
    "Microsoft Dynamics Connector",
    "Other Apps and Custom Apps"
  ],
  "Open Platform": [
    "APIs and SDKs",
    "BYOI",
    "Connectors",
    "CRM Integrations",
    "Custom Functions and Data Actions",
    "CX as Code",
    "Developer Center",
    "Genesys Cloud Voice",
    "Language Support",
    "Pexipish",
    "Third-Party Carrier Management",
    "Third-Party Device Management"
  ],
  "Self Service and Automation": [
    "AI Studio",
    "Architect - Orchestration Builder",
    "Business Rule Management",
    "Knowledge Fabric",
    "Process Automation",
    "Virtual Agent Bots and IVR"
  ],
  "Workforce Engagement": [
    "Capacity Planning",
    "Employee Development",
    "Forecasting",
    "Gamification and Performance",
    "Interaction and Screen Recording",
    "Monitoring - Adherence - Shrinkage Mgmt",
    "Quality Management",
    "Real-time Supervisor Engagement",
    "Scheduling",
    "Supervisor CoPilot",
    "Time-off Management",
    "Virtual Supervisor"
  ]
};

export const PRIORITY_OPTIONS: Array<{
  value: 'P1 - Critical' | 'P2 - Major' | 'P3 - Moderate' | 'P4 - Minor';
  label: string;
  badgeClass: string;
  description: string;
  targetResponse: string;
}> = [
  {
    value: 'P1 - Critical',
    label: 'P1 - Critical',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    description: 'Catastrophic event: Service is down or severely degraded. Core call routing or customer operations halted.',
    targetResponse: '30 min (24x7)'
  },
  {
    value: 'P2 - Major',
    label: 'P2 - Major',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'High impact: Significant business disruption, key queue impacted or widespread agent degradation.',
    targetResponse: '2 hours'
  },
  {
    value: 'P3 - Moderate',
    label: 'P3 - Moderate',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Medium impact: Partial functionality degraded, workaround exists, isolated agent or administrative issue.',
    targetResponse: '4 hours'
  },
  {
    value: 'P4 - Minor',
    label: 'P4 - Minor',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    description: 'Low impact / Inquiry: How-to questions, minor UI anomaly, documentation clarification, no live disruption.',
    targetResponse: '8-12 hours'
  }
];

export const IMPLEMENTATION_STAGES = [
  'Production',
  'Pre-Production / Staging',
  'Testing / QA',
  'Implementation',
  'Proof of Concept (PoC)'
];

export const CASE_SUB_TYPES = [
  'Incident / Break-Fix',
  'Service Request / Question',
  'Configuration Assistance',
  'Feature Request / Enhancement',
  'Performance / Latency Issue'
];

export const DEPLOYMENT_SUGGESTIONS = [
  'Claro AR - Production (mypurecloud.com / us-east-1)',
  'Claro AR - UAT / Staging',
  'Claro CL - Production (mypurecloud.com / sa-east-1)',
  'Claro BR - Production (mypurecloud.com / sa-east-1)',
  'Claro CO - Production (mypurecloud.com / us-east-1)',
  'Claro PY / UY - Production',
  'Genesys Cloud Enterprise Org (Global)'
];

export const GENESYS_DESCRIPTION_TEMPLATE = `[INCIDENT OVERVIEW]
Brief summary of the issue: 

[CRITICAL GENESYS TELEMETRY]
• Organization ID: 
• Region / AWS Domain: (e.g., us-east-1 / mypurecloud.com)
• Interaction / Conversation ID(s): 
• Correlation ID(s): 
• Timestamp with UTC: (e.g., 2026-09-29 14:35:00 UTC)
• Affected Agent(s) Email / User ID: 
• Affected Queue / Skill: 
• ANI (Caller number) / DNIS (Called number): 

[STEPS TO REPRODUCE]
1. 
2. 
3. 

[EXPECTED BEHAVIOR]
What should have occurred: 

[ACTUAL BEHAVIOR & ERROR CODES]
What actually happened / Error message displayed: 

[TROUBLESHOOTING ALREADY PERFORMED]
• Tested on another browser / incognito? 
• Hard refresh / cache cleared? 
• WebRTC diagnostic tool run? 
• Browser console logs collected (.har / .log)? `;

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    name: 'Voice Call Drop / Audio One-Way',
    description: 'Incident where agents experience one-way audio or calls dropping unexpectedly in production.',
    deployment: 'Claro AR - Production (mypurecloud.com / us-east-1)',
    group: 'Customer Engagement',
    component: 'Voice',
    priority: 'P2 - Major',
    implementationStage: 'Production',
    caseSubType: 'Incident / Break-Fix',
    isSecurityThreat: false,
    subject: 'Production Voice: Intermittent one-way audio and sudden call disconnection',
    descriptionText: `[INCIDENT OVERVIEW]
Multiple contact center agents reporting one-way audio (agent cannot hear customer, or customer cannot hear agent) and sporadic call drops ~15 seconds into connected voice interactions.

[CRITICAL GENESYS TELEMETRY]
• Organization ID: [Insert Claro Org ID]
• Region / AWS Domain: us-east-1 (mypurecloud.com)
• Interaction / Conversation ID(s): 
  - 8a7c92b1-4f32-482a-9e11-1a2b3c4d5e6f
  - b2d8e411-9a70-4f51-8319-7c8d9e0f1a2b
• Timestamp with UTC: 2026-09-29 15:20:00 UTC
• Affected Agent(s) Email / User ID: agent.support@claro.com.ar
• Affected Queue: Atención_Clientes_General
• ANI / DNIS: +5491144445555 / 0800-CLARO

[STEPS TO REPRODUCE]
1. Agent answers inbound voice call from queue.
2. Initial greeting works for 5 seconds.
3. Media audio drops in inbound direction; call drops after 15 seconds.

[EXPECTED BEHAVIOR]
Bi-directional WebRTC audio remains stable throughout interaction without packet loss or premature hangup.

[ACTUAL BEHAVIOR & ERROR CODES]
SIP / WebRTC media stream freezes, agent status switches to 'Wrap-up' unexpectedly with error: 'WebRTC Phone disconnected'.

[TROUBLESHOOTING ALREADY PERFORMED]
• Tested across both Edge and Chrome browsers.
• Network bandwidth verified (> 100 Mbps, jitter < 5ms).
• Browser console .har log and WebRTC diagnostic exported and attached.`,
    businessImpactText: 'Direct customer service impact. Customers are calling back repeatedly due to dropped interactions, increasing queue wait times by 40% and impacting SLA.',
    agentsAffected: 45
  },
  {
    name: 'Agent Workspace Unexpected Force Logout',
    description: 'Agents get suddenly kicked out of Genesys Cloud with token expiration or session termination errors.',
    deployment: 'Claro AR - Production (mypurecloud.com / us-east-1)',
    group: 'Employee Productivity',
    component: 'Agent Workspace',
    priority: 'P2 - Major',
    implementationStage: 'Production',
    caseSubType: 'Incident / Break-Fix',
    isSecurityThreat: false,
    subject: 'Agent Workspace: Spontaneous session logouts with "Token Expired / Session Invalid" prompt',
    descriptionText: `[INCIDENT OVERVIEW]
Agents actively handling chat and voice interactions are receiving an authentication overlay: "Your session has expired or was terminated from another window" and being forced back to SSO login screen.

[CRITICAL GENESYS TELEMETRY]
• Organization ID: [Insert Claro Org ID]
• Region: us-east-1
• Correlation ID(s): d9f4201e-cba1-4567-9123-abcdef012345
• Timestamp with UTC: 2026-09-29 16:10:00 UTC
• Affected Agent User IDs: agent_01@claro.com.ar, agent_02@claro.com.ar

[STEPS TO REPRODUCE]
1. Agent logs into Genesys Cloud via Okta SAML SSO.
2. Agent is active for 20-30 minutes.
3. Red error banner appears and redirects agent to login page, dropping active interactions.

[EXPECTED BEHAVIOR]
Session tokens refresh automatically in background; session timeout configured for 8 hours of inactivity.

[ACTUAL BEHAVIOR & ERROR CODES]
Unexpected 401 Unauthorized on internal WebSocket / heartbeat API calls.

[TROUBLESHOOTING ALREADY PERFORMED]
• Cleared browser cache and cookies.
• Tested in Google Chrome Incognito.
• Verified IdP (Okta) SAML assertion logs show valid token without forced revocation.`,
    businessImpactText: 'Agents are losing active customer chats mid-conversation, causing customer dissatisfaction and requiring manual supervisor intervention to reassign work.',
    agentsAffected: 120
  },
  {
    name: 'Data Action / Webhook 504 Gateway Timeout',
    description: 'Integration data actions fail inside Architect IVR flows, sending callers to default fallback routing.',
    deployment: 'Claro AR - Production (mypurecloud.com / us-east-1)',
    group: 'Open Platform',
    component: 'Custom Functions and Data Actions',
    priority: 'P2 - Major',
    implementationStage: 'Production',
    caseSubType: 'Performance / Latency Issue',
    isSecurityThreat: false,
    subject: 'Architect Flow: Data Action "CRM_Customer_Lookup" timing out with 504 Gateway Timeout',
    descriptionText: `[INCIDENT OVERVIEW]
Custom Data Action responsible for querying CRM customer details during IVR inbound routing is timing out at the 15-second threshold, triggering the 'Failure' branch in Architect.

[CRITICAL GENESYS TELEMETRY]
• Organization ID: [Insert Claro Org ID]
• Region: us-east-1
• Integration Name: Claro CRM Web Services Integration
• Data Action Name: CRM_Customer_Lookup_v2
• Correlation ID(s): c7e6a512-3210-44bb-99cc-112233445566
• Interaction ID(s): a1b2c3d4-e5f6-7890-abcd-ef1234567890
• Timestamp with UTC: 2026-09-29 14:00:00 UTC to Present

[STEPS TO REPRODUCE]
1. Caller enters DNI/Account number in IVR.
2. Call Data Action step executes.
3. Action waits 15 seconds and routes to Architect generic fallback queue.

[EXPECTED BEHAVIOR]
Data action responds within 400-800ms with account billing balance and customer tier.

[ACTUAL BEHAVIOR & ERROR CODES]
HTTP 504 Gateway Timeout / REST action execution failure in Genesys Cloud Integration monitor.

[TROUBLESHOOTING ALREADY PERFORMED]
• Tested CRM endpoint directly from internal network: responds in 320ms HTTP 200 OK.
• Checked firewall logs for Genesys Cloud AWS IP ranges: no blocked packets.
• Executed "Test Action" in Genesys Admin panel: reproduced failure with error code: REST.EXTERNAL_API_TIMEOUT.`,
    businessImpactText: 'High volume IVR flow unable to authenticate customers automatically. 100% of calls are overflowing to live agents without screen-pop data.',
    agentsAffected: 250
  },
  {
    name: 'WFM Scheduling & Adherence Sync Out of Sync',
    description: 'Workforce Management schedules are not updating real-time adherence indicators for supervisors.',
    deployment: 'Claro CL - Production (mypurecloud.com / sa-east-1)',
    group: 'Workforce Engagement',
    component: 'Scheduling',
    priority: 'P3 - Moderate',
    implementationStage: 'Production',
    caseSubType: 'Incident / Break-Fix',
    isSecurityThreat: false,
    subject: 'WFM: Real-time adherence view shows agents out of adherence despite active scheduled status',
    descriptionText: `[INCIDENT OVERVIEW]
Supervisors in Claro Contact Center reporting that the Real-Time Adherence dashboard displays agents as 'Unscheduled / Out of Adherence' when their published schedule clearly has them assigned to 'Inbound Voice'.

[CRITICAL GENESYS TELEMETRY]
• Organization ID: [Insert Claro Org ID]
• Region: sa-east-1 (mypurecloud.com)
• Business Unit: Operaciones_Claro_Norte
• Management Unit: SAC_N1
• Timestamp with UTC: 2026-09-29 13:00:00 UTC
• Affected Supervisor IDs: sup_supervisor@claro.cl

[STEPS TO REPRODUCE]
1. Open Workforce Management -> Real-Time Adherence.
2. Select Management Unit 'SAC_N1'.
3. Observe agent status shows Out of Adherence (flagged Red) for current shift.

[EXPECTED BEHAVIOR]
Adherence engine matches current agent presence (On Queue) with published shift activity (Inbound Voice).

[ACTUAL BEHAVIOR & ERROR CODES]
Status delay of over 45 minutes; adherence calculations showing 0% adherence.

[TROUBLESHOOTING ALREADY PERFORMED]
• Verified shift is published and not in draft state.
• Triggered schedule republish.
• Verified secondary management unit is unaffected.`,
    businessImpactText: 'Supervisors cannot accurately monitor shift compliance or shrinkage in real-time, affecting intra-day staffing adjustments.',
    agentsAffected: 80
  }
];
