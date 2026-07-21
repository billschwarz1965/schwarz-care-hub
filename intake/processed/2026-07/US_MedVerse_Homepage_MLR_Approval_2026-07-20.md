# Intelligence Intake Record — MTG-009

## Metadata

| Field | Value |
|-------|-------|
| **Registry ID** | MTG-009 |
| **Title** | U.S. MedVerse Home Page — MLR approval & production path |
| **Category** | Meeting / Program milestone |
| **Date** | 2026-07-17 (MLR approval) · 2026-07-20 (dev updates in draft) |
| **Owner** | Christina Ha / Anna Majewska |
| **Source path** | Email thread: Christina Ha → Anna Majewska → Emil Mircea · Subject: U.S. MedVerse Home Page — MLR Approval Received |

## Summary

MLR approval received for U.S. MedVerse Home Page (**MAT-US-2606609**). Remaining work: update two Useful Tools links (Stability Calculator, Ingredient Search) in Magnolia draft; final review by Bill Schwarz and Christina Ha before production publish. Target production launch **week of Jul 21, 2026** pending review pass.

## Key decisions

- **MLR approved** — U.S. MedVerse Home Page cleared for production (Jul 17, 2026)
- **Final review gate** — Bill Schwarz + Christina Ha must approve before prod publish (Anna Majewska, Jul 20)
- **Link fixes required** — Useful Tools items must point to Sanofi Medical Information URLs (Peyman spec, Jul 20)
- **Operating model gap flagged** — homepage content/link updates currently require dev team (Emil Mircea), not agency content authors (Anna, Jul 17)

## Production blockers (resolved / in flight)

| Item | Detail | Status |
|------|--------|--------|
| MLR approval | MAT-US-2606609 | **Approved** Jul 17 |
| Stability Calculator link | `sanofimedicalinformation.com/s/stability-calculator?language=en_US&CN=US&HCP=Yes` | Draft updated Jul 20 — pending review |
| Ingredient Search link | `sanofimedicalinformation.com/s/ingredient-checker?language=en_US&CN=US&HCP=Yes` | Draft updated Jul 20 — pending review |
| Final stakeholder review | Bill + Christina | **Open** — preview shared Jul 20 |
| Production publish | Emil Mircea / dev team | Pending review approval |

## Preview access

Preview URL pattern: `medical.campus.sanofi/preview/login?secret=[redacted]&slug=/homepage-new&lang=en`  
Credentials: contact Emil Mircea — **not stored in OS** (security).

## Actions / follow-ups

| Action | Owner | Status |
|--------|-------|--------|
| Update Useful Tools links in Magnolia draft | Emil Mircea | Done (Jul 20) — in draft, not prod |
| Final review before production | Bill Schwarz, Christina Ha | Open |
| Publish homepage to production | Emil Mircea / dev | Pending review — target week of Jul 21 |
| Resolve operating model for homepage content updates | Bill, Christina, Anna | Open (transitional — Peyman bridging until GTMC/hub model) |

## OS CSV updates required?

- [x] Yes — US Homepage program status, deadlines, risks, stakeholders
- [x] Registered in `sources/registry.md`
