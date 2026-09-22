# Security Policy

**Project:** NDA Multi-Signal Defensive Protection & Evidence Registry
**Owner:** Ervin Remus Radosavlevici — Private License / NDA

## Threat model & design principles

| Principle          | Implementation                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Local-first        | All evidence lives in the user's browser `localStorage` only. No server, no account, no telemetry.                                      |
| Integrity          | Every record gets a SHA-256 hash (Web Crypto) computed over its canonical JSON at creation time. Tampering changes the hash.            |
| Minimal collection | Only what the user types, plus non-identifying browser metadata (user agent, online state, secure-context flag).                        |
| No covert sensors  | Microphone, camera, geolocation and motion are **never** activated. The capability report only checks whether APIs exist.               |
| Explicit consent   | Web Bluetooth is only invoked when the user presses the button and confirms the browser's own chooser dialog.                           |
| Input hardening    | Text fields are length-limited (4000 chars), trimmed, and rendered as React text (no HTML injection). Stored data is validated on load. |
| Safe defaults      | Dark `color-scheme`, secure-context detection, no third-party scripts other than fonts.                                                 |
| User control       | One-click export and one-click permanent deletion.                                                                                      |

## Out of scope / known limitations

- The browser cannot measure the RF spectrum, detect drones, or identify devices not voluntarily exposed. Records are **observations**, not proof.
- `localStorage` is not encrypted at rest. Anyone with access to the unlocked device/browser profile can read it. Use device encryption and a lock screen.
- Clearing browser site data deletes the registry. Export regularly.
- Hashes prove a record has not changed since creation; they do not prove _when_ it was created to a third party. For stronger provenance, hash the exported JSON with an independent timestamping service.

## Deployment hardening (recommended)

- Serve only over HTTPS (required for Web Bluetooth and Web Crypto).
- Add response headers: `Content-Security-Policy` (self + fonts.googleapis.com/fonts.gstatic.com), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- Do not add analytics or third-party scripts.

## Reporting a vulnerability

Do **not** open a public issue. Contact the Owner privately, include reproduction steps, and allow reasonable time for a fix. Reporters are bound by NDA.md regarding any Confidential Information encountered.

## Responsible use

Any use of this software to surveil, harass, accuse, jam or interfere with another person or their equipment is prohibited by LICENSE and ETHICS.md and may be unlawful.
