# Intake

New intelligence enters the Operating System through this folder.

## Workflow

```
intake/inbox/     ← drop raw files, exports, draft notes
       ↓
   Review & classify (strategy | meeting | financial | governance | research)
       ↓
sources/registry.md   ← register with ID, path, date, owner
       ↓
knowledge-base/       ← extract authoritative facts to OS CSV (if applicable)
       ↓
intake/processed/YYYY-MM/   ← archive processed originals
```

## inbox/

Drop anything new here:

- Workshop notes not yet indexed
- Cost plan updates
- Strategy decks (or `.url` pointers)
- Transcript exports
- Steering committee summaries

## processed/

After registration, move files to `processed/2026-07/` (year-month) for audit trail.

## Quick checklist

- [ ] Assigned registry ID (`STR-`, `MTG-`, `FIN-`, etc.)
- [ ] Entry added to `sources/registry.md`
- [ ] OS CSV updated if facts are authoritative
- [ ] Large files registered by path only (not committed if binary)
- [ ] Workstream actions updated in portal if operational

See [`../templates/intake-record.md`](../templates/intake-record.md) for a copy-paste template.
