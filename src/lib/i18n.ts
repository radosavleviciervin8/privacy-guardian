// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Internationalization (i18n) support for multi-language accessibility.

import { type CategoryKey, CATEGORY_LABELS, CLASSIFICATIONS } from "./evidence";

export type LanguageCode = "en" | "es" | "fr" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ar";

export interface Translation {
  // Common
  appName: string;
  appDescription: string;
  copyright: string;

  // Navigation
  navRegistry: string;
  navSentinel: string;
  navSafeguards: string;
  navLegal: string;
  navEncryption: string;

  // Actions
  save: string;
  delete: string;
  export: string;
  import: string;
  clear: string;
  copy: string;
  refresh: string;
  scan: string;

  // Evidence Registry
  evidenceTitle: string;
  evidenceSubtitle: string;
  observation: string;
  technicalReference: string;
  classification: string;
  timestamp: string;
  categories: string;
  noIncidents: string;

  // Sentinel Dashboard
  sentinelTitle: string;
  sentinelSubtitle: string;
  healthScore: string;
  threatLevel: string;
  interferenceScore: string;
  totalIncidents: string;
  verified: string;
  quarantined: string;
  safeguardsActive: string;
  recentActivity: string;
  signalPatterns: string;
  interferenceLogs: string;
  recommendations: string;

  // Safeguards
  safeguardsTitle: string;
  safeguardsSubtitle: string;
  privacySafeguards: string;
  integritySafeguards: string;
  nonAggressionSafeguards: string;
  dueProcessSafeguards: string;
  securitySafeguards: string;
  internationalLawSafeguards: string;

  // Legal Framework
  legalTitle: string;
  legalSubtitle: string;
  complianceReport: string;
  legalInstruments: string;

  // Encryption
  encryptionTitle: string;
  encryptionSubtitle: string;
  encrypt: string;
  decrypt: string;
  password: string;
  encryptedData: string;
  decryptedText: string;

  // Notices
  noticeSuccess: string;
  noticeError: string;
  noticeWarning: string;
  noticeInfo: string;

  // Legal Notices
  ndaNotice: string;
  privateLicense: string;
  humanRightsLaw: string;

  // Severity Levels
  severityLow: string;
  severityMedium: string;
  severityHigh: string;
  severityCritical: string;

  // Threat Levels
  threatNone: string;
  threatLow: string;
  threatMedium: string;
  threatHigh: string;
  threatCritical: string;
}

// English Translations (Default)
const EN_TRANSLATIONS: Translation = {
  appName: "NDA Multi-Signal Defensive Protection & Evidence Registry",
  appDescription: "Local-first, non-jamming defensive evidence registry for technical observations",
  copyright: "© Ervin Remus Radosavlevici. All rights reserved.",

  navRegistry: "Evidence Registry",
  navSentinel: "Sentinel Dashboard",
  navSafeguards: "Safeguards",
  navLegal: "Legal Framework",
  navEncryption: "Encryption",

  save: "Save",
  delete: "Delete",
  export: "Export",
  import: "Import",
  clear: "Clear",
  copy: "Copy",
  refresh: "Refresh",
  scan: "Scan",

  evidenceTitle: "Incident / Observation Record",
  evidenceSubtitle: "Record technical observations and evidence",
  observation: "Observation",
  technicalReference: "Technical Reference",
  classification: "Classification",
  timestamp: "Timestamp",
  categories: "Categories",
  noIncidents: "No incidents recorded yet",

  sentinelTitle: "Sentinel Dashboard",
  sentinelSubtitle: "Autonomous integrity monitoring and interference detection",
  healthScore: "System Health",
  threatLevel: "Threat Level",
  interferenceScore: "Interference Score",
  totalIncidents: "Total Incidents",
  verified: "Verified",
  quarantined: "Quarantined",
  safeguardsActive: "Safeguards Active",
  recentActivity: "Recent Activity",
  signalPatterns: "Signal Patterns",
  interferenceLogs: "Interference Logs",
  recommendations: "Recommendations",

  safeguardsTitle: "200+ Defensive Safeguards",
  safeguardsSubtitle: "Comprehensive safeguards mapped to international human rights law",
  privacySafeguards: "Privacy & Data Minimisation",
  integritySafeguards: "Evidence Integrity & Anti-Interference",
  nonAggressionSafeguards: "Non-Aggression & Lawful Operation",
  dueProcessSafeguards: "Due Process, Dignity & Fairness",
  securitySafeguards: "Technical Security & Confidentiality",
  internationalLawSafeguards: "International Legal Framework",

  legalTitle: "International Legal Framework",
  legalSubtitle: "Comprehensive compliance with international human rights instruments",
  complianceReport: "Compliance Report",
  legalInstruments: "Legal Instruments",

  encryptionTitle: "Encryption Utilities",
  encryptionSubtitle: "Client-side encryption for sensitive data",
  encrypt: "Encrypt",
  decrypt: "Decrypt",
  password: "Password",
  encryptedData: "Encrypted Data",
  decryptedText: "Decrypted Text",

  noticeSuccess: "Success",
  noticeError: "Error",
  noticeWarning: "Warning",
  noticeInfo: "Information",

  ndaNotice: "NDA / Provenance / Private License Notice",
  privateLicense: "Private License — confidential, non-transferable, subject to NDA",
  humanRightsLaw: "International human-rights-law ethics and privacy principles",

  severityLow: "Low",
  severityMedium: "Medium",
  severityHigh: "High",
  severityCritical: "Critical",

  threatNone: "None",
  threatLow: "Low",
  threatMedium: "Medium",
  threatHigh: "High",
  threatCritical: "Critical",
};

// Spanish Translations
const ES_TRANSLATIONS: Translation = {
  appName: "Registro de Protección y Evidencia Multiseñal NDA",
  appDescription: "Registro de evidencia defensivo local para observaciones técnicas",
  copyright: "© Ervin Remus Radosavlevici. Todos los derechos reservados.",

  navRegistry: "Registro de Evidencia",
  navSentinel: "Panel de Vigilancia",
  navSafeguards: "Protecciones",
  navLegal: "Marco Legal",
  navEncryption: "Cifrado",

  save: "Guardar",
  delete: "Eliminar",
  export: "Exportar",
  import: "Importar",
  clear: "Limpiar",
  copy: "Copiar",
  refresh: "Actualizar",
  scan: "Escanear",

  evidenceTitle: "Registro de Incidente / Observación",
  evidenceSubtitle: "Registre observaciones y evidencia técnica",
  observation: "Observación",
  technicalReference: "Referencia Técnica",
  classification: "Clasificación",
  timestamp: "Fecha y Hora",
  categories: "Categorías",
  noIncidents: "No se han registrado incidentes aún",

  sentinelTitle: "Panel de Vigilancia",
  sentinelSubtitle: "Monitoreo autónomo de integridad y detección de interferencias",
  healthScore: "Salud del Sistema",
  threatLevel: "Nivel de Amenaza",
  interferenceScore: "Puntuación de Interferencia",
  totalIncidents: "Incidentes Totales",
  verified: "Verificados",
  quarantined: "En Cuarentena",
  safeguardsActive: "Protecciones Activas",
  recentActivity: "Actividad Reciente",
  signalPatterns: "Patrones de Señal",
  interferenceLogs: "Registros de Interferencia",
  recommendations: "Recomendaciones",

  safeguardsTitle: "200+ Protecciones Defensivas",
  safeguardsSubtitle: "Protecciones completas mapeadas a la ley internacional de derechos humanos",
  privacySafeguards: "Privacidad y Minimización de Datos",
  integritySafeguards: "Integridad de Evidencia y Anti-Interferencia",
  nonAggressionSafeguards: "No Agresión y Operación Legal",
  dueProcessSafeguards: "Proceso Debido, Dignidad y Justicia",
  securitySafeguards: "Seguridad Técnica y Confidencialidad",
  internationalLawSafeguards: "Marco Legal Internacional",

  legalTitle: "Marco Legal Internacional",
  legalSubtitle: "Cumplimiento completo con instrumentos internacionales de derechos humanos",
  complianceReport: "Informe de Cumplimiento",
  legalInstruments: "Instrumentos Legales",

  encryptionTitle: "Utilidades de Cifrado",
  encryptionSubtitle: "Cifrado del lado del cliente para datos sensibles",
  encrypt: "Cifrar",
  decrypt: "Descifrar",
  password: "Contraseña",
  encryptedData: "Datos Cifrados",
  decryptedText: "Texto Descifrado",

  noticeSuccess: "Éxito",
  noticeError: "Error",
  noticeWarning: "Advertencia",
  noticeInfo: "Información",

  ndaNotice: "Aviso de NDA / Procedencia / Licencia Privada",
  privateLicense: "Licencia Privada — confidencial, no transferible, sujeta a NDA",
  humanRightsLaw: "Principios éticos y de privacidad de la ley internacional de derechos humanos",

  severityLow: "Bajo",
  severityMedium: "Medio",
  severityHigh: "Alto",
  severityCritical: "Crítico",

  threatNone: "Ninguno",
  threatLow: "Bajo",
  threatMedium: "Medio",
  threatHigh: "Alto",
  threatCritical: "Crítico",
};

// French Translations
const FR_TRANSLATIONS: Translation = {
  appName: "Registre de Protection et Preuves Multi-Signaux NDA",
  appDescription: "Registre de preuves défensif local pour observations techniques",
  copyright: "© Ervin Remus Radosavlevici. Tous droits réservés.",

  navRegistry: "Registre des Preuves",
  navSentinel: "Tableau de Bord Sentinel",
  navSafeguards: "Garanties",
  navLegal: "Cadre Juridique",
  navEncryption: "Chiffrement",

  save: "Sauvegarder",
  delete: "Supprimer",
  export: "Exporter",
  import: "Importer",
  clear: "Effacer",
  copy: "Copier",
  refresh: "Rafraîchir",
  scan: "Analyser",

  evidenceTitle: "Enregistrement d'Incident / Observation",
  evidenceSubtitle: "Enregistrez les observations et preuves techniques",
  observation: "Observation",
  technicalReference: "Référence Technique",
  classification: "Classification",
  timestamp: "Horodatage",
  categories: "Catégories",
  noIncidents: "Aucun incident enregistré",

  sentinelTitle: "Tableau de Bord Sentinel",
  sentinelSubtitle: "Surveillance autonome de l'intégrité et détection des interférences",
  healthScore: "Santé du Système",
  threatLevel: "Niveau de Menace",
  interferenceScore: "Score d'Interférence",
  totalIncidents: "Incidents Totaux",
  verified: "Vérifiés",
  quarantined: "En Quarantaine",
  safeguardsActive: "Garanties Actives",
  recentActivity: "Activité Récente",
  signalPatterns: "Motifs de Signal",
  interferenceLogs: "Journaux d'Interférence",
  recommendations: "Recommandations",

  safeguardsTitle: "200+ Garanties Défensives",
  safeguardsSubtitle:
    "Garanties complètes cartographiées sur la loi internationale des droits de l'homme",
  privacySafeguards: "Confidentialité et Minimisation des Données",
  integritySafeguards: "Intégrité des Preuves et Anti-Interférence",
  nonAggressionSafeguards: "Non-Agression et Opération Légale",
  dueProcessSafeguards: "Procédure Régulière, Dignité et Équité",
  securitySafeguards: "Sécurité Technique et Confidentialité",
  internationalLawSafeguards: "Cadre Juridique International",

  legalTitle: "Cadre Juridique International",
  legalSubtitle: "Conformité complète avec les instruments internationaux des droits de l'homme",
  complianceReport: "Rapport de Conformité",
  legalInstruments: "Instruments Juridiques",

  encryptionTitle: "Utilitaires de Chiffrement",
  encryptionSubtitle: "Chiffrement côté client pour les données sensibles",
  encrypt: "Chiffrer",
  decrypt: "Déchiffrer",
  password: "Mot de Passe",
  encryptedData: "Données Chiffrées",
  decryptedText: "Texte Déchiffré",

  noticeSuccess: "Succès",
  noticeError: "Erreur",
  noticeWarning: "Avertissement",
  noticeInfo: "Information",

  ndaNotice: "Avis de NDA / Provenance / Licence Privée",
  privateLicense: "Licence Privée — confidentielle, non transférable, soumise à NDA",
  humanRightsLaw:
    "Principes éthiques et de confidentialité de la loi internationale des droits de l'homme",

  severityLow: "Faible",
  severityMedium: "Moyen",
  severityHigh: "Élevé",
  severityCritical: "Critique",

  threatNone: "Aucun",
  threatLow: "Faible",
  threatMedium: "Moyen",
  threatHigh: "Élevé",
  threatCritical: "Critique",
};

// German Translations
const DE_TRANSLATIONS: Translation = {
  appName: "NDA Multi-Signal Verteidigungs- und Beweismittelschutz",
  appDescription:
    "Lokales, nicht-störendes defensives Beweismittelregister für technische Beobachtungen",
  copyright: "© Ervin Remus Radosavlevici. Alle Rechte vorbehalten.",

  navRegistry: "Beweismittelregister",
  navSentinel: "Sentinel-Dashboard",
  navSafeguards: "Sicherheitsvorkehrungen",
  navLegal: "Rechtlicher Rahmen",
  navEncryption: "Verschlüsselung",

  save: "Speichern",
  delete: "Löschen",
  export: "Exportieren",
  import: "Importieren",
  clear: "Zurücksetzen",
  copy: "Kopieren",
  refresh: "Aktualisieren",
  scan: "Scannen",

  evidenceTitle: "Vorfall- / Beobachtungsaufzeichnung",
  evidenceSubtitle: "Technische Beobachtungen und Beweismittel aufzeichnen",
  observation: "Beobachtung",
  technicalReference: "Technische Referenz",
  classification: "Klassifizierung",
  timestamp: "Zeitstempel",
  categories: "Kategorien",
  noIncidents: "Noch keine Vorfälle aufgezeichnet",

  sentinelTitle: "Sentinel-Dashboard",
  sentinelSubtitle: "Autonome Integritätsüberwachung und Störungserkennung",
  healthScore: "Systemgesundheit",
  threatLevel: "Bedrohungsstufe",
  interferenceScore: "Störungsbewertung",
  totalIncidents: "Gesamtvorfälle",
  verified: "Bestätigt",
  quarantined: "Isoliert",
  safeguardsActive: "Aktive Sicherheitsvorkehrungen",
  recentActivity: "Letzte Aktivitäten",
  signalPatterns: "Signalmuster",
  interferenceLogs: "Störungsprotokolle",
  recommendations: "Empfehlungen",

  safeguardsTitle: "200+ Defensive Sicherheitsvorkehrungen",
  safeguardsSubtitle:
    "Umfassende Sicherheitsvorkehrungen, die auf das internationale Menschenrechtsgesetz abgebildet sind",
  privacySafeguards: "Datenschutz und Datenminimierung",
  integritySafeguards: "Beweismittelintegrität und Anti-Störung",
  nonAggressionSafeguards: "Nicht-Aggression und rechtmäßiger Betrieb",
  dueProcessSafeguards: "Fairer Prozess, Würde und Gerechtigkeit",
  securitySafeguards: "Technische Sicherheit und Vertraulichkeit",
  internationalLawSafeguards: "Internationaler Rechtsrahmen",

  legalTitle: "Internationaler Rechtsrahmen",
  legalSubtitle: "Umfassende Einhaltung internationaler Menschenrechtsinstrumente",
  complianceReport: "Compliance-Bericht",
  legalInstruments: "Rechtsinstrumente",

  encryptionTitle: "Verschlüsselungs-Tools",
  encryptionSubtitle: "Clientseitige Verschlüsselung für sensible Daten",
  encrypt: "Verschlüsseln",
  decrypt: "Entschlüsseln",
  password: "Passwort",
  encryptedData: "Verschlüsselte Daten",
  decryptedText: "Entschlüsselter Text",

  noticeSuccess: "Erfolg",
  noticeError: "Fehler",
  noticeWarning: "Warnung",
  noticeInfo: "Information",

  ndaNotice: "NDA / Herkunft / Private Lizenzhinweis",
  privateLicense: "Private Lizenz — vertraulich, nicht übertragbar, unterliegt NDA",
  humanRightsLaw:
    "Ethische Prinzipien und Datenschutzbestimmungen des internationalen Menschenrechtsgesetzes",

  severityLow: "Niedrig",
  severityMedium: "Mittel",
  severityHigh: "Hoch",
  severityCritical: "Kritisch",

  threatNone: "Keine",
  threatLow: "Niedrig",
  threatMedium: "Mittel",
  threatHigh: "Hoch",
  threatCritical: "Kritisch",
};

// Italian Translations
const IT_TRANSLATIONS: Translation = {
  appName: "Registro di Protezione e Prova Multi-Segnale NDA",
  appDescription: "Registro di prove difensive locale per osservazioni tecniche",
  copyright: "© Ervin Remus Radosavlevici. Tutti i diritti riservati.",

  navRegistry: "Registro Prove",
  navSentinel: "Dashboard Sentinel",
  navSafeguards: "Misure di Sicurezza",
  navLegal: "Quadro Giuridico",
  navEncryption: "Crittografia",

  save: "Salva",
  delete: "Elimina",
  export: "Esporta",
  import: "Importa",
  clear: "Cancella",
  copy: "Copia",
  refresh: "Aggiorna",
  scan: "Scansione",

  evidenceTitle: "Registro Incidente / Osservazione",
  evidenceSubtitle: "Registra osservazioni e prove tecniche",
  observation: "Osservazione",
  technicalReference: "Riferimento Tecnico",
  classification: "Classificazione",
  timestamp: "Timestamp",
  categories: "Categorie",
  noIncidents: "Nessun incidente registrato",

  sentinelTitle: "Dashboard Sentinel",
  sentinelSubtitle: "Monitoraggio autonomo dell'integrità e rilevamento interferenze",
  healthScore: "Salute Sistema",
  threatLevel: "Livello Minaccia",
  interferenceScore: "Punteggio Interferenza",
  totalIncidents: "Incidenti Totali",
  verified: "Verificati",
  quarantined: "In Quarantena",
  safeguardsActive: "Misure Attive",
  recentActivity: "Attività Recenti",
  signalPatterns: "Pattern Segnale",
  interferenceLogs: "Registri Interferenza",
  recommendations: "Raccomandazioni",

  safeguardsTitle: "200+ Misure di Sicurezza Difensive",
  safeguardsSubtitle:
    "Misure di sicurezza complete mappate sul diritto internazionale dei diritti umani",
  privacySafeguards: "Privacy e Minimizzazione Dati",
  integritySafeguards: "Integrità Prove e Anti-Interferenza",
  nonAggressionSafeguards: "Non Aggressione e Operazione Legale",
  dueProcessSafeguards: "Dovuto Processo, Dignità e Giustizia",
  securitySafeguards: "Sicurezza Tecnica e Riservatezza",
  internationalLawSafeguards: "Quadro Giuridico Internazionale",

  legalTitle: "Quadro Giuridico Internazionale",
  legalSubtitle: "Conformità completa con gli strumenti internazionali dei diritti umani",
  complianceReport: "Rapporto di Conformità",
  legalInstruments: "Strumenti Giuridici",

  encryptionTitle: "Utilità Crittografia",
  encryptionSubtitle: "Crittografia lato client per dati sensibili",
  encrypt: "Crittografa",
  decrypt: "Decrittografa",
  password: "Password",
  encryptedData: "Dati Crittografati",
  decryptedText: "Testo Decrittografato",

  noticeSuccess: "Successo",
  noticeError: "Errore",
  noticeWarning: "Avviso",
  noticeInfo: "Informazione",

  ndaNotice: "Avviso NDA / Provenienza / Licenza Privata",
  privateLicense: "Licenza Privata — riservata, non trasferibile, soggetta a NDA",
  humanRightsLaw: "Principi etici e di privacy della legge internazionale sui diritti umani",

  severityLow: "Basso",
  severityMedium: "Medium",
  severityHigh: "Alto",
  severityCritical: "Critico",

  threatNone: "Nessuno",
  threatLow: "Basso",
  threatMedium: "Medium",
  threatHigh: "Alto",
  threatCritical: "Critico",
};

// Portuguese Translations
const PT_TRANSLATIONS: Translation = {
  appName: "Registro de Proteção e Evidências Multi-Sinal NDA",
  appDescription: "Registro de evidências defensivo local para observações técnicas",
  copyright: "© Ervin Remus Radosavlevici. Todos os direitos reservados.",

  navRegistry: "Registro de Evidências",
  navSentinel: "Painel Sentinel",
  navSafeguards: "Medidas de Segurança",
  navLegal: "Estrutura Jurídica",
  navEncryption: "Criptografia",

  save: "Salvar",
  delete: "Excluir",
  export: "Exportar",
  import: "Importar",
  clear: "Limpar",
  copy: "Copiar",
  refresh: "Atualizar",
  scan: "Escanear",

  evidenceTitle: "Registro de Incidente / Observação",
  evidenceSubtitle: "Registre observações e evidências técnicas",
  observation: "Observação",
  technicalReference: "Referência Técnica",
  classification: "Classificação",
  timestamp: "Carimbo de Data/Hora",
  categories: "Categorias",
  noIncidents: "Nenhum incidente registrado",

  sentinelTitle: "Painel Sentinel",
  sentinelSubtitle: "Monitoramento autônomo de integridade e detecção de interferências",
  healthScore: "Saúde do Sistema",
  threatLevel: "Nível de Ameaça",
  interferenceScore: "Pontuação de Interferência",
  totalIncidents: "Incidentes Totais",
  verified: "Verificados",
  quarantined: "Em Quarentena",
  safeguardsActive: "Medidas Ativas",
  recentActivity: "Atividades Recentes",
  signalPatterns: "Padrões de Sinal",
  interferenceLogs: "Registros de Interferência",
  recommendations: "Recomendações",

  safeguardsTitle: "200+ Medidas de Segurança Defensivas",
  safeguardsSubtitle:
    "Medidas de segurança abrangentes mapeadas para a lei internacional de direitos humanos",
  privacySafeguards: "Privacidade e Minimização de Dados",
  integritySafeguards: "Integridade de Evidências e Anti-Interferência",
  nonAggressionSafeguards: "Não Agressão e Operação Legal",
  dueProcessSafeguards: "Devido Processo, Dignidade e Justiça",
  securitySafeguards: "Segurança Técnica e Confidencialidade",
  internationalLawSafeguards: "Estrutura Jurídica Internacional",

  legalTitle: "Estrutura Jurídica Internacional",
  legalSubtitle: "Conformidade abrangente com instrumentos internacionais de direitos humanos",
  complianceReport: "Relatório de Conformidade",
  legalInstruments: "Instrumentos Jurídicos",

  encryptionTitle: "Utilitários de Criptografia",
  encryptionSubtitle: "Criptografia do lado do cliente para dados sensíveis",
  encrypt: "Criptografar",
  decrypt: "Descriptografar",
  password: "Senha",
  encryptedData: "Dados Criptografados",
  decryptedText: "Texto Descriptografado",

  noticeSuccess: "Sucesso",
  noticeError: "Erro",
  noticeWarning: "Aviso",
  noticeInfo: "Informação",

  ndaNotice: "Aviso de NDA / Procedência / Licença Privada",
  privateLicense: "Licença Privada — confidencial, intransferível, sujeita a NDA",
  humanRightsLaw: "Princípios éticos e de privacidade da lei internacional de direitos humanos",

  severityLow: "Baixo",
  severityMedium: "Médio",
  severityHigh: "Alto",
  severityCritical: "Crítico",

  threatNone: "Nenhum",
  threatLow: "Baixo",
  threatMedium: "Médio",
  threatHigh: "Alto",
  threatCritical: "Crítico",
};

// Russian Translations
const RU_TRANSLATIONS: Translation = {
  appName: "NDA Реестр Защиты и Доказательств Многосигнальный",
  appDescription: "Локальный защитный реестр доказательств для технических наблюдений",
  copyright: "© Ervin Remus Radosavlevici. Все права защищены.",

  navRegistry: "Реестр Доказательств",
  navSentinel: "Панель Sentinel",
  navSafeguards: "Меры Защиты",
  navLegal: "Правовая База",
  navEncryption: "Шифрование",

  save: "Сохранить",
  delete: "Удалить",
  export: "Экспорт",
  import: "Импорт",
  clear: "Очистить",
  copy: "Копировать",
  refresh: "Обновить",
  scan: "Сканировать",

  evidenceTitle: "Запись Инцидента / Наблюдения",
  evidenceSubtitle: "Записывайте технические наблюдения и доказательства",
  observation: "Наблюдение",
  technicalReference: "Техническая Ссылка",
  classification: "Классификация",
  timestamp: "Временная Метка",
  categories: "Категории",
  noIncidents: "Инциденты не зафиксированы",

  sentinelTitle: "Панель Sentinel",
  sentinelSubtitle: "Автономный мониторинг целостности и обнаружение помех",
  healthScore: "Состояние Системы",
  threatLevel: "Уровень Угрозы",
  interferenceScore: "Оценка Помех",
  totalIncidents: "Всего Инцидентов",
  verified: "Подтверждено",
  quarantined: "На Карантине",
  safeguardsActive: "Активные Меры Защиты",
  recentActivity: "Недавняя Активность",
  signalPatterns: "Шаблоны Сигналов",
  interferenceLogs: "Журналы Помех",
  recommendations: "Рекомендации",

  safeguardsTitle: "200+ Защитных Мер",
  safeguardsSubtitle:
    "Комплексные меры защиты, соответствующие международному праву в области прав человека",
  privacySafeguards: "Конфиденциальность и Минимизация Данных",
  integritySafeguards: "Целостность Доказательств и Защита от Помех",
  nonAggressionSafeguards: "Ненападение и Законная Деятельность",
  dueProcessSafeguards: "Соблюдение Процедуры, Достоинство и Справедливость",
  securitySafeguards: "Техническая Безопасность и Конфиденциальность",
  internationalLawSafeguards: "Международная Правовая База",

  legalTitle: "Международная Правовая База",
  legalSubtitle: "Полное соблюдение международных инструментов в области прав человека",
  complianceReport: "Отчет о Соблюдении",
  legalInstruments: "Правовые Инструменты",

  encryptionTitle: "Средства Шифрования",
  encryptionSubtitle: "Клиентское шифрование для конфиденциальных данных",
  encrypt: "Зашифровать",
  decrypt: "Расшифровать",
  password: "Пароль",
  encryptedData: "Зашифрованные Данные",
  decryptedText: "Расшифрованный Текст",

  noticeSuccess: "Успех",
  noticeError: "Ошибка",
  noticeWarning: "Предупреждение",
  noticeInfo: "Информация",

  ndaNotice: "Уведомление NDA / Происхождение / Частная Лицензия",
  privateLicense: "Частная Лицензия — конфиденциально, не передаваемо, подлежит NDA",
  humanRightsLaw:
    "Этические принципы и принципы конфиденциальности международного права в области прав человека",

  severityLow: "Низкий",
  severityMedium: "Средний",
  severityHigh: "Высокий",
  severityCritical: "Критический",

  threatNone: "Нет",
  threatLow: "Низкий",
  threatMedium: "Средний",
  threatHigh: "Высокий",
  threatCritical: "Критический",
};

// Chinese Translations
const ZH_TRANSLATIONS: Translation = {
  appName: "NDA 多信号防护与证据注册表",
  appDescription: "本地优先、非干扰的技术观察防护证据注册表",
  copyright: "© Ervin Remus Radosavlevici。版权所有。",

  navRegistry: "证据注册表",
  navSentinel: "哨兵仪表板",
  navSafeguards: "防护措施",
  navLegal: "法律框架",
  navEncryption: "加密",

  save: "保存",
  delete: "删除",
  export: "导出",
  import: "导入",
  clear: "清除",
  copy: "复制",
  refresh: "刷新",
  scan: "扫描",

  evidenceTitle: "事件/观察记录",
  evidenceSubtitle: "记录技术观察和证据",
  observation: "观察",
  technicalReference: "技术参考",
  classification: "分类",
  timestamp: "时间戳",
  categories: "类别",
  noIncidents: "尚未记录任何事件",

  sentinelTitle: "哨兵仪表板",
  sentinelSubtitle: "自主完整性监控和干扰检测",
  healthScore: "系统健康度",
  threatLevel: "威胁级别",
  interferenceScore: "干扰评分",
  totalIncidents: "事件总数",
  verified: "已验证",
  quarantined: "已隔离",
  safeguardsActive: "活跃防护措施",
  recentActivity: "最近活动",
  signalPatterns: "信号模式",
  interferenceLogs: "干扰日志",
  recommendations: "建议",

  safeguardsTitle: "200+ 防护措施",
  safeguardsSubtitle: "符合国际人权法的全面防护措施",
  privacySafeguards: "隐私与数据最小化",
  integritySafeguards: "证据完整性与反干扰",
  nonAggressionSafeguards: "不侵犯与合法运营",
  dueProcessSafeguards: "正当程序、尊严与公平",
  securitySafeguards: "技术安全与保密性",
  internationalLawSafeguards: "国际法律框架",

  legalTitle: "国际法律框架",
  legalSubtitle: "全面符合国际人权文书",
  complianceReport: "合规报告",
  legalInstruments: "法律文书",

  encryptionTitle: "加密工具",
  encryptionSubtitle: "客户端加密敏感数据",
  encrypt: "加密",
  decrypt: "解密",
  password: "密码",
  encryptedData: "加密数据",
  decryptedText: "解密文本",

  noticeSuccess: "成功",
  noticeError: "错误",
  noticeWarning: "警告",
  noticeInfo: "信息",

  ndaNotice: "NDA/来源/私有许可通知",
  privateLicense: "私有许可 - 机密、不可转让、受NDA约束",
  humanRightsLaw: "国际人权法的伦理和隐私原则",

  severityLow: "低",
  severityMedium: "中",
  severityHigh: "高",
  severityCritical: "严重",

  threatNone: "无",
  threatLow: "低",
  threatMedium: "中",
  threatHigh: "高",
  threatCritical: "严重",
};

// Japanese Translations
const JA_TRANSLATIONS: Translation = {
  appName: "NDA マルチシグナル防衛・証拠レジストリ",
  appDescription: "ローカルファースト、ノンジャミングの技術観測防衛証拠レジストリ",
  copyright: "© Ervin Remus Radosavlevici. 全著作権所有.",

  navRegistry: "証拠レジストリ",
  navSentinel: "センチネルダッシュボード",
  navSafeguards: "防衛策",
  navLegal: "法的枠組み",
  navEncryption: "暗号化",

  save: "保存",
  delete: "削除",
  export: "エクスポート",
  import: "インポート",
  clear: "クリア",
  copy: "コピー",
  refresh: "リフレッシュ",
  scan: "スキャン",

  evidenceTitle: "インシデント / 観測記録",
  evidenceSubtitle: "技術的観測と証拠を記録",
  observation: "観測",
  technicalReference: "技術的参照",
  classification: "分類",
  timestamp: "タイムスタンプ",
  categories: "カテゴリー",
  noIncidents: "まだインシデントは記録されていません",

  sentinelTitle: "センチネルダッシュボード",
  sentinelSubtitle: "自律的な完全性モニタリングと干渉検出",
  healthScore: "システムの健全性",
  threatLevel: "脅威レベル",
  interferenceScore: "干渉スコア",
  totalIncidents: "総インシデント数",
  verified: "検証済み",
  quarantined: "隔離中",
  safeguardsActive: "アクティブな防衛策",
  recentActivity: "最近のアクティビティ",
  signalPatterns: "シグナルパターン",
  interferenceLogs: "干渉ログ",
  recommendations: "推奨事項",

  safeguardsTitle: "200+ の防衛策",
  safeguardsSubtitle: "国際人権法に対応した包括的な防衛策",
  privacySafeguards: "プライバシーとデータ最小化",
  integritySafeguards: "証拠の完全性と干渉防止",
  nonAggressionSafeguards: "不侵略と合法的な運用",
  dueProcessSafeguards: "適正手続、尊厳、公平性",
  securitySafeguards: "技術的セキュリティと機密性",
  internationalLawSafeguards: "国際的な法的枠組み",

  legalTitle: "国際的な法的枠組み",
  legalSubtitle: "国際人権文書の完全な遵守",
  complianceReport: "コンプライアンスレポート",
  legalInstruments: "法的文書",

  encryptionTitle: "暗号化ユーティリティ",
  encryptionSubtitle: "機密データのクライアントサイド暗号化",
  encrypt: "暗号化",
  decrypt: "復号化",
  password: "パスワード",
  encryptedData: "暗号化データ",
  decryptedText: "復号化テキスト",

  noticeSuccess: "成功",
  noticeError: "エラー",
  noticeWarning: "警告",
  noticeInfo: "情報",

  ndaNotice: "NDA/由来/プライベートライセンス通知",
  privateLicense: "プライベートライセンス - 機密、譲渡不可、NDAの対象",
  humanRightsLaw: "国際人権法の倫理とプライバシーの原則",

  severityLow: "低",
  severityMedium: "中",
  severityHigh: "高",
  severityCritical: "重大",

  threatNone: "なし",
  threatLow: "低",
  threatMedium: "中",
  threatHigh: "高",
  threatCritical: "重大",
};

// Arabic Translations
const AR_TRANSLATIONS: Translation = {
  appName: "سجل NDA للحماية متعددة الإشارات والدلائل",
  appDescription: "سجل دفاعي محلي أولوية لملاحظات فنية",
  copyright: "© Ervin Remus Radosavlevici. جميع الحقوق محفوظة.",

  navRegistry: "سجل الدلائل",
  navSentinel: "لوحة المراقبة",
  navSafeguards: "ضمانات الحماية",
  navLegal: "الإطار القانوني",
  navEncryption: "التشفير",

  save: "حفظ",
  delete: "حذف",
  export: "تصدير",
  import: "استيراد",
  clear: "مسح",
  copy: "نسخ",
  refresh: "تحديث",
  scan: "مسح",

  evidenceTitle: "سجل الحادثة / الملاحظة",
  evidenceSubtitle: "سجل الملاحظات الفنية والدلائل",
  observation: "ملاحظة",
  technicalReference: "مرجع فني",
  classification: "تصنيف",
  timestamp: "طابع زمني",
  categories: "فئات",
  noIncidents: "لم يتم تسجيل أي حوادث بعد",

  sentinelTitle: "لوحة المراقبة",
  sentinelSubtitle: "مراقبة ذاتية للنزاهة وكشف التداخلات",
  healthScore: "صحة النظام",
  threatLevel: "مستوى التهديد",
  interferenceScore: "درجة التداخل",
  totalIncidents: "إجمالي الحوادث",
  verified: "مؤكد",
  quarantined: "معزول",
  safeguardsActive: "ضمانات نشطة",
  recentActivity: "النشاط الأخير",
  signalPatterns: "أنماط الإشارة",
  interferenceLogs: "سجلات التداخل",
  recommendations: "توصيات",

  safeguardsTitle: "200+ ضمانات دفاعية",
  safeguardsSubtitle: "ضمانات شاملة مطابقة لقانون حقوق الإنسان الدولي",
  privacySafeguards: "الخصوصية وتقليل البيانات",
  integritySafeguards: "نزاهة الدلائل ومكافحة التداخل",
  nonAggressionSafeguards: "عدم الاعتداء والتشغيل القانوني",
  dueProcessSafeguards: "الإجراءات القانونية، الكرامة، الإنصاف",
  securitySafeguards: "الأمن الفني والسرية",
  internationalLawSafeguards: "الإطار القانوني الدولي",

  legalTitle: "الإطار القانوني الدولي",
  legalSubtitle: "الالتزام الكامل بصكوك حقوق الإنسان الدولية",
  complianceReport: "تقرير الامتثال",
  legalInstruments: "الصكوك القانونية",

  encryptionTitle: "أدوات التشفير",
  encryptionSubtitle: "التشفير من جانب العميل للبيانات الحساسة",
  encrypt: " تشفير",
  decrypt: "فك التشفير",
  password: "كلمة المرور",
  encryptedData: "البيانات المشفرة",
  decryptedText: "النص مفكوك التشفير",

  noticeSuccess: "نجاح",
  noticeError: "خطأ",
  noticeWarning: "تحذير",
  noticeInfo: "معلومات",

  ndaNotice: "إشعار NDA / الأصل / ترخيص خاص",
  privateLicense: "ترخيص خاص - سري، غير قابل للتحويل، خاضع لنداء",
  humanRightsLaw: "المبادئ الأخلاقية وخصوصية قانون حقوق الإنسان الدولي",

  severityLow: "منخفض",
  severityMedium: "متوسط",
  severityHigh: "مرتفع",
  severityCritical: "حرج",

  threatNone: "لا شيء",
  threatLow: "منخفض",
  threatMedium: "متوسط",
  threatHigh: "مرتفع",
  threatCritical: "حرج",
};

// Translation Dictionary
const TRANSLATIONS: Record<LanguageCode, Translation> = {
  en: EN_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  de: DE_TRANSLATIONS,
  it: IT_TRANSLATIONS,
  pt: PT_TRANSLATIONS,
  ru: RU_TRANSLATIONS,
  zh: ZH_TRANSLATIONS,
  ja: JA_TRANSLATIONS,
  ar: AR_TRANSLATIONS,
};

// Supported Languages
const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

// Get current language from localStorage or default to English
function getCurrentLanguage(): LanguageCode {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sentinel_language") as LanguageCode | null;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
  }
  return "en";
}

// Set current language
function setCurrentLanguage(lang: LanguageCode): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("sentinel_language", lang);
  }
}

// Get translation for current language
function t(key: keyof Translation): string {
  const lang = getCurrentLanguage();
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

// Get all translations for a language
function getTranslations(lang: LanguageCode = getCurrentLanguage()): Translation {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

// Get category label in current language
function getCategoryLabel(category: CategoryKey): string {
  const lang = getCurrentLanguage();
  const categoryTranslations: Record<LanguageCode, Record<CategoryKey, string>> = {
    en: CATEGORY_LABELS,
    es: {
      rf: "RF / Observación electromagnética",
      bluetooth: "Observación Bluetooth",
      infrared: "Observación infrarroja / óptica",
      vibration: "Observación de vibración / baja frecuencia",
      audio: "Observación de audio / voz",
      drone: "Posible observación de dron",
      mobile: "Observación de móvil / dispositivo",
      wifi: "Observación de Wi-Fi / red inalámbrica",
      gps: "Observación de GPS / seguimiento de ubicación",
      camera: "Observación de cámara / vigilancia óptica",
      sensor: "Observación de sensor / dispositivo IoT",
      network: "Observación de red / ciber",
      signal_jamming: "Detección de interferencia / bloqueo de señal",
      surveillance: "Observación de vigilancia / monitoreo",
      cyber: "Observación cibernética / seguridad digital",
    },
    fr: {
      rf: "RF / Observation électromagnétique",
      bluetooth: "Observation Bluetooth",
      infrared: "Observation infrarouge / optique",
      vibration: "Observation de vibration / basse fréquence",
      audio: "Observation audio / vocale",
      drone: "Observation possible de drone",
      mobile: "Observation mobile / appareil",
      wifi: "Observation Wi-Fi / réseau sans fil",
      gps: "Observation GPS / suivi de localisation",
      camera: "Observation caméra / surveillance optique",
      sensor: "Observation capteur / appareil IoT",
      network: "Observation réseau / cybersécurité",
      signal_jamming: "Détection de brouillage / interférence de signal",
      surveillance: "Observation de surveillance / monitoring",
      cyber: "Observation cybersécurité / sécurité numérique",
    },
    de: {
      rf: "RF / Elektromagnetische Beobachtung",
      bluetooth: "Bluetooth-Beobachtung",
      infrared: "Infrarot- / Optische Beobachtung",
      vibration: "Schwingungs- / Niedrigfrequenz-Beobachtung",
      audio: "Audio- / Sprachbeobachtung",
      drone: "Mögliche Drohnenbeobachtung",
      mobile: "Mobile Gerätebeobachtung",
      wifi: "Wi-Fi- / Drahtlosnetzwerk-Beobachtung",
      gps: "GPS- / Standortverfolgungs-Beobachtung",
      camera: "Kamera- / Optische Überwachungsbeobachtung",
      sensor: "Sensor- / IoT-Gerätebeobachtung",
      network: "Netzwerk- / Cyber-Beobachtung",
      signal_jamming: "Signalsperrung- / Störungserkennung",
      surveillance: "Überwachungs- / Monitoring-Beobachtung",
      cyber: "Cyber-Sicherheitsbeobachtung",
    },
    // Add more language category translations as needed
    it: CATEGORY_LABELS,
    pt: CATEGORY_LABELS,
    ru: CATEGORY_LABELS,
    zh: CATEGORY_LABELS,
    ja: CATEGORY_LABELS,
    ar: CATEGORY_LABELS,
  };

  return categoryTranslations[lang]?.[category] || CATEGORY_LABELS[category] || category;
}

// Get classification label in current language
function getClassificationLabel(classification: string): string {
  const lang = getCurrentLanguage();
  const classificationTranslations: Record<LanguageCode, Record<string, string>> = {
    en: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
    es: {
      "Unknown technical event": "Evento técnico desconocido",
      "Bluetooth-related observation": "Observación relacionada con Bluetooth",
      "RF-related observation": "Observación relacionada con RF",
      "Infrared/optical observation": "Observación infrarroja/óptica",
      "Vibration/low-frequency observation": "Observación de vibración/baja frecuencia",
      "Audio/voice observation": "Observación de audio/voz",
      "Possible drone observation": "Posible observación de dron",
      "Possible mobile/device event": "Posible evento de móvil/dispositivo",
      "Unwanted monitoring concern": "Preocupación por monitoreo no deseado",
      "Signal interference observation": "Observación de interferencia de señal",
      "Network anomaly observation": "Observación de anomalía de red",
      "Surveillance concern": "Preocupación por vigilancia",
      "Cyber security observation": "Observación de seguridad cibernética",
      "GPS/location observation": "Observación de GPS/ubicación",
      "Camera/optical observation": "Observación de cámara/óptica",
      "Sensor/IoT observation": "Observación de sensor/IoT",
      "Wi-Fi network observation": "Observación de red Wi-Fi",
      "Multi-signal correlation": "Correlación multi-señal",
    },
    fr: {
      "Unknown technical event": "Événement technique inconnu",
      "Bluetooth-related observation": "Observation liée au Bluetooth",
      "RF-related observation": "Observation liée à la RF",
      "Infrared/optical observation": "Observation infrarouge/optique",
      "Vibration/low-frequency observation": "Observation de vibration/basse fréquence",
      "Audio/voice observation": "Observation audio/voix",
      "Possible drone observation": "Observation possible de drone",
      "Possible mobile/device event": "Événement possible mobile/appareil",
      "Unwanted monitoring concern": "Préoccupation de surveillance non désirée",
      "Signal interference observation": "Observation d'interférence de signal",
      "Network anomaly observation": "Observation d'anomalie réseau",
      "Surveillance concern": "Préoccupation de surveillance",
      "Cyber security observation": "Observation de cybersécurité",
      "GPS/location observation": "Observation GPS/localisation",
      "Camera/optical observation": "Observation caméra/optique",
      "Sensor/IoT observation": "Observation capteur/IoT",
      "Wi-Fi network observation": "Observation réseau Wi-Fi",
      "Multi-signal correlation": "Corrélation multi-signaux",
    },
    de: {
      "Unknown technical event": "Unbekanntes technisches Ereignis",
      "Bluetooth-related observation": "Bluetooth-bezogene Beobachtung",
      "RF-related observation": "HF-bezogene Beobachtung",
      "Infrared/optical observation": "Infrarot-/optische Beobachtung",
      "Vibration/low-frequency observation": "Schwingungs-/Niedrigfrequenz-Beobachtung",
      "Audio/voice observation": "Audio-/Sprachbeobachtung",
      "Possible drone observation": "Mögliche Drohnenbeobachtung",
      "Possible mobile/device event": "Mögliches Mobilgeräte-Ereignis",
      "Unwanted monitoring concern": "Bedenken hinsichtlich unerwünschter Überwachung",
      "Signal interference observation": "Signalsinterferenz-Beobachtung",
      "Network anomaly observation": "Netzwerk-Anomalie-Beobachtung",
      "Surveillance concern": "Überwachungsbedenken",
      "Cyber security observation": "Cybersicherheits-Beobachtung",
      "GPS/location observation": "GPS-/Standortbeobachtung",
      "Camera/optical observation": "Kamera-/optische Beobachtung",
      "Sensor/IoT observation": "Sensor-/IoT-Beobachtung",
      "Wi-Fi network observation": "Wi-Fi-Netzwerk-Beobachtung",
      "Multi-signal correlation": "Mehrsignal-Korrelation",
    },
    // Add more language classification translations as needed
    it: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
    pt: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
    ru: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
    zh: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
    ja: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
    ar: Object.fromEntries(CLASSIFICATIONS.map((c) => [c, c])),
  };

  return classificationTranslations[lang]?.[classification] || classification;
}

export {
  TRANSLATIONS,
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  setCurrentLanguage,
  t,
  getTranslations,
  getCategoryLabel,
  getClassificationLabel,
  LanguageCode,
  Translation,
};
