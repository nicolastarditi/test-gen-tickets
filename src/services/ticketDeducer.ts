import { GENESYS_GROUPS_AND_COMPONENTS } from '../data/genesysData';
import { TicketFormData } from '../types/ticket';

export interface DeducedTicketResult {
  formData: TicketFormData;
  reasoning: {
    groupReason: string;
    componentReason: string;
    priorityReason: string;
    stageReason: string;
    securityReason: string;
  };
  detectedConversationIds: string[];
  tipsForUser: string[];
}

export function deduceGenesysTicket(
  userContext: string,
  userDeploymentOverride?: string
): DeducedTicketResult {
  const text = userContext.trim();
  const lower = text.toLowerCase();

  // 1. Detect Conversation IDs (UUID format)
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;
  const detectedConversationIds = Array.from(new Set(text.match(uuidRegex) || []));

  // 2. Detect number of agents affected
  let agentsAffected: number | '' = '';
  const agentsMatch =
    lower.match(/(\d+)\s*(?:agentes|operadores|usuarios|users|agents|personas)/i) ||
    lower.match(/(?:afecta|impacta|son)\s*(?:a)?\s*(\d+)/i);
  if (agentsMatch && agentsMatch[1]) {
    agentsAffected = parseInt(agentsMatch[1], 10);
  }

  // 3. Detect Deployment
  let deployment = userDeploymentOverride || 'Claro AR - Production (mypurecloud.com / us-east-1)';
  if (lower.includes('chile') || lower.includes('claro cl') || lower.includes('sa-east-1')) {
    deployment = 'Claro CL - Production (mypurecloud.com / sa-east-1)';
  } else if (lower.includes('brasil') || lower.includes('brazil') || lower.includes('claro br')) {
    deployment = 'Claro BR - Production (mypurecloud.com / sa-east-1)';
  } else if (lower.includes('colombia') || lower.includes('claro co')) {
    deployment = 'Claro CO - Production (mypurecloud.com / us-east-1)';
  } else if (lower.includes('staging') || lower.includes('uat') || lower.includes('test') || lower.includes('lab')) {
    deployment = 'Claro AR - UAT / Staging';
  }

  // 4. Detect Group and Component based on domain terms
  let group = 'Customer Engagement';
  let component = 'Voice';
  let groupReason = 'Detectado por defecto para incidentes de interacción.';
  let componentReason = 'Interacción de voz / llamadas de contact center.';

  // Rules matching
  if (
    lower.includes('data action') ||
    lower.includes('dataaction') ||
    lower.includes('action rest') ||
    lower.includes('custom function') ||
    lower.includes('crm integration') ||
    lower.includes('webhook') ||
    lower.includes('504') ||
    lower.includes('timeout') && (lower.includes('crm') || lower.includes('api') || lower.includes('servicio'))
  ) {
    group = 'Open Platform';
    component = 'Custom Functions and Data Actions';
    groupReason = 'El problema involucra integraciones de plataforma abierta o consumo de APIs externas.';
    componentReason = 'Se identificó el fallo en Data Actions o funciones personalizadas en Architect.';
  } else if (
    lower.includes('api') ||
    lower.includes('sdk') ||
    lower.includes('rest api') ||
    lower.includes('token bearer')
  ) {
    group = 'Open Platform';
    component = 'APIs and SDKs';
    groupReason = 'El incidente está relacionado con el consumo de APIs / SDKs de Genesys Cloud.';
    componentReason = 'Llamadas a endpoints o SDK de desarrollo.';
  } else if (
    lower.includes('logout') ||
    lower.includes('sesion') ||
    lower.includes('sesión') ||
    lower.includes('desconexion') ||
    lower.includes('desconexión') ||
    lower.includes('token expired') ||
    lower.includes('workspace') ||
    lower.includes('navegador') ||
    lower.includes('pantalla') ||
    lower.includes('interfaz') ||
    lower.includes('ui') && lower.includes('agente')
  ) {
    group = 'Employee Productivity';
    component = 'Agent Workspace';
    groupReason = 'El incidente afecta la consola de trabajo del operador (Agent Workspace).';
    componentReason = 'Comportamiento anómalo en la UI o cierres forzados de sesión de agentes.';
  } else if (lower.includes('script') || lower.includes('guion') || lower.includes('guión')) {
    group = 'Employee Productivity';
    component = 'Agent Scripting';
    groupReason = 'Herramientas de productividad del agente.';
    componentReason = 'Componente de scripts / guías en pantalla para llamadas.';
  } else if (
    lower.includes('wfm') ||
    lower.includes('adherencia') ||
    lower.includes('adherence') ||
    lower.includes('schedule') ||
    lower.includes('horario') ||
    lower.includes('turno') ||
    lower.includes('planificacion') ||
    lower.includes('planificación') ||
    lower.includes('forecast')
  ) {
    group = 'Workforce Engagement';
    if (lower.includes('adheren')) {
      component = 'Monitoring - Adherence - Shrinkage Mgmt';
      componentReason = 'Monitoreo de adherencia en tiempo real o métricas de shrinkage.';
    } else if (lower.includes('forecast') || lower.includes('pronostico')) {
      component = 'Forecasting';
      componentReason = 'Módulos de pronóstico de demanda horaria.';
    } else {
      component = 'Scheduling';
      componentReason = 'Publicación, generación o ajuste de calendarios y turnos.';
    }
    groupReason = 'El problema pertenece a la suite de Workforce Management (WFM / WEM).';
  } else if (
    lower.includes('grabacion') ||
    lower.includes('grabación') ||
    lower.includes('recording') ||
    lower.includes('screen recording') ||
    lower.includes('audio grabado')
  ) {
    group = 'Workforce Engagement';
    component = 'Interaction and Screen Recording';
    groupReason = 'Suite de Workforce Engagement.';
    componentReason = 'Grabaciones de pantalla o de audio no disponibles o con errores.';
  } else if (
    lower.includes('calidad') ||
    lower.includes('quality') ||
    lower.includes('evaluacion') ||
    lower.includes('evaluación') ||
    lower.includes('form') && lower.includes('calidad')
  ) {
    group = 'Workforce Engagement';
    component = 'Quality Management';
    groupReason = 'Gestión de calidad operativa.';
    componentReason = 'Formularios y evaluaciones de calidad de interacciones.';
  } else if (
    lower.includes('campaña') ||
    lower.includes('campana') ||
    lower.includes('dialer') ||
    lower.includes('marcador') ||
    lower.includes('outbound') ||
    lower.includes('saliente')
  ) {
    group = 'Customer Engagement';
    component = 'Outbound Campaigns and Dialer';
    groupReason = 'Interacciones salientes y automatización de llamadas con clientes.';
    componentReason = 'Marcador predictivo / progresivo o listas de campaña de Outbound.';
  } else if (
    lower.includes('architect') ||
    lower.includes('ivr') ||
    lower.includes('flujo') ||
    lower.includes('flow') ||
    lower.includes('enrutamiento') ||
    lower.includes('cola') ||
    lower.includes('queue') ||
    lower.includes('routing')
  ) {
    group = 'Customer Engagement';
    component = 'Routing - Architect or Orchestration Builder';
    groupReason = 'Motor de enrutamiento y experiencia del cliente.';
    componentReason = 'Lógica en flujos Architect, menús IVR o reglas de asignación a colas.';
  } else if (
    lower.includes('chat') ||
    lower.includes('whatsapp') ||
    lower.includes('messaging') ||
    lower.includes('mensajeria') ||
    lower.includes('mensajería') ||
    lower.includes('web messaging')
  ) {
    group = 'Customer Engagement';
    component = 'Web, Mobile Messaging and Messenger Apps';
    groupReason = 'Canales digitales de atención al cliente.';
    componentReason = 'Mensajería asincrónica (Web Messenger, WhatsApp o aplicaciones móviles).';
  } else if (lower.includes('sms') || lower.includes('mensaje de texto')) {
    group = 'Customer Engagement';
    component = 'SMS';
    groupReason = 'Canales digitales.';
    componentReason = 'Envíos o recepciones de SMS en la plataforma.';
  } else if (lower.includes('email') || lower.includes('correo')) {
    group = 'Customer Engagement';
    component = 'E-mail';
    groupReason = 'Canales de atención digital.';
    componentReason = 'Enrutamiento o envío de correos electrónicos.';
  } else if (
    lower.includes('callback') ||
    lower.includes('rellamada') ||
    lower.includes('devolucion de llamada')
  ) {
    group = 'Customer Engagement';
    component = 'Callbacks';
    groupReason = 'Atención y retención de llamadas en cola.';
    componentReason = 'Solicitudes automáticas o programadas de Callback.';
  } else if (
    lower.includes('reporte') ||
    lower.includes('analytics') ||
    lower.includes('dashboard') ||
    lower.includes('estadistica') ||
    lower.includes('export') && lower.includes('datos')
  ) {
    group = 'Data, Analytics, and Reporting';
    component = 'Analytics and Reporting';
    groupReason = 'Reportes operativos y cuadros de control.';
    componentReason = 'Vistas de rendimiento, reportes históricos o analítica de colas.';
  } else if (
    lower.includes('speech') ||
    lower.includes('sentimiento') ||
    lower.includes('sentiment') ||
    lower.includes('analisis de voz') ||
    lower.includes('transcripcion') ||
    lower.includes('transcripción')
  ) {
    group = 'Data, Analytics, and Reporting';
    component = 'Speech and Text Analytics';
    groupReason = 'Analítica avanzada de audio y texto.';
    componentReason = 'Transcripción automática de llamadas y detección de temas/sentimiento.';
  } else if (
    lower.includes('usuario') ||
    lower.includes('login') ||
    lower.includes('sso') ||
    lower.includes('okta') ||
    lower.includes('rol') ||
    lower.includes('permiso') ||
    lower.includes('password')
  ) {
    group = 'Account Management';
    component = 'Identity and Access Management';
    groupReason = 'Administración de cuentas corporativas y autenticación.';
    componentReason = 'Control de accesos, roles, permisos o integración SSO SAML.';
  } else {
    // Default to Voice if contains audio, llamada, teléfono, webrtc, mic
    group = 'Customer Engagement';
    component = 'Voice';
    groupReason = 'Atención y telefonía en tiempo real.';
    componentReason = 'Llamadas de voz entrantes/salientes o softphone WebRTC.';
  }

  // Ensure component belongs to group in the JSON specification
  const validComponents = GENESYS_GROUPS_AND_COMPONENTS[group] || [];
  if (!validComponents.includes(component)) {
    component = validComponents[0] || 'Voice';
  }

  // 5. Detect Security Threat
  const isSecurityThreat =
    lower.includes('seguridad') ||
    lower.includes('security') ||
    lower.includes('vulnerabilidad') ||
    lower.includes('vulnerability') ||
    lower.includes('cve') ||
    lower.includes('hack') ||
    lower.includes('ataque') ||
    lower.includes('ddos') ||
    lower.includes('fuga de datos') ||
    lower.includes('data breach') ||
    lower.includes('filtracion') ||
    lower.includes('filtración');

  const securityReason = isSecurityThreat
    ? '⚠️ Se detectaron términos de vulnerabilidad o exposición de datos sensibles. El caso requiere triage de InfoSec.'
    : 'No se detectaron indicios de amenaza de seguridad o brecha de datos.';

  // 6. Detect Priority
  let priority: TicketFormData['priority'] = 'P2 - Major';
  let priorityReason = 'Disrupción significativa en el servicio con impacto en llamadas o agentes.';

  if (
    lower.includes('caido todo') ||
    lower.includes('caído todo') ||
    lower.includes('down total') ||
    lower.includes('sin servicio') ||
    lower.includes('nadie puede') ||
    lower.includes('total outage') ||
    lower.includes('p1') ||
    lower.includes('critico') ||
    lower.includes('crítico') ||
    (typeof agentsAffected === 'number' && agentsAffected > 200 && lower.includes('no entran llamadas'))
  ) {
    priority = 'P1 - Critical';
    priorityReason = 'Caída total o impacto masivo sin alternativa de contingencia (Outage severo).';
  } else if (
    lower.includes('duda') ||
    lower.includes('consulta') ||
    lower.includes('como se configura') ||
    lower.includes('cómo se configura') ||
    lower.includes('pregunta') ||
    lower.includes('p4') ||
    lower.includes('menor') ||
    lower.includes('cosmetico') ||
    lower.includes('cosmético')
  ) {
    priority = 'P4 - Minor';
    priorityReason = 'Consulta administrativa o duda de funcionamiento sin impacto en la operación en vivo.';
  } else if (
    lower.includes('un solo agente') ||
    lower.includes('un agente') ||
    lower.includes('aislado') ||
    lower.includes('workaround') ||
    lower.includes('alternativa') ||
    lower.includes('p3') ||
    lower.includes('moderado')
  ) {
    priority = 'P3 - Moderate';
    priorityReason = 'Incidente parcial o aislado con posibilidad de workaround temporal.';
  } else {
    priority = 'P2 - Major';
    priorityReason = 'Degradación operativa notable en producción que afecta la atención o múltiples agentes.';
  }

  // 7. Implementation Stage
  let implementationStage = 'Production';
  let stageReason = 'Ambiente productivo de contact center.';
  if (lower.includes('staging') || lower.includes('uat')) {
    implementationStage = 'Pre-Production / Staging';
    stageReason = 'Se detectó entorno de pre-producción / pruebas de aceptación.';
  } else if (lower.includes('qa') || lower.includes('test')) {
    implementationStage = 'Testing / QA';
    stageReason = 'Ambiente de pruebas o control de calidad.';
  }

  // 8. Case Sub Type
  let caseSubType = 'Incident / Break-Fix';
  if (lower.includes('pregunta') || lower.includes('consulta') || lower.includes('duda')) {
    caseSubType = 'Service Request / Question';
  } else if (lower.includes('configur') || lower.includes('como hacer')) {
    caseSubType = 'Configuration Assistance';
  } else if (lower.includes('lento') || lower.includes('latencia') || lower.includes('demora') || lower.includes('timeout')) {
    caseSubType = 'Performance / Latency Issue';
  } else if (lower.includes('mejora') || lower.includes('feature request') || lower.includes('solicitud')) {
    caseSubType = 'Feature Request / Enhancement';
  }

  // 9. Generate Professional Subject
  let cleanSubject = '';
  // Try to generate a standard Genesys Subject: [Deployment] Environment: Component - Concise description
  const depTag = deployment.includes('Claro') ? `[${deployment.split(' ')[0]} ${deployment.split(' ')[1] || ''}]` : '[Production]';
  
  if (component === 'Voice') {
    if (lower.includes('audio') || lower.includes('one-way') || lower.includes('unilateral')) {
      cleanSubject = `${depTag} Voice: Intermittent one-way audio / silent calls in queue`;
    } else if (lower.includes('corta') || lower.includes('drop') || lower.includes('cae')) {
      cleanSubject = `${depTag} Voice: Premature call disconnection / drops during live interaction`;
    } else {
      cleanSubject = `${depTag} Voice: Media and telephony degradation impacting live interactions`;
    }
  } else if (component === 'Agent Workspace') {
    cleanSubject = `${depTag} Agent Workspace: Unexpected session logout / UI freezing for operators`;
  } else if (component === 'Custom Functions and Data Actions') {
    cleanSubject = `${depTag} Architect Data Actions: REST integration timeout / failure during call routing`;
  } else if (component === 'Outbound Campaigns and Dialer') {
    cleanSubject = `${depTag} Outbound: Dialer campaign failing to deliver connected contacts to agents`;
  } else if (component.includes('Scheduling') || component.includes('Adherence')) {
    cleanSubject = `${depTag} WFM: Real-time adherence / schedule synchronization discrepancy`;
  } else if (component.includes('Routing') || component.includes('Architect')) {
    cleanSubject = `${depTag} Architect: Inbound call flow routing anomaly preventing queue assignment`;
  } else {
    // Extract first sentence or 60 chars of text
    const firstLine = text.split('\n')[0].replace(/[.\n\r]/g, '').slice(0, 70);
    cleanSubject = `${depTag} ${component}: ${firstLine}`;
  }

  // 10. Generate Structured Description with Telemetry guidance
  const currentUtc = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const convIdSnippet = detectedConversationIds.length > 0
    ? detectedConversationIds.map((id) => `  • ${id}`).join('\n')
    : '  • [Insert 1-2 Conversation IDs from Performance > Interactions]';

  const description = `[INCIDENT OVERVIEW]
${text}

[CRITICAL GENESYS TELEMETRY]
• Deployment / Filter: ${deployment}
• Genesys Component: ${group} → ${component}
• Organization ID: [Insert Claro Org ID from Admin > Org Settings]
• Region / AWS Domain: ${deployment.includes('sa-east-1') ? 'sa-east-1' : 'us-east-1 (mypurecloud.com)'}
• Timestamp (UTC): ${currentUtc}
• Interaction / Conversation ID(s):
${convIdSnippet}
• Affected Agent(s): ${agentsAffected !== '' ? `${agentsAffected} agents affected` : '[Insert sample agent user email/ID]'}
• Browser & Environment: Google Chrome / Genesys Cloud Desktop App

[STEPS TO REPRODUCE]
1. Agent enters 'On Queue' status in Agent Workspace.
2. Inbound interaction arrives and is accepted.
3. Observe reported anomaly (${lower.includes('audio') ? 'audio drops / one-way communication' : 'error prompt displayed or session terminated'}).

[EXPECTED BEHAVIOR]
Platform should process the interaction normally according to standard Genesys Cloud SLA without unexpected errors or disconnects.

[ACTUAL BEHAVIOR & ERROR DETAILS]
${text.split('\n').slice(0, 3).join(' ')}

[TROUBLESHOOTING ALREADY PERFORMED]
• Verified network connectivity and bandwidth stability.
• Tested across multiple agent workstations to confirm it is not an isolated local hardware issue.
• Diagnostic logs / HAR traces prepared for attachment.`;

  // 11. Generate Business Impact
  let businessImpact = '';
  if (priority === 'P1 - Critical') {
    businessImpact = `CRITICAL OPERATIONAL IMPACT: Complete stoppage of customer contact operations. Callers are unable to reach Claro support, directly causing severe SLA breach and immediate reputational and financial disruption. Immediate 24x7 resolution required.`;
  } else if (priority === 'P2 - Major') {
    businessImpact = `HIGH BUSINESS IMPACT: ${agentsAffected !== '' ? `${agentsAffected} agents are experiencing disruptions` : 'Multiple agents in customer service queues are affected'}. Results in repeated customer callbacks, elevated queue abandonment rates, and significant degradation of customer satisfaction (CSAT) metrics.`;
  } else if (priority === 'P3 - Moderate') {
    businessImpact = `MODERATE IMPACT: Functionality is partially degraded, but a temporary workaround exists. Staffing or secondary administrative processes are slowed down without complete service interruption.`;
  } else {
    businessImpact = `LOW IMPACT: Operational continuity is maintained. Required for technical clarification, configuration alignment, or minor procedural verification.`;
  }

  // 12. Tips for user
  const tipsForUser: string[] = [];
  if (detectedConversationIds.length === 0) {
    tipsForUser.push('Tip: Genesys exige al menos 1 Conversation ID para rastrear paquetes. Búscalo en Rendimiento > Interacciones.');
  }
  if (component === 'Voice') {
    tipsForUser.push('Para problemas de voz, adjunta en el portal el archivo de Diagnóstico WebRTC del agente o log HAR.');
  }
  if (isSecurityThreat) {
    tipsForUser.push('Atención: NO pegues contraseñas ni datos bancarios en el campo de texto. Genesys solicitará canal seguro si hace falta.');
  }

  return {
    formData: {
      deployment,
      group,
      component,
      priority,
      implementationStage,
      caseSubType,
      isSecurityThreat,
      subject: cleanSubject,
      description,
      businessImpact,
      agentsAffected
    },
    reasoning: {
      groupReason,
      componentReason,
      priorityReason,
      stageReason,
      securityReason
    },
    detectedConversationIds,
    tipsForUser
  };
}
