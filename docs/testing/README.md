# MedVerse Manual Demo & Test Scripts

Hand-executable scripts for the HCP Concierge module. Nothing here is automated —
every step is something you click, type, or read on screen.

| Document | Purpose |
|---|---|
| [hcp-concierge-demo-scripts.md](hcp-concierge-demo-scripts.md) | Four presenter run-books for demoing the HCP Concierge live |
| [hcp-concierge-agent-tests.md](hcp-concierge-agent-tests.md) | 30 test scripts — 3 per agent across the module's 10 agents |

## Environment

```bash
npm --prefix poc run dev
```

Then open **http://localhost:5180/concierge.html**.

The HCP Concierge makes **no network calls** — all ten agents run on local data in
`poc/src/concierge-app.js` and `poc/src/rag-engine.js`. That means results are
deterministic and repeatable, and the module works offline. The only variable
timing is a simulated 0.8–2.5s "thinking" delay before each result renders.

Two exceptions to be aware of while testing:
- The floating chat assistant (bottom-right) is a separate widget from the
  Clinical Q&A agent, and answers from a different response set.
- Congress Intelligence writes a cross-module interaction signal to
  `localStorage`. Everything else is read-only.

## Resetting between runs

| What | How |
|---|---|
| Panel state, form values, chat history | Reload the page (F5) |
| Interaction signals in the sidebar | Reload the page — the sidebar counter is in-memory |
| Stored cross-module signals | Run `localStorage.removeItem('medverse_orion_signals')` in the browser console, then reload |
| Everything | `localStorage.clear()` in the console, then reload |

Return to the agent grid at any time with the **back arrow** in the header.

## Conventions used in the test scripts

- **Test ID** — `TC-<AGENT>-<NN>`, e.g. `TC-DNV-02`
- **Steps** are exact: the option text to pick and the literal string to type
- **Expected result** is what the current build actually does, verified by
  execution — not what it ought to do, except where a test is explicitly marked
  as covering a known defect
- Record **Actual** and **Pass/Fail** in the right-hand columns as you go

### Known open defects covered by these tests

Three tests are written against *intended* behaviour and will **fail** on the
current build. They are marked `KNOWN DEFECT` inline, and are listed here so a
failure is not mistaken for a regression:

| Test | Defect |
|---|---|
| `TC-CQA-03` | An off-topic question ("What is the capital of Portugal?") returns the **Atopic Dermatitis treatment algorithm** with citations instead of declining. `generateResponse()` in `rag-engine.js` falls through to its generic "top retrieved doc" branch because `searchKnowledgeBase()` still returns documents for an unrelated query, so the no-match branch is unreachable |
| `TC-DNV-02` | Disease Navigator's **Focus Area** dropdown is inert — `dn-focus` is never read in `concierge-app.js`, so all five focus values render byte-identical output |
| `TC-DNV-03` | Only **Atopic Dermatitis** and **Rheumatoid Arthritis** have disease profiles. The other five options in the dropdown return a "profile is being developed" stub |

Two further inconsistencies are noted inline in the tests but not given their own
test case, because they are content and UX rather than broken behaviour:

- **MSL Connect** has MSL coverage for only three of its seven regions (Northeast
  US, West US, EU — Germany); the other four fall back to "No exact region match".
  The Agent Ecosystem's MSL Connect demo narrates a Chicago-based Midwest MSL,
  which the Concierge data does not contain.
- **Validation is inconsistent:** eight of the nine forms validate with a browser
  `alert()`; Congress Intelligence alone validates inline.
