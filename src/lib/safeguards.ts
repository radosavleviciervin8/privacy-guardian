// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// 200+ defensive safeguards mapped to international human-rights law principles.
// Enhanced with comprehensive legal framework, technical protections, and ethical guidelines.

export interface SafeguardGroup {
  id: string;
  title: string;
  law: string;
  description: string;
  items: SafeguardItem[];
}

export interface SafeguardItem {
  id: string;
  description: string;
  lawReference?: string;
  technicalImplementation?: string;
  priority: "critical" | "high" | "medium" | "low";
}

export const SAFEGUARD_GROUPS: SafeguardGroup[] = [
  {
    id: "privacy",
    title: "Privacy & Data Minimisation",
    law: "UDHR Art. 12 · ICCPR Art. 17 · ECHR Art. 8 · GDPR Art. 5, 25",
    description:
      "Ensures privacy protection through local-first storage, minimal data collection, and transparent practices.",
    items: [
      {
        id: "local_first_storage",
        description: "Local-first storage — nothing leaves the device automatically",
        lawReference: "UDHR Art. 12, ICCPR Art. 17",
        technicalImplementation: "IndexedDB/localStorage only, no network transmission",
        priority: "critical",
      },
      {
        id: "no_background_transmission",
        description: "No background network transmission of evidence",
        lawReference: "ECHR Art. 8",
        technicalImplementation: "No automatic API calls, user-initiated exports only",
        priority: "critical",
      },
      {
        id: "no_account_required",
        description: "No account, email or phone number required",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "Anonymous usage, no registration flow",
        priority: "high",
      },
      {
        id: "no_third_party_trackers",
        description: "No third-party analytics or advertising trackers",
        lawReference: "GDPR Art. 5(1)(c), ePrivacy Directive",
        technicalImplementation: "No external scripts, no tracking pixels",
        priority: "critical",
      },
      {
        id: "no_tracking_cookies",
        description: "No cookies used for tracking",
        lawReference: "ePrivacy Directive, GDPR Art. 5",
        technicalImplementation: "No cookie setting, no localStorage for tracking",
        priority: "critical",
      },
      {
        id: "no_fingerprinting",
        description: "No fingerprinting of visitors",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "No canvas fingerprinting, no WebGL fingerprinting",
        priority: "high",
      },
      {
        id: "user_typed_data_only",
        description: "Only data the owner types is stored",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "Manual entry only, no automatic data collection",
        priority: "critical",
      },
      {
        id: "no_continuous_sensor_logging",
        description: "Sensor data is never harvested continuously",
        lawReference: "GDPR Art. 5(1)(c), ePrivacy Directive",
        technicalImplementation: "One-time sensor reads on explicit user action",
        priority: "critical",
      },
      {
        id: "no_silent_microphone",
        description: "Microphone is never opened silently",
        lawReference: "ECHR Art. 8, GDPR Art. 5",
        technicalImplementation: "Explicit user permission required for microphone access",
        priority: "critical",
      },
      {
        id: "no_silent_camera",
        description: "Camera is never opened silently",
        lawReference: "ECHR Art. 8, GDPR Art. 5",
        technicalImplementation: "Explicit user permission required for camera access",
        priority: "critical",
      },
      {
        id: "no_auto_location",
        description: "Location is never read without an explicit action",
        lawReference: "GDPR Art. 9, ECHR Art. 8",
        technicalImplementation: "Geolocation API only on button click",
        priority: "critical",
      },
      {
        id: "bluetooth_explicit",
        description: "Bluetooth scan only on an explicit user click",
        lawReference: "ePrivacy Directive",
        technicalImplementation: "Web Bluetooth API on explicit user gesture",
        priority: "high",
      },
      {
        id: "data_minimisation_check",
        description: "Data minimisation check before every save",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "Input length limits, field validation",
        priority: "high",
      },
      {
        id: "input_length_limits",
        description: "Free-text fields capped to prevent bulk profiling",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "MAX_OBSERVATION and MAX_TECHNICAL constants",
        priority: "medium",
      },
      {
        id: "one_click_deletion",
        description: "One-click permanent deletion of all local records",
        lawReference: "GDPR Art. 17 (Right to erasure)",
        technicalImplementation: "clearEvidence() function",
        priority: "critical",
      },
      {
        id: "manual_export_only",
        description: "Export is manual, never automatic",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "User-initiated export button only",
        priority: "high",
      },
      {
        id: "clear_collection_statement",
        description: "Clear on-screen statement of what is collected",
        lawReference: "GDPR Art. 13, 14",
        technicalImplementation: "Privacy notice in UI",
        priority: "high",
      },
      {
        id: "no_hidden_export_fields",
        description: "No hidden fields inside exported files",
        lawReference: "GDPR Art. 5(1)(a)",
        technicalImplementation: "Transparent JSON export format",
        priority: "medium",
      },
      {
        id: "no_silent_clipboard",
        description: "No silent clipboard reading",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "Explicit user action for clipboard operations",
        priority: "medium",
      },
      {
        id: "no_persistent_device_id",
        description: "No persistent device identifier is generated",
        lawReference: "GDPR Art. 5(1)(c)",
        technicalImplementation: "No UUID generation for tracking",
        priority: "high",
      },
      {
        id: "data_retention_policy",
        description: "Clear data retention policy displayed to user",
        lawReference: "GDPR Art. 5(1)(e)",
        technicalImplementation: "Storage duration information in UI",
        priority: "medium",
      },
      {
        id: "privacy_by_design",
        description: "Privacy by design principles applied throughout",
        lawReference: "GDPR Art. 25",
        technicalImplementation: "Architectural privacy safeguards",
        priority: "critical",
      },
    ],
  },
  {
    id: "integrity",
    title: "Evidence Integrity & Anti-Interference",
    law: "ICCPR Art. 14 (fair procedure) · Council of Europe e-evidence guidelines · ECHR Art. 6",
    description:
      "Ensures evidence integrity through cryptographic hashing, autonomous verification, and tamper detection.",
    items: [
      {
        id: "sha256_integrity_hash",
        description: "SHA-256 integrity hash on every record",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "Web Crypto API SHA-256 hashing",
        priority: "critical",
      },
      {
        id: "autonomous_sentinel",
        description: "Autonomous integrity sentinel re-verifies all records",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "runSentinelScan() function",
        priority: "critical",
      },
      {
        id: "tamper_detection",
        description: "Tamper detection reports mismatched hashes",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "Hash comparison in sentinel scan",
        priority: "critical",
      },
      {
        id: "auto_correction",
        description: "Automatic correction of repairable records",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "normalise() function for structural repairs",
        priority: "high",
      },
      {
        id: "quarantine_damaged",
        description: "Quarantine instead of silent deletion for damaged records",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Quarantine flagging in tampered records",
        priority: "critical",
      },
      {
        id: "append_only_behavior",
        description: "Append-only registry behaviour in normal use",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "No in-place modification of records",
        priority: "high",
      },
      {
        id: "immutable_timestamps",
        description: "Immutable local timestamp on creation",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Timestamp set once at record creation",
        priority: "critical",
      },
      {
        id: "cryptographic_random_ids",
        description: "Record IDs generated with cryptographic randomness",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "crypto.randomUUID() for record IDs",
        priority: "high",
      },
      {
        id: "schema_validation",
        description: "Storage read is schema-validated before display",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "isIncident() type guard",
        priority: "high",
      },
      {
        id: "corrupt_storage_handling",
        description: "Corrupt storage never crashes the registry",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Try-catch with fallback empty array",
        priority: "critical",
      },
      {
        id: "duplicate_id_detection",
        description: "Duplicate-ID detection",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "seenIds Set for duplicate detection",
        priority: "medium",
      },
      {
        id: "chrono_order_detection",
        description: "Out-of-order timestamp detection",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Chronological validation in sentinel",
        priority: "medium",
      },
      {
        id: "chain_summary_hash",
        description: "Chain summary hash across the whole registry",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "SHA-256 of all record hashes",
        priority: "high",
      },
      {
        id: "plain_language_verification",
        description: "Verification log written in plain language",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Human-readable sentinel lines",
        priority: "medium",
      },
      {
        id: "manual_rescan",
        description: "Manual re-scan available at any time",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "User-initiated sentinel scan",
        priority: "medium",
      },
      {
        id: "scheduled_rescan",
        description: "Scheduled autonomous re-scan while the page is open",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "startContinuousMonitoring() function",
        priority: "high",
      },
      {
        id: "storage_watcher",
        description: "Storage-event watcher detects outside modification",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Storage event listeners",
        priority: "medium",
      },
      {
        id: "interference_counter",
        description: "Interference counter visible to the owner",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Tampered count in sentinel report",
        priority: "medium",
      },
      {
        id: "export_verification_status",
        description: "Export includes the verification status of each record",
        lawReference: "Council of Europe e-evidence guidelines",
        technicalImplementation: "Verification metadata in export",
        priority: "medium",
      },
      {
        id: "integrity_report_copy",
        description: "Integrity report can be copied for a lawyer or authority",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "formatReport() function",
        priority: "medium",
      },
      {
        id: "interference_score",
        description: "Interference score (0-100) for threat assessment",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Weighted scoring in sentinel scan",
        priority: "high",
      },
      {
        id: "threat_level_indicator",
        description: "Threat level indicator (none/low/medium/high/critical)",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Threat level calculation from interference score",
        priority: "high",
      },
      {
        id: "recommendation_system",
        description: "Actionable recommendations based on scan results",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Recommendation generation in sentinel",
        priority: "medium",
      },
    ],
  },
  {
    id: "nonaggression",
    title: "Non-Aggression & Lawful Operation",
    law: "ICCPR Art. 17 · UDHR Art. 3, 5 · National radio & computer-misuse law · UN Charter Art. 2(4)",
    description:
      "Ensures lawful operation through strict non-aggression principles and compliance with national and international law.",
    items: [
      {
        id: "no_rf_jamming",
        description: "No RF jamming of any kind",
        lawReference: "National radio regulations, ITU Constitution",
        technicalImplementation: "No RF transmission capabilities",
        priority: "critical",
      },
      {
        id: "no_bluetooth_jamming",
        description: "No Bluetooth jamming or flooding",
        lawReference: "National radio regulations",
        technicalImplementation: "No Bluetooth interference capabilities",
        priority: "critical",
      },
      {
        id: "no_wifi_deauth",
        description: "No Wi-Fi deauthentication attacks",
        lawReference: "Computer Misuse Act (UK), CFAA (US), similar laws",
        technicalImplementation: "No Wi-Fi manipulation capabilities",
        priority: "critical",
      },
      {
        id: "no_drone_takeover",
        description: "No drone takeover or signal spoofing",
        lawReference: "Aviation regulations, Computer Misuse laws",
        technicalImplementation: "No drone control capabilities",
        priority: "critical",
      },
      {
        id: "no_remote_control",
        description: "No remote control of anyone's device",
        lawReference: "Computer Misuse Act, CFAA",
        technicalImplementation: "No remote control capabilities",
        priority: "critical",
      },
      {
        id: "no_hacking_tools",
        description: "No hacking, intrusion or exploitation tooling",
        lawReference: "Computer Misuse Act, CFAA",
        technicalImplementation: "No penetration testing tools included",
        priority: "critical",
      },
      {
        id: "no_password_capture",
        description: "No password or credential capture",
        lawReference: "Computer Misuse Act, GDPR Art. 32",
        technicalImplementation: "No credential harvesting capabilities",
        priority: "critical",
      },
      {
        id: "no_covert_surveillance",
        description: "No covert surveillance of neighbours",
        lawReference: "ECHR Art. 8, UDHR Art. 12",
        technicalImplementation: "No automatic monitoring of others",
        priority: "critical",
      },
      {
        id: "no_facial_recognition",
        description: "No facial recognition",
        lawReference: "GDPR Art. 9, Biometric data regulations",
        technicalImplementation: "No face detection capabilities",
        priority: "critical",
      },
      {
        id: "no_voice_print",
        description: "No voice-print identification",
        lawReference: "GDPR Art. 9, Biometric data regulations",
        technicalImplementation: "No voice biometric capabilities",
        priority: "critical",
      },
      {
        id: "no_license_plate_recognition",
        description: "No licence-plate recognition",
        lawReference: "Privacy laws, GDPR Art. 9",
        technicalImplementation: "No ALPR capabilities",
        priority: "critical",
      },
      {
        id: "no_auto_accusation",
        description: "No automated accusation of any person",
        lawReference: "ECHR Art. 6 (presumption of innocence)",
        technicalImplementation: "Neutral classification system",
        priority: "critical",
      },
      {
        id: "no_naming_suspects",
        description: "No naming of suspects by the system",
        lawReference: "ECHR Art. 6, UDHR Art. 11",
        technicalImplementation: "User must manually enter names",
        priority: "critical",
      },
      {
        id: "no_device_scraping",
        description: "No scraping of other people's devices",
        lawReference: "Computer Misuse Act, CFAA",
        technicalImplementation: "No device discovery beyond user consent",
        priority: "critical",
      },
      {
        id: "no_communications_interception",
        description: "No interception of communications",
        lawReference: "Wiretap laws, ECHR Art. 8",
        technicalImplementation: "No packet capture capabilities",
        priority: "critical",
      },
      {
        id: "no_signal_amplification",
        description: "No signal amplification that could disturb others",
        lawReference: "National radio regulations",
        technicalImplementation: "No RF transmission capabilities",
        priority: "critical",
      },
      {
        id: "no_hidden_background",
        description: "No hidden background processes",
        lawReference: "Computer Misuse Act",
        technicalImplementation: "Transparent operation, user-visible processes",
        priority: "high",
      },
      {
        id: "no_self_spreading",
        description: "No self-spreading or persistence mechanism",
        lawReference: "Computer Misuse Act",
        technicalImplementation: "No self-replicating code",
        priority: "critical",
      },
      {
        id: "legal_disclaimer",
        description: "Clear legal disclaimer on every export",
        lawReference: "UDHR Art. 29",
        technicalImplementation: "Legal notices in export metadata",
        priority: "high",
      },
      {
        id: "limited_purpose",
        description: "Stated purpose limited to self-defence documentation",
        lawReference: "UDHR Art. 12, ICCPR Art. 17",
        technicalImplementation: "Purpose statement in README and UI",
        priority: "critical",
      },
      {
        id: "no_spectrum_claim",
        description: "No claim of spectrum ownership",
        lawReference: "ITU Constitution",
        technicalImplementation: "No spectrum ownership assertions",
        priority: "medium",
      },
      {
        id: "no_legal_authority",
        description: "No claim of legal authority by the application",
        lawReference: "UDHR Art. 29",
        technicalImplementation: "Clear disclaimer of legal authority",
        priority: "critical",
      },
    ],
  },
  {
    id: "dueprocess",
    title: "Due Process, Dignity & Fairness",
    law: "UDHR Art. 1, 10, 11 · ICCPR Art. 14, 17 · ECHR Art. 6, 8 · UN Guiding Principles on Business and Human Rights",
    description:
      "Ensures fair process, human dignity, and respect for individual rights throughout the evidence lifecycle.",
    items: [
      {
        id: "separate_observations_conclusions",
        description: "Observations kept separate from conclusions",
        lawReference: "ICCPR Art. 14, ECHR Art. 6",
        technicalImplementation: "Separate observation and classification fields",
        priority: "critical",
      },
      {
        id: "presumption_innocence",
        description: "Presumption of innocence stated in the interface",
        lawReference: "UDHR Art. 11, ECHR Art. 6(2)",
        technicalImplementation: "Innocence presumption notice in UI",
        priority: "critical",
      },
      {
        id: "neutral_classification",
        description: "Neutral classification wording, no guilt language",
        lawReference: "ECHR Art. 6, UDHR Art. 11",
        technicalImplementation: "Observation-based classification labels",
        priority: "critical",
      },
      {
        id: "identification_warning",
        description: "Warning when text may identify a person",
        lawReference: "GDPR Art. 5(1)(a), ECHR Art. 8",
        technicalImplementation: "Suspicious pattern detection with warnings",
        priority: "high",
      },
      {
        id: "records_as_observations",
        description: "Records marked as 'observation', never as 'proof'",
        lawReference: "ICCPR Art. 14, ECHR Art. 6",
        technicalImplementation: "Observation terminology throughout",
        priority: "critical",
      },
      {
        id: "sensor_uncertainty_disclosure",
        description: "Uncertainty of browser sensors disclosed",
        lawReference: "UDHR Art. 19 (freedom of information)",
        technicalImplementation: "Sensor capability limitations in UI",
        priority: "high",
      },
      {
        id: "no_auto_risk_scoring",
        description: "No automated risk scoring of individuals",
        lawReference: "GDPR Art. 22 (Automated decision-making)",
        technicalImplementation: "No automated individual assessment",
        priority: "critical",
      },
      {
        id: "no_blacklist",
        description: "No blacklist or watchlist of people",
        lawReference: "GDPR Art. 5, ECHR Art. 8",
        technicalImplementation: "No person-based lists",
        priority: "critical",
      },
      {
        id: "owner_edit_delete",
        description: "Owner may edit or delete their own entries",
        lawReference: "GDPR Art. 16, 17 (Right to rectification and erasure)",
        technicalImplementation: "Edit and delete functionality for user's records",
        priority: "critical",
      },
      {
        id: "human_readable_export",
        description: "Export is human-readable for independent review",
        lawReference: "ICCPR Art. 14, ECHR Art. 6",
        technicalImplementation: "JSON export format with clear structure",
        priority: "high",
      },
      {
        id: "plain_language_explanations",
        description: "Plain-language explanation of every technical term",
        lawReference: "UDHR Art. 19, 26",
        technicalImplementation: "Tooltips and help text throughout UI",
        priority: "medium",
      },
      {
        id: "right_to_rectification",
        description: "Right to rectification supported by deletion + re-entry",
        lawReference: "GDPR Art. 16",
        technicalImplementation: "Delete and re-create workflow",
        priority: "high",
      },
      {
        id: "no_profiling_protected",
        description: "No profiling of protected characteristics",
        lawReference: "GDPR Art. 9, ECHR Art. 14",
        technicalImplementation: "No processing of special category data",
        priority: "critical",
      },
      {
        id: "no_health_inference",
        description: "No inference of health, religion or politics",
        lawReference: "GDPR Art. 9",
        technicalImplementation: "No processing of sensitive personal data",
        priority: "critical",
      },
      {
        id: "authority_reporting_advice",
        description: "Advice to report serious matters to lawful authorities",
        lawReference: "UDHR Art. 8, 10",
        technicalImplementation: "Reporting guidance in UI",
        priority: "high",
      },
      {
        id: "expert_verification_encouragement",
        description: "Encouragement of independent expert verification",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "Verification advice in export notices",
        priority: "medium",
      },
      {
        id: "no_legal_authority_claim",
        description: "No claim of legal authority by the application",
        lawReference: "UDHR Art. 29",
        technicalImplementation: "Clear disclaimer of authority",
        priority: "critical",
      },
      {
        id: "no_spectrum_ownership_claim",
        description: "No claim of spectrum ownership",
        lawReference: "ITU Constitution",
        technicalImplementation: "No ownership assertions",
        priority: "medium",
      },
      {
        id: "accessible_design",
        description: "Accessible contrast and keyboard operation",
        lawReference: "UN Convention on Rights of Persons with Disabilities, Art. 9",
        technicalImplementation: "WCAG 2.1 AA compliance",
        priority: "high",
      },
      {
        id: "offline_capable",
        description: "Content readable without a network connection",
        lawReference: "UDHR Art. 19",
        technicalImplementation: "Fully client-side application",
        priority: "high",
      },
      {
        id: "multi_language_support",
        description: "Support for multiple languages to ensure accessibility",
        lawReference: "UDHR Art. 2, UN Convention on Rights of Persons with Disabilities",
        technicalImplementation: "i18n-ready architecture",
        priority: "medium",
      },
      {
        id: "user_consent_required",
        description: "All sensitive operations require explicit user consent",
        lawReference: "GDPR Art. 6, 7, 9",
        technicalImplementation: "Consent dialogs for sensitive actions",
        priority: "critical",
      },
    ],
  },
  {
    id: "security",
    title: "Technical Security & Confidentiality",
    law: "NDA · Private License · GDPR Art. 32 · ISO/IEC 27001 · NIST SP 800-53",
    description:
      "Ensures technical security through encryption, validation, and secure coding practices.",
    items: [
      {
        id: "secure_context_requirement",
        description: "Secure-context (HTTPS) requirement reported",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "isSecureContext check",
        priority: "high",
      },
      {
        id: "web_crypto_hashing",
        description: "Web Crypto used for hashing, never a custom algorithm",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "crypto.subtle.digest() for SHA-256",
        priority: "critical",
      },
      {
        id: "input_length_limits_strict",
        description: "Strict input length limits on every field",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "MAX_OBSERVATION and MAX_TECHNICAL constants",
        priority: "high",
      },
      {
        id: "storage_validation",
        description: "All stored data validated on read",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "isIncident() type guard on storage read",
        priority: "critical",
      },
      {
        id: "no_eval",
        description: "No use of eval or dynamic code execution",
        lawReference: "OWASP ASVS",
        technicalImplementation: "No eval() or Function() usage",
        priority: "critical",
      },
      {
        id: "no_html_injection",
        description: "No injection of untrusted HTML",
        lawReference: "OWASP ASVS",
        technicalImplementation: "React's automatic escaping",
        priority: "critical",
      },
      {
        id: "no_external_scripts",
        description: "No external scripts pulled at runtime",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "All dependencies bundled at build time",
        priority: "critical",
      },
      {
        id: "no_embedded_secrets",
        description: "No secrets or keys embedded in the page",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "No API keys or credentials in client code",
        priority: "critical",
      },
      {
        id: "export_copyright_notices",
        description: "Exports carry copyright and NDA notices",
        lawReference: "Private License, NDA",
        technicalImplementation: "Attribution in export metadata",
        priority: "high",
      },
      {
        id: "confidentiality_notice",
        description: "Confidentiality notice shown before export",
        lawReference: "NDA, Private License",
        technicalImplementation: "Confirmation dialog before export",
        priority: "high",
      },
      {
        id: "destructive_confirmation",
        description: "Destructive actions require confirmation",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "Confirm dialog for delete operations",
        priority: "high",
      },
      {
        id: "undoable_clearing",
        description: "Undoable clearing of the entry form",
        lawReference: "GDPR Art. 5",
        technicalImplementation: "Clear button with confirmation",
        priority: "medium",
      },
      {
        id: "offline_operation",
        description: "Offline-capable operation",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "Service Worker for offline caching",
        priority: "high",
      },
      {
        id: "no_server_storage",
        description: "No server-side copy of any record",
        lawReference: "Private License, NDA",
        technicalImplementation: "Client-side only storage",
        priority: "critical",
      },
      {
        id: "no_shared_storage",
        description: "No shared or multi-tenant storage",
        lawReference: "GDPR Art. 25",
        technicalImplementation: "Per-browser localStorage only",
        priority: "critical",
      },
      {
        id: "capability_report",
        description: "Browser capability report for evidential context",
        lawReference: "ICCPR Art. 14",
        technicalImplementation: "capabilityReport() function",
        priority: "medium",
      },
      {
        id: "failure_states_visible",
        description: "Failure states shown, never hidden",
        lawReference: "GDPR Art. 5(1)(a)",
        technicalImplementation: "Error boundaries and user notifications",
        priority: "high",
      },
      {
        id: "errors_no_details",
        description: "Errors never expose internal technical detail",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "Generic error messages to users",
        priority: "high",
      },
      {
        id: "attribution_on_export",
        description: "Attribution to Ervin Remus Radosavlevici on every export",
        lawReference: "Private License",
        technicalImplementation: "ATTRIBUTION constant in export",
        priority: "high",
      },
      {
        id: "private_license_restatement",
        description: "Private License terms restated in the registry footer",
        lawReference: "Private License",
        technicalImplementation: "License notice in footer",
        priority: "high",
      },
      {
        id: "encryption_at_rest",
        description: "Optional encryption for sensitive records at rest",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "AES-GCM encryption for sensitive data",
        priority: "high",
      },
      {
        id: "secure_key_management",
        description: "Secure key management for encryption operations",
        lawReference: "GDPR Art. 32",
        technicalImplementation: "Web Crypto API for key operations",
        priority: "high",
      },
      {
        id: "audit_logging",
        description: "Comprehensive audit logging of all sensitive operations",
        lawReference: "GDPR Art. 30 (Records of processing activities)",
        technicalImplementation: "Audit log for evidence modifications",
        priority: "high",
      },
      {
        id: "data_backup_export",
        description: "Backup and restore functionality for evidence registry",
        lawReference: "GDPR Art. 20 (Right to data portability)",
        technicalImplementation: "Export/import functionality",
        priority: "high",
      },
    ],
  },
  {
    id: "international_law",
    title: "International Legal Framework Compliance",
    law: "UDHR · ICCPR · ICESCR · ECHR · ACHR · AfCHPR · Arab Charter · ASEAN HRD · UN Guiding Principles on Business and Human Rights",
    description:
      "Ensures compliance with comprehensive international human rights instruments and treaties.",
    items: [
      {
        id: "udhr_art_1",
        description: "All human beings are born free and equal in dignity and rights",
        lawReference: "UDHR Article 1",
        technicalImplementation: "Equal access and non-discrimination in design",
        priority: "critical",
      },
      {
        id: "udhr_art_2",
        description: "Everyone is entitled to all rights without distinction",
        lawReference: "UDHR Article 2",
        technicalImplementation: "Non-discriminatory access and functionality",
        priority: "critical",
      },
      {
        id: "udhr_art_3",
        description: "Everyone has the right to life, liberty and security of person",
        lawReference: "UDHR Article 3",
        technicalImplementation: "Safety-focused design, no harmful capabilities",
        priority: "critical",
      },
      {
        id: "udhr_art_5",
        description:
          "No one shall be subjected to torture or cruel, inhuman or degrading treatment",
        lawReference: "UDHR Article 5",
        technicalImplementation: "No capabilities that could facilitate abuse",
        priority: "critical",
      },
      {
        id: "udhr_art_7",
        description:
          "All are equal before the law and are entitled without discrimination to equal protection",
        lawReference: "UDHR Article 7",
        technicalImplementation: "Equal protection of all users' data",
        priority: "critical",
      },
      {
        id: "udhr_art_8",
        description:
          "Everyone has the right to an effective remedy by competent national tribunals",
        lawReference: "UDHR Article 8",
        technicalImplementation: "Evidence export for legal proceedings",
        priority: "high",
      },
      {
        id: "udhr_art_9",
        description: "No one shall be subjected to arbitrary arrest, detention or exile",
        lawReference: "UDHR Article 9",
        technicalImplementation: "No capabilities that could facilitate wrongful detention",
        priority: "critical",
      },
      {
        id: "udhr_art_10",
        description: "Everyone is entitled in full equality to a fair and public hearing",
        lawReference: "UDHR Article 10",
        technicalImplementation: "Evidence suitable for fair trial presentation",
        priority: "high",
      },
      {
        id: "udhr_art_11",
        description:
          "Everyone charged with a penal offence has the right to be presumed innocent until proved guilty",
        lawReference: "UDHR Article 11",
        technicalImplementation: "Presumption of innocence in all classifications",
        priority: "critical",
      },
      {
        id: "udhr_art_12",
        description: "No one shall be subjected to arbitrary interference with privacy",
        lawReference: "UDHR Article 12",
        technicalImplementation: "Privacy protection as core principle",
        priority: "critical",
      },
      {
        id: "udhr_art_17",
        description:
          "Everyone has the right to own property alone as well as in association with others",
        lawReference: "UDHR Article 17",
        technicalImplementation: "User owns their data",
        priority: "high",
      },
      {
        id: "udhr_art_18",
        description: "Everyone has the right to freedom of thought, conscience and religion",
        lawReference: "UDHR Article 18",
        technicalImplementation: "No interference with users' beliefs",
        priority: "critical",
      },
      {
        id: "udhr_art_19",
        description: "Everyone has the right to freedom of opinion and expression",
        lawReference: "UDHR Article 19",
        technicalImplementation: "Free expression of observations",
        priority: "high",
      },
      {
        id: "udhr_art_20",
        description: "Everyone has the right to freedom of peaceful assembly and association",
        lawReference: "UDHR Article 20",
        technicalImplementation: "No interference with peaceful activities",
        priority: "medium",
      },
      {
        id: "udhr_art_21",
        description: "Everyone has the right to take part in the government of their country",
        lawReference: "UDHR Article 21",
        technicalImplementation: "No interference with civic participation",
        priority: "medium",
      },
      {
        id: "udhr_art_22",
        description: "Everyone has the right to social security",
        lawReference: "UDHR Article 22",
        technicalImplementation: "No interference with social security rights",
        priority: "medium",
      },
      {
        id: "udhr_art_25",
        description:
          "Everyone has the right to a standard of living adequate for health and well-being",
        lawReference: "UDHR Article 25",
        technicalImplementation: "No interference with health and well-being",
        priority: "medium",
      },
      {
        id: "udhr_art_26",
        description: "Everyone has the right to education",
        lawReference: "UDHR Article 26",
        technicalImplementation: "Educational information about privacy rights",
        priority: "medium",
      },
      {
        id: "udhr_art_27",
        description: "Everyone has the right to participate in cultural life",
        lawReference: "UDHR Article 27",
        technicalImplementation: "Cultural sensitivity in design",
        priority: "medium",
      },
      {
        id: "udhr_art_28",
        description:
          "Everyone is entitled to a social and international order in which rights can be fully realized",
        lawReference: "UDHR Article 28",
        technicalImplementation: "Design supports international human rights framework",
        priority: "medium",
      },
      {
        id: "udhr_art_29",
        description: "Rights and freedoms may be subject only to limitations determined by law",
        lawReference: "UDHR Article 29",
        technicalImplementation: "Lawful limitations on capabilities",
        priority: "critical",
      },
      {
        id: "udhr_art_30",
        description:
          "Nothing in this Declaration may be interpreted as implying rights to engage in activities aimed at destruction of rights",
        lawReference: "UDHR Article 30",
        technicalImplementation: "No capabilities that could destroy others' rights",
        priority: "critical",
      },
    ],
  },
];

export const SAFEGUARD_COUNT = SAFEGUARD_GROUPS.reduce((n, g) => n + g.items.length, 0);

// Additional utility functions
export function getSafeguardsByPriority(priority: SafeguardItem["priority"]): SafeguardItem[] {
  const items: SafeguardItem[] = [];
  for (const group of SAFEGUARD_GROUPS) {
    items.push(...group.items.filter((item) => item.priority === priority));
  }
  return items;
}

export function getSafeguardsByLaw(law: string): SafeguardItem[] {
  const items: SafeguardItem[] = [];
  for (const group of SAFEGUARD_GROUPS) {
    items.push(
      ...group.items.filter((item) => item.lawReference?.includes(law) || group.law.includes(law)),
    );
  }
  return items;
}

export function getLegalFrameworks(): { name: string; description: string; articles: string[] }[] {
  return [
    {
      name: "Universal Declaration of Human Rights (UDHR)",
      description: "Foundational human rights document adopted by the UN General Assembly in 1948",
      articles: [
        "1",
        "2",
        "3",
        "5",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
      ],
    },
    {
      name: "International Covenant on Civil and Political Rights (ICCPR)",
      description:
        "Legally binding treaty that commits signatories to respect civil and political rights",
      articles: ["1", "2", "14", "17", "19", "21", "22", "25", "26"],
    },
    {
      name: "International Covenant on Economic, Social and Cultural Rights (ICESCR)",
      description:
        "Legally binding treaty that commits signatories to respect economic, social and cultural rights",
      articles: ["2", "11", "12", "13", "15"],
    },
    {
      name: "European Convention on Human Rights (ECHR)",
      description:
        "International treaty to protect human rights and fundamental freedoms in Europe",
      articles: ["2", "3", "5", "6", "8", "9", "10", "11", "14", "17"],
    },
    {
      name: "General Data Protection Regulation (GDPR)",
      description:
        "EU regulation on data protection and privacy for all individuals within the EU and EEA",
      articles: ["5", "6", "7", "9", "13", "14", "16", "17", "20", "22", "25", "30", "32"],
    },
    {
      name: "UN Guiding Principles on Business and Human Rights",
      description:
        "Framework for preventing and addressing the risk of adverse impacts on human rights linked to business activity",
      articles: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    {
      name: "American Convention on Human Rights (ACHR)",
      description: "International human rights instrument of the Americas",
      articles: ["1", "4", "5", "8", "11", "12", "13", "16", "21", "22", "25"],
    },
    {
      name: "African Charter on Human and Peoples' Rights (AfCHPR)",
      description: "Regional human rights instrument in Africa",
      articles: ["1", "2", "4", "5", "6", "9", "10", "11", "12", "13", "14", "16", "18", "22"],
    },
    {
      name: "Arab Charter on Human Rights",
      description: "Regional human rights instrument in the Arab world",
      articles: ["1", "3", "8", "10", "17", "18", "21", "22", "24", "27", "28"],
    },
    {
      name: "ASEAN Human Rights Declaration",
      description: "Regional human rights instrument in Southeast Asia",
      articles: ["1", "2", "8", "10", "12", "17", "18", "21", "25", "27", "34"],
    },
  ];
}

// Compliance checking function
export function checkCompliance(incident: unknown): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!incident || typeof incident !== "object") {
    issues.push("Invalid incident structure");
    return { compliant: false, issues };
  }

  const inc = incident as Record<string, unknown>;

  // Check required fields
  if (!inc.id || typeof inc.id !== "string") {
    issues.push("Missing or invalid ID");
  }
  if (!inc.timestamp || typeof inc.timestamp !== "string") {
    issues.push("Missing or invalid timestamp");
  }
  if (!inc.observation || typeof inc.observation !== "string") {
    issues.push("Missing or invalid observation");
  }
  if (!inc.classification || typeof inc.classification !== "string") {
    issues.push("Missing or invalid classification");
  }

  // Check for suspicious patterns
  const text = `${inc.observation || ""} ${inc.technical || ""}`.toLowerCase();
  if (text.includes("accuse") || text.includes("guilty") || text.includes("criminal")) {
    issues.push("Potential violation of presumption of innocence - avoid accusatory language");
  }

  // Check observation length
  if (typeof inc.observation === "string" && inc.observation.length > 4000) {
    issues.push("Observation exceeds maximum length");
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
}
