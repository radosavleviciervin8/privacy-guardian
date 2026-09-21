# 🛡 NDA Multi-Signal Defensive Protection & Evidence Registry

**Copyright © Ervin Remus Radosavlevici. All rights reserved.**
**Private License — Confidential — Subject to NDA.** See [LICENSE](./LICENSE), [NDA.md](./NDA.md), [SECURITY.md](./SECURITY.md) and [ETHICS.md](./ETHICS.md).

A browser-based, **local-first, non-jamming** defensive evidence and privacy registry for recording observable events involving Bluetooth, RF-related observations, infrared observations, vibration/audio observations, mobile devices, drones and other possible technical incidents.

## What it does

- Records **timestamped observations** with an event classification and optional technical reference.
- Computes a **SHA-256 integrity hash** for every record (Web Crypto).
- Stores everything **only in the user's own browser** (localStorage). Nothing is uploaded.
- Exports the full registry as **JSON** for independent review.
- Lets the user **delete** all local evidence at any time.
- Optionally reads a **Bluetooth device name** the user voluntarily exposes via Web Bluetooth.
- Reports which browser sensor APIs are available (capability report only — nothing is activated silently).

## What it does NOT do

- ❌ No jamming, interference, hacking or remote control of any equipment.
- ❌ No covert microphone or camera recording.
- ❌ No automatic identification or accusation of any person.
- ❌ No background data collection or transmission.

Records are labelled as *observations*, never as proof of wrongdoing.

## Legal & ethical framework

The registry follows the principles of **necessity, proportionality and transparency** drawn from international human-rights law:

- Universal Declaration of Human Rights, Art. 12 (privacy)
- International Covenant on Civil and Political Rights, Art. 17
- European Convention on Human Rights, Art. 8
- UN Guiding Principles on Business and Human Rights

Full detail in [ETHICS.md](./ETHICS.md).

## Provenance

| Field | Value |
|---|---|
| Author / copyright | Ervin Remus Radosavlevici |
| Project | NDA Multi-Signal Defensive Protection & Evidence Registry |
| License | Private License (see LICENSE) |
| Confidentiality | NDA (see NDA.md) |
| Storage key | `ervin_ndamultisignal_evidence_v1` |

## Running locally

```sh
bun install
bun run dev
```

Built with TanStack Start, React 19 and Tailwind CSS v4. The app is fully client-side; no backend or account is required.

## Security

Please read [SECURITY.md](./SECURITY.md) before deploying or reporting an issue. Do not publish vulnerability details publicly — contact the copyright holder privately.

---

*This README and the in-app notices record attribution and provenance. They do not by themselves create a copyright registration, an enforceable NDA against third parties who have not signed it, or any legal finding against another person.*
