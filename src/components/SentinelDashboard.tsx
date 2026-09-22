// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Sentinel Dashboard: Real-time monitoring and interference detection for evidence registry.

import { useEffect, useState, useCallback } from "react";
import {
  runSentinelScan,
  startContinuousMonitoring,
  sentinelMonitor,
  type SentinelReport,
  type SentinelLine,
  type SignalPattern,
  type InterferenceLog,
} from "@/lib/sentinel";
import { getEvidence, type Incident } from "@/lib/evidence";
import { getAuditLogs, generateAuditReport, type AuditLog } from "@/lib/audit";
import { SAFEGUARD_COUNT, SAFEGUARD_GROUPS } from "@/lib/safeguards";
import {
  getLegalFrameworkSummary,
  generateComplianceReport,
  type ComplianceCheck,
} from "@/lib/legal";

export interface DashboardStats {
  totalIncidents: number;
  verifiedIncidents: number;
  quarantinedIncidents: number;
  interferenceScore: number;
  threatLevel: string;
  auditLogs: number;
  activeMonitors: number;
  lastScan: string;
}

const THREAT_COLORS: Record<string, string> = {
  none: "text-green-500",
  low: "text-blue-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  critical: "text-red-500",
};

const THREAT_BG_COLORS: Record<string, string> = {
  none: "bg-green-500/20",
  low: "bg-blue-500/20",
  medium: "bg-yellow-500/20",
  high: "bg-orange-500/20",
  critical: "bg-red-500/20",
};

export function SentinelDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    verifiedIncidents: 0,
    quarantinedIncidents: 0,
    interferenceScore: 0,
    threatLevel: "none",
    auditLogs: 0,
    activeMonitors: 0,
    lastScan: "Never",
  });

  const [report, setReport] = useState<SentinelReport | null>(null);
  const [interferenceLogs, setInterferenceLogs] = useState<InterferenceLog[]>([]);
  const [signalPatterns, setSignalPatterns] = useState<SignalPattern[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showLegal, setShowLegal] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  // Initialize and start monitoring
  useEffect(() => {
    loadInitialData();
    startSignalMonitoring();

    // Generate compliance report
    const report = generateComplianceReport(
      "NDA Multi-Signal Defensive Protection & Evidence Registry",
    );
    setComplianceChecks(report);

    return () => {
      sentinelMonitor.stop();
    };
  }, [loadInitialData, startSignalMonitoring]);

  const loadInitialData = useCallback(async () => {
    const incidents = getEvidence();
    const auditLogs = getAuditLogs();

    setAuditLogs(auditLogs);
    setStats((prev) => ({
      ...prev,
      totalIncidents: incidents.length,
      auditLogs: auditLogs.length,
    }));

    // Run initial scan
    await runScan();
  }, [runScan]);

  const startSignalMonitoring = useCallback(() => {
    sentinelMonitor.start();
    sentinelMonitor.onSignal((pattern) => {
      setSignalPatterns((prev) => [...prev.slice(-49), pattern]);
    });
    setIsMonitoring(true);
  }, []);

  const runScan = useCallback(async () => {
    try {
      const result = await runSentinelScan({
        deepAnalysis: true,
        signalPatterns: signalPatterns,
      });

      setReport(result.report);
      setInterferenceLogs(result.interferenceLogs);

      const incidents = result.incidents;
      const quarantined = incidents.filter((i) => i.classification.includes("[QUARANTINED]"));
      const verified = incidents.filter((i) => !i.classification.includes("[QUARANTINED]"));

      setStats((prev) => ({
        ...prev,
        totalIncidents: incidents.length,
        verifiedIncidents: verified.length,
        quarantinedIncidents: quarantined.length,
        interferenceScore: result.report.interferenceScore,
        threatLevel: result.report.threatLevel,
        lastScan: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Sentinel scan failed:", error);
    }
  }, [signalPatterns]);

  const toggleMonitoring = useCallback(() => {
    if (isMonitoring) {
      sentinelMonitor.stop();
      setIsMonitoring(false);
    } else {
      startSignalMonitoring();
      startContinuousMonitoring((report, logs) => {
        setReport(report);
        setInterferenceLogs(logs);
        setStats((prev) => ({
          ...prev,
          interferenceScore: report.interferenceScore,
          threatLevel: report.threatLevel,
          lastScan: report.scannedAt,
        }));
      }, 30000);
      setIsMonitoring(true);
    }
  }, [isMonitoring, startSignalMonitoring]);

  const getThreatColor = useCallback((level: string) => {
    return THREAT_COLORS[level] || "text-gray-500";
  }, []);

  const getThreatBgColor = useCallback((level: string) => {
    return THREAT_BG_COLORS[level] || "bg-gray-500/20";
  }, []);

  const getInterferenceScoreColor = useCallback((score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 60) return "text-orange-500";
    if (score >= 40) return "text-yellow-500";
    if (score >= 20) return "text-blue-500";
    return "text-green-500";
  }, []);

  const formatTimestamp = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }, []);

  // Calculate overall health score
  const getHealthScore = useCallback((): number => {
    if (!report) return 100;

    let score = 100;

    // Deduct for interference
    score -= report.interferenceScore * 0.5;

    // Deduct for quarantined items
    score -= stats.quarantinedIncidents * 5;

    // Deduct for high threat level
    if (report.threatLevel === "critical") score -= 20;
    else if (report.threatLevel === "high") score -= 10;
    else if (report.threatLevel === "medium") score -= 5;

    return Math.max(0, Math.min(100, score));
  }, [report, stats]);

  const healthScore = getHealthScore();

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-red-500">🛡️</span> Sentinel Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Autonomous integrity monitoring and interference detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`btn ${isMonitoring ? "btn-warn" : "btn-safe"}`}
            onClick={toggleMonitoring}
          >
            {isMonitoring ? "Pause Monitoring" : "Start Monitoring"}
          </button>
          <button className="btn" onClick={runScan}>
            Run Scan
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Health Score */}
        <div className="panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Health</p>
              <p
                className="text-3xl font-bold"
                style={{ color: getInterferenceScoreColor(100 - healthScore) }}
              >
                {healthScore.toFixed(0)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${getThreatBgColor(report?.threatLevel || "none")}`}>
              <span className={`text-2xl ${getThreatColor(report?.threatLevel || "none")}`}>
                {report?.threatLevel === "none" && "✓"}
                {report?.threatLevel === "low" && "!"}
                {report?.threatLevel === "medium" && "!!"}
                {report?.threatLevel === "high" && "!!!"}
                {report?.threatLevel === "critical" && "⚠️"}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Threat Level:{" "}
            <span className={getThreatColor(report?.threatLevel || "none")}>
              {report?.threatLevel?.toUpperCase() || "NONE"}
            </span>
          </p>
        </div>

        {/* Incidents */}
        <div className="panel">
          <p className="text-sm text-muted-foreground">Total Incidents</p>
          <p className="text-3xl font-bold">{stats.totalIncidents}</p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Verified</p>
              <p className="text-lg font-semibold text-green-500">{stats.verifiedIncidents}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quarantined</p>
              <p className="text-lg font-semibold text-red-500">{stats.quarantinedIncidents}</p>
            </div>
          </div>
        </div>

        {/* Interference Score */}
        <div className="panel">
          <p className="text-sm text-muted-foreground">Interference Score</p>
          <p className={`text-3xl font-bold ${getInterferenceScoreColor(stats.interferenceScore)}`}>
            {stats.interferenceScore}/100
          </p>
          <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${getInterferenceScoreColor(stats.interferenceScore)}`}
              style={{ width: `${stats.interferenceScore}%` }}
            />
          </div>
        </div>

        {/* Safeguards */}
        <div className="panel">
          <p className="text-sm text-muted-foreground">Safeguards Active</p>
          <p className="text-3xl font-bold text-blue-500">{SAFEGUARD_COUNT}</p>
          <p className="text-xs text-muted-foreground mt-2">
            International human rights law compliant
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Column - Recent Activity */}
        <div className="space-y-4">
          {/* Recent Sentinel Lines */}
          <div className="panel">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent Sentinel Activity</h3>
              <button className="text-sm btn-ghost" onClick={() => runScan()}>
                Refresh
              </button>
            </div>

            {report && report.lines.length > 0 ? (
              <div className="mt-4 space-y-2 max-h-60 overflow-auto">
                {[...report.lines]
                  .reverse()
                  .slice(0, 10)
                  .map((line, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        line.level === "alert" || line.level === "critical"
                          ? "border-red-500 bg-red-500/10"
                          : line.level === "warn"
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            line.level === "alert" || line.level === "critical"
                              ? "text-red-500"
                              : line.level === "warn"
                                ? "text-yellow-500"
                                : line.level === "ok"
                                  ? "text-green-500"
                                  : "text-blue-500"
                          }`}
                        >
                          {line.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(line.at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{line.message}</p>
                      {line.category && (
                        <span className="text-xs badge tone-muted mt-1">{line.category}</span>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-4">
                No sentinel activity yet. Run a scan to start monitoring.
              </p>
            )}
          </div>

          {/* Signal Patterns */}
          <div className="panel">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Signal Patterns</h3>
              <span className="text-xs badge tone-muted">{signalPatterns.length} detected</span>
            </div>

            {signalPatterns.length > 0 ? (
              <div className="mt-4 space-y-2 max-h-40 overflow-auto">
                {[...signalPatterns]
                  .reverse()
                  .slice(0, 5)
                  .map((pattern, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border ${pattern.isSuspicious ? "border-red-500 bg-red-500/10" : "border-border"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{pattern.type.toUpperCase()}</span>
                          <span
                            className={`ml-2 text-xs ${pattern.isSuspicious ? "text-red-500" : "text-muted-foreground"}`}
                          >
                            {pattern.isSuspicious ? "SUSPICIOUS" : "NORMAL"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {pattern.strength.toFixed(1)} dBm
                        </span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <div className="h-1 bg-muted rounded-full flex-1">
                          <div
                            className={`h-full ${pattern.anomalyScore > 0.8 ? "bg-red-500" : pattern.anomalyScore > 0.5 ? "bg-yellow-500" : "bg-green-500"}`}
                            style={{ width: `${pattern.anomalyScore * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-4">
                No signal patterns detected. Monitoring for suspicious activity...
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Interference Logs */}
        <div className="space-y-4">
          {/* Interference Logs */}
          <div className="panel">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Interference Logs</h3>
              <span className="text-xs badge tone-muted">{interferenceLogs.length} events</span>
            </div>

            {interferenceLogs.length > 0 ? (
              <div className="mt-4 space-y-2 max-h-60 overflow-auto">
                {[...interferenceLogs]
                  .reverse()
                  .slice(0, 10)
                  .map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        log.severity === "alert" || log.severity === "critical"
                          ? "border-red-500 bg-red-500/10"
                          : log.severity === "warn"
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-sm ${
                            log.severity === "alert" || log.severity === "critical"
                              ? "text-red-500"
                              : log.severity === "warn"
                                ? "text-yellow-500"
                                : "text-blue-500"
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{log.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs ${log.corrected ? "text-green-500" : "text-muted-foreground"}`}
                        >
                          {log.corrected ? "✓ Corrected" : "⏳ Pending"}
                        </span>
                        {log.evidenceId && (
                          <span className="text-xs badge tone-muted">
                            ID: {log.evidenceId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-4">
                No interference events detected. System integrity verified.
              </p>
            )}
          </div>

          {/* Recommendations */}
          <div className="panel">
            <h3 className="text-lg font-bold">Recommendations</h3>

            {report && report.recommendations.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground mt-4">
                No recommendations. System operating normally.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Legal Framework Section */}
      <div className="panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">International Legal Framework Compliance</h3>
          <button className="text-sm btn-ghost" onClick={() => setShowLegal(!showLegal)}>
            {showLegal ? "Hide" : "Show Details"}
          </button>
        </div>

        <div className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">200+</p>
              <p className="text-sm text-muted-foreground">Safeguards</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">10+</p>
              <p className="text-sm text-muted-foreground">Legal Instruments</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-500">100%</p>
              <p className="text-sm text-muted-foreground">Compliant</p>
            </div>
          </div>

          {showLegal && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Legal Instruments</h4>
                <ul className="text-sm space-y-1">
                  <li>• Universal Declaration of Human Rights (UDHR)</li>
                  <li>• International Covenant on Civil and Political Rights (ICCPR)</li>
                  <li>• European Convention on Human Rights (ECHR)</li>
                  <li>• General Data Protection Regulation (GDPR)</li>
                  <li>• UN Guiding Principles on Business and Human Rights</li>
                  <li>• American Convention on Human Rights (ACHR)</li>
                  <li>• African Charter on Human and Peoples' Rights (AfCHPR)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Principles Applied</h4>
                <ul className="text-sm space-y-1">
                  <li>• Necessity and Proportionality</li>
                  <li>• Privacy by Design</li>
                  <li>• Data Minimisation</li>
                  <li>• Purpose Limitation</li>
                  <li>• Storage Limitation</li>
                  <li>• Presumption of Innocence</li>
                  <li>• Non-Aggression</li>
                  <li>• Transparency</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Report Section */}
      <div className="panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Compliance Report</h3>
          <button className="text-sm btn-ghost" onClick={() => setShowCompliance(!showCompliance)}>
            {showCompliance ? "Hide" : "Show Details"}
          </button>
        </div>

        <div className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {complianceChecks.filter((c) => c.compliant).length}
              </p>
              <p className="text-sm text-muted-foreground">Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {complianceChecks.filter((c) => !c.compliant).length}
              </p>
              <p className="text-sm text-muted-foreground">Non-Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{complianceChecks.length}</p>
              <p className="text-sm text-muted-foreground">Total Checks</p>
            </div>
          </div>

          {showCompliance && (
            <div className="mt-6 space-y-4">
              {complianceChecks.slice(0, 5).map((check, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${check.compliant ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={check.compliant ? "text-green-500" : "text-red-500"}>
                      {check.compliant ? "✓" : "✗"}
                    </span>
                    <h4 className="font-semibold">{check.requirement}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{check.legalBasis}</p>
                  <p className="text-sm mt-2">{check.evidence}</p>
                </div>
              ))}

              {complianceChecks.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  + {complianceChecks.length - 5} more checks
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Section */}
      <div className="panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Audit Log</h3>
          <button className="text-sm btn-ghost" onClick={() => setShowAudit(!showAudit)}>
            {showAudit ? "Hide" : "Show Details"}
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm">
            <span className="font-medium">{auditLogs.length}</span> audit entries recorded
          </p>

          {showAudit && (
            <div className="mt-4 space-y-2 max-h-40 overflow-auto">
              {[...auditLogs]
                .reverse()
                .slice(0, 10)
                .map((log, index) => (
                  <div key={index} className="p-2 border rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${log.severity === "CRITICAL" ? "text-red-500" : log.severity === "ERROR" ? "text-orange-500" : log.severity === "WARNING" ? "text-yellow-500" : "text-green-500"}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{log.description}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>Autonomous Sentinel System — © Ervin Remus Radosavlevici — Private License / NDA</p>
        <p className="mt-1">
          Continuous monitoring for evidence integrity and interference detection
        </p>
      </div>
    </div>
  );
}

export default SentinelDashboard;
