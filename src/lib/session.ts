// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// User session management with security features and abuse prevention.

import { sha256 } from "./evidence";
import { logAudit } from "./audit";

export interface UserSession {
  id: string;
  userId: string;
  createdAt: string;
  lastActivity: string;
  ipAddress?: string;
  userAgent: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  permissions: string[];
  roles: string[];
  isAuthenticated: boolean;
  authToken?: string;
  refreshToken?: string;
  tokenExpires?: string;
  failedAttempts: number;
  lastFailedAttempt?: string;
  isLocked: boolean;
  lockReason?: string;
  lockedAt?: string;
  metadata: Record<string, unknown>;
}

export interface SessionConfig {
  sessionTimeout: number; // minutes
  maxFailedAttempts: number;
  lockoutDuration: number; // minutes
  requireAuthentication: boolean;
  autoExtendSession: boolean;
  trackLocation: boolean;
  ipRateLimiting: boolean;
  maxSessionsPerUser: number;
}

export interface RateLimitEntry {
  identifier: string; // IP, userId, or fingerprint
  attempts: number;
  lastAttempt: string;
  lockedUntil?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type:
    "login" | "logout" | "failed_login" | "rate_limit" | "suspicious_activity" | "session_expired";
  sessionId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
}

const SESSION_STORAGE_KEY = "sentinel_sessions";
const RATE_LIMIT_STORAGE_KEY = "sentinel_rate_limits";
const SECURITY_EVENTS_STORAGE_KEY = "sentinel_security_events";
const ACTIVE_SESSION_KEY = "sentinel_active_session";

const DEFAULT_CONFIG: SessionConfig = {
  sessionTimeout: 60, // 60 minutes
  maxFailedAttempts: 5,
  lockoutDuration: 30, // 30 minutes
  requireAuthentication: false, // Local-first, no auth required by default
  autoExtendSession: true,
  trackLocation: false,
  ipRateLimiting: true,
  maxSessionsPerUser: 5,
};

// Session Manager
export class SessionManager {
  private config: SessionConfig;
  private sessions: Map<string, UserSession>;
  private rateLimits: Map<string, RateLimitEntry>;
  private securityEvents: SecurityEvent[];

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessions = new Map();
    this.rateLimits = new Map();
    this.securityEvents = [];
    this.loadFromStorage();
  }

  // Create a new session
  async createSession(
    userId: string = "anonymous",
    permissions: string[] = ["read", "write"],
    roles: string[] = ["user"],
    ipAddress?: string,
    location?: UserSession["location"],
  ): UserSession {
    // Check rate limiting
    const rateLimitKey = ipAddress || userId;
    if (this.config.ipRateLimiting && this.isRateLimited(rateLimitKey)) {
      throw new Error("Too many requests. Please try again later.");
    }

    // Generate session ID
    const sessionId = this.generateSessionId();

    // Generate tokens
    const authToken = await this.generateToken();
    const refreshToken = await this.generateToken();
    const tokenExpires = new Date(Date.now() + this.config.sessionTimeout * 60000).toISOString();

    const session: UserSession = {
      id: sessionId,
      userId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ipAddress,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      location,
      permissions,
      roles,
      isAuthenticated: true,
      authToken,
      refreshToken,
      tokenExpires,
      failedAttempts: 0,
      isLocked: false,
      metadata: {},
    };

    this.sessions.set(sessionId, session);
    this.saveToStorage();

    // Log security event
    this.logSecurityEvent({
      type: "login",
      sessionId,
      userId,
      ipAddress,
      userAgent: session.userAgent,
      severity: "low",
    });

    // Set as active session
    this.setActiveSession(sessionId);

    return session;
  }

  // Get session by ID
  getSession(sessionId: string): UserSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get session by token
  getSessionByToken(token: string): UserSession | undefined {
    for (const [id, session] of this.sessions) {
      if (session.authToken === token || session.refreshToken === token) {
        return session;
      }
    }
    return undefined;
  }

  // Get active session
  getActiveSession(): UserSession | undefined {
    try {
      if (typeof localStorage !== "undefined") {
        const sessionId = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (sessionId) {
          return this.sessions.get(sessionId);
        }
      }
    } catch {
      // localStorage not available
    }
    return undefined;
  }

  // Set active session
  setActiveSession(sessionId: string): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
      }
    } catch {
      // localStorage not available
    }
  }

  // Clear active session
  clearActiveSession(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch {
      // localStorage not available
    }
  }

  // Update session activity
  updateSessionActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date().toISOString();
      this.sessions.set(sessionId, session);
      this.saveToStorage();
    }
  }

  // Extend session
  async extendSession(sessionId: string): Promise<UserSession | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    session.tokenExpires = new Date(Date.now() + this.config.sessionTimeout * 60000).toISOString();
    session.lastActivity = new Date().toISOString();

    // Generate new tokens
    session.authToken = await this.generateToken();
    session.refreshToken = await this.generateToken();

    this.sessions.set(sessionId, session);
    this.saveToStorage();

    return session;
  }

  // Validate session
  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Check if locked
    if (session.isLocked) return false;

    // Check if token expired
    if (session.tokenExpires && new Date(session.tokenExpires) < new Date()) {
      this.logSecurityEvent({
        type: "session_expired",
        sessionId,
        userId: session.userId,
        severity: "medium",
        details: "Session token expired",
      });
      return false;
    }

    // Check if session timed out
    const lastActivity = new Date(session.lastActivity);
    const timeout = this.config.sessionTimeout * 60000; // Convert to milliseconds
    if (Date.now() - lastActivity.getTime() > timeout) {
      this.logSecurityEvent({
        type: "session_expired",
        sessionId,
        userId: session.userId,
        severity: "medium",
        details: "Session timed out due to inactivity",
      });
      return false;
    }

    // Auto-extend if configured
    if (this.config.autoExtendSession) {
      const timeSinceActivity = Date.now() - lastActivity.getTime();
      const timeUntilTimeout = timeout - timeSinceActivity;

      if (timeUntilTimeout < timeout * 0.2) {
        // Less than 20% of timeout remaining
        this.extendSession(sessionId);
      }
    }

    return true;
  }

  // Invalidate session (logout)
  invalidateSession(sessionId: string, reason?: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isLocked = true;
      session.lockReason = reason || "Logged out";
      session.lockedAt = new Date().toISOString();

      this.sessions.set(sessionId, session);
      this.saveToStorage();

      // Clear active session if this is the active one
      const activeSession = this.getActiveSession();
      if (activeSession?.id === sessionId) {
        this.clearActiveSession();
      }

      // Log security event
      this.logSecurityEvent({
        type: "logout",
        sessionId,
        userId: session.userId,
        ipAddress: session.ipAddress,
        severity: "low",
        details: reason,
      });
    }
  }

  // Invalidate all sessions for a user
  invalidateUserSessions(userId: string): void {
    for (const [sessionId, session] of this.sessions) {
      if (session.userId === userId) {
        this.invalidateSession(sessionId, "User logged out from another session");
      }
    }
  }

  // Record failed login attempt
  recordFailedAttempt(sessionIdOrUserId: string, ipAddress?: string): void {
    const session =
      this.sessions.get(sessionIdOrUserId) ||
      Array.from(this.sessions.values()).find((s) => s.userId === sessionIdOrUserId);

    if (session) {
      session.failedAttempts++;
      session.lastFailedAttempt = new Date().toISOString();

      if (session.failedAttempts >= this.config.maxFailedAttempts) {
        session.isLocked = true;
        session.lockReason = "Too many failed attempts";
        session.lockedAt = new Date().toISOString();

        this.logSecurityEvent({
          type: "failed_login",
          sessionId: session.id,
          userId: session.userId,
          ipAddress: ipAddress || session.ipAddress,
          severity: "high",
          details: `Account locked after ${session.failedAttempts} failed attempts`,
        });
      } else {
        this.logSecurityEvent({
          type: "failed_login",
          sessionId: session.id,
          userId: session.userId,
          ipAddress: ipAddress || session.ipAddress,
          severity: "medium",
          details: `Failed login attempt ${session.failedAttempts}/${this.config.maxFailedAttempts}`,
        });
      }

      this.sessions.set(session.id, session);
      this.saveToStorage();
    }

    // Also track rate limiting
    if (ipAddress) {
      this.recordRateLimitAttempt(ipAddress);
    }
  }

  // Reset failed attempts
  resetFailedAttempts(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.failedAttempts = 0;
      session.lastFailedAttempt = undefined;
      session.isLocked = false;
      session.lockReason = undefined;
      session.lockedAt = undefined;

      this.sessions.set(sessionId, session);
      this.saveToStorage();
    }
  }

  // Check if IP is rate limited
  isRateLimited(identifier: string): boolean {
    const entry = this.rateLimits.get(identifier);
    if (!entry) return false;

    if (entry.lockedUntil && new Date(entry.lockedUntil) > new Date()) {
      return true;
    }

    return false;
  }

  // Record rate limit attempt
  recordRateLimitAttempt(identifier: string): void {
    const now = new Date().toISOString();
    const entry = this.rateLimits.get(identifier) || {
      identifier,
      attempts: 0,
      lastAttempt: now,
    };

    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts >= this.config.maxFailedAttempts) {
      entry.lockedUntil = new Date(Date.now() + this.config.lockoutDuration * 60000).toISOString();
      entry.attempts = 0;

      this.logSecurityEvent({
        type: "rate_limit",
        identifier,
        severity: "high",
        details: `Rate limited for ${this.config.lockoutDuration} minutes`,
      });
    }

    this.rateLimits.set(identifier, entry);
    this.saveToStorage();
  }

  // Reset rate limit for identifier
  resetRateLimit(identifier: string): void {
    this.rateLimits.delete(identifier);
    this.saveToStorage();
  }

  // Get all sessions
  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  // Get sessions for a user
  getUserSessions(userId: string): UserSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.userId === userId);
  }

  // Get all security events
  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  // Get security events by type
  getSecurityEventsByType(type: SecurityEvent["type"]): SecurityEvent[] {
    return this.securityEvents.filter((e) => e.type === type);
  }

  // Get security events by severity
  getSecurityEventsBySeverity(severity: SecurityEvent["severity"]): SecurityEvent[] {
    return this.securityEvents.filter((e) => e.severity === severity);
  }

  // Get recent security events
  getRecentSecurityEvents(limit: number = 50): SecurityEvent[] {
    return [...this.securityEvents].reverse().slice(0, limit);
  }

  // Clear all sessions
  clearAllSessions(): void {
    this.sessions.clear();
    this.clearActiveSession();
    this.saveToStorage();

    this.logSecurityEvent({
      type: "logout",
      severity: "medium",
      details: "All sessions cleared",
    });
  }

  // Clear rate limits
  clearRateLimits(): void {
    this.rateLimits.clear();
    this.saveToStorage();
  }

  // Clear security events
  clearSecurityEvents(): void {
    this.securityEvents = [];
    this.saveToStorage();
  }

  // Get session statistics
  getStatistics(): {
    totalSessions: number;
    activeSessions: number;
    lockedSessions: number;
    rateLimitedIdentifiers: number;
    securityEvents: number;
    criticalEvents: number;
    highEvents: number;
  } {
    const allSessions = Array.from(this.sessions.values());
    const activeSessions = allSessions.filter((s) => !s.isLocked);
    const lockedSessions = allSessions.filter((s) => s.isLocked);
    const rateLimited = Array.from(this.rateLimits.values()).filter(
      (r) => r.lockedUntil && new Date(r.lockedUntil) > new Date(),
    );

    return {
      totalSessions: allSessions.length,
      activeSessions: activeSessions.length,
      lockedSessions: lockedSessions.length,
      rateLimitedIdentifiers: rateLimited.length,
      securityEvents: this.securityEvents.length,
      criticalEvents: this.securityEvents.filter((e) => e.severity === "critical").length,
      highEvents: this.securityEvents.filter((e) => e.severity === "high").length,
    };
  }

  // Get configuration
  getConfig(): SessionConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Private methods
  private generateSessionId(): string {
    return typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async generateToken(): Promise<string> {
    const random = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(random)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        const sessionsJson = localStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionsJson) {
          const sessions = JSON.parse(sessionsJson) as UserSession[];
          this.sessions = new Map(sessions.map((s) => [s.id, s]));
        }

        const rateLimitsJson = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
        if (rateLimitsJson) {
          const rateLimits = JSON.parse(rateLimitsJson) as RateLimitEntry[];
          this.rateLimits = new Map(rateLimits.map((r) => [r.identifier, r]));
        }

        const eventsJson = localStorage.getItem(SECURITY_EVENTS_STORAGE_KEY);
        if (eventsJson) {
          this.securityEvents = JSON.parse(eventsJson) as SecurityEvent[];
        }
      }
    } catch {
      this.sessions = new Map();
      this.rateLimits = new Map();
      this.securityEvents = [];
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(Array.from(this.sessions.values())),
        );
        localStorage.setItem(
          RATE_LIMIT_STORAGE_KEY,
          JSON.stringify(Array.from(this.rateLimits.values())),
        );
        localStorage.setItem(SECURITY_EVENTS_STORAGE_KEY, JSON.stringify(this.securityEvents));
      }
    } catch {
      // Storage full or other error
    }
  }

  private logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): void {
    const securityEvent: SecurityEvent = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    this.securityEvents.push(securityEvent);

    // Limit to 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents.shift();
    }

    this.saveToStorage();
    logAudit("SECURITY_EVENT", event.severity, JSON.stringify(event));
  }
}

// Singleton instance
export const sessionManager = new SessionManager();

// Session utilities
export function getCurrentSession(): UserSession | undefined {
  return sessionManager.getActiveSession();
}

export function createAnonymousSession(): UserSession {
  return sessionManager.createSession(
    "anonymous",
    ["read", "write", "export"],
    ["anonymous"],
    undefined,
    undefined,
  );
}

export function getSessionStatistics() {
  return sessionManager.getStatistics();
}

export function isRateLimited(identifier: string): boolean {
  return sessionManager.isRateLimited(identifier);
}
