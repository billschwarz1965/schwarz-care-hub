// Generates one specification document per MedVerse agent, plus an index.
//
//   node tools/generate-agent-docs.mjs        (from the poc/ directory)
//   npm run docs:agents
//
// agents-data.js is the single source of truth for agent identity, dependencies,
// and governance pairings; agent-enterprise-bindings.js supplies the production
// integration facts that cannot be derived from it. Everything in docs/agents/ is
// generated — edit the sources, not the output.

import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BUSINESS_AGENTS, COMPLIANCE_AGENTS, SYSTEM_AGENTS, AGENT_DEMOS } from '../src/agents-data.js';
import { ENTERPRISE_BINDINGS } from './agent-enterprise-bindings.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '../../docs/agents');

const gov = (id) => COMPLIANCE_AGENTS.find((c) => c.id === id);
const hub = (id) => SYSTEM_AGENTS.find((h) => h.id === id);
const business = (id) => BUSINESS_AGENTS.find((a) => a.id === id);

const LAYERS = {
  hub: { label: 'Intelligence Hub Layer', n: 3 },
  business: { label: 'Agent Orchestration Layer', n: 2 },
  governance: { label: 'Governance Layer', n: 4 }
};

function specBlock(agent, layer) {
  if (layer === 'governance') {
    return `{\n  id: ${JSON.stringify(agent.id)},\n  name: ${JSON.stringify(agent.name)},\n  icon: ${JSON.stringify(agent.icon)},\n  desc: ${JSON.stringify(agent.desc)}\n}`;
  }
  if (layer === 'hub') {
    return [
      '{',
      `  id: ${JSON.stringify(agent.id)},`,
      `  name: ${JSON.stringify(agent.name)},`,
      `  subtitle: ${JSON.stringify(agent.subtitle)},`,
      `  icon: ${JSON.stringify(agent.icon)},`,
      `  desc: ${JSON.stringify(agent.desc)},`,
      `  dataSources: ${JSON.stringify(agent.dataSources)},`,
      `  capabilities: ${JSON.stringify(agent.capabilities, null, 2).split('\n').join('\n  ')},`,
      `  consumers: ${JSON.stringify(agent.consumers)},`,
      `  compliancePartners: ${JSON.stringify(agent.compliancePartners)}`,
      '}'
    ].join('\n');
  }
  return [
    '{',
    `  id: ${JSON.stringify(agent.id)},`,
    `  name: ${JSON.stringify(agent.name)},`,
    `  icon: ${JSON.stringify(agent.icon)},`,
    `  desc: ${JSON.stringify(agent.desc)},`,
    `  users: ${JSON.stringify(agent.users)},`,
    `  compliancePartners: ${JSON.stringify(agent.compliancePartners)},`,
    `  hubDependency: ${JSON.stringify(agent.hubDependency || [])},`,
    `  status: ${JSON.stringify(agent.status)}`,
    '}'
  ].join('\n');
}

function referenceInteraction(id) {
  const demo = AGENT_DEMOS[id];
  if (!demo) {
    return `_No reference interaction is defined for this agent yet._ Add an \`AGENT_DEMOS["${id}"]\` entry in \`poc/src/agents-data.js\` to document one — the ecosystem UI will then offer a runnable demo for it.\n`;
  }
  const out = [`**Scenario:** ${demo.title}\n`];
  const input = demo.steps.find((s) => s.type === 'input');
  if (input) {
    out.push(`### Input\n`, `_${input.label}_\n`, `> ${input.content.replace(/\n/g, '\n> ')}\n`);
  }
  const processing = demo.steps.find((s) => s.type === 'processing');
  if (processing) {
    out.push(`### Processing steps\n`);
    processing.items.forEach((it, i) => out.push(`${i + 1}. ${it}`));
    out.push('');
  }
  const checks = demo.steps.find((s) => s.type === 'compliance');
  if (checks) {
    out.push(`### Governance review performed\n`, `| Governance agent | Result |`, `|---|---|`);
    checks.checks.forEach((c) => {
      const verdict = c.status === 'pass' ? 'Pass' : c.status === 'warn' ? 'Correction applied' : c.status === 'flag' ? 'Flagged' : 'Logged';
      out.push(`| ${c.agent} | ${verdict} |`);
    });
    out.push('');
  }
  const output = demo.steps.find((s) => s.type === 'output');
  if (output) {
    out.push(`### Output\n`);
    if (output.badge) out.push(`Badge: \`${output.badge}\`\n`);
    out.push(`${output.content}\n`);
  }
  return out.join('\n');
}

function enterpriseSection(id) {
  const b = ENTERPRISE_BINDINGS[id];
  if (!b) {
    return `> **TODO** — no enterprise binding recorded for this agent. Add an entry to\n> \`poc/tools/agent-enterprise-bindings.js\` covering systems of record, data\n> domains, scaling behaviour, and residency constraints.\n`;
  }
  return [
    `**Systems of record**\n`,
    ...b.systems.map((s) => `- ${s}`),
    ``,
    `**Data domains**\n`,
    ...b.dataDomains.map((s) => `- ${s}`),
    ``,
    `**Scaling behaviour**\n`,
    b.scaling,
    ``,
    `**Residency & access constraints**\n`,
    b.residency,
    ``
  ].join('\n');
}

function renderAgent(agent, layer) {
  const L = LAYERS[layer];
  const lines = [];
  lines.push(`# ${agent.name}`, '');
  lines.push(`> Generated from \`poc/src/agents-data.js\`. Do not edit by hand — run \`npm run docs:agents\`.`, '');
  lines.push(`| | |`, `|---|---|`);
  lines.push(`| **Agent id** | \`${agent.id}\` |`);
  lines.push(`| **Layer** | ${L.n} — ${L.label} |`);
  if (agent.status) lines.push(`| **Status** | ${agent.status} |`);
  if (agent.subtitle) lines.push(`| **Subtitle** | ${agent.subtitle} |`);
  lines.push(`| **Icon** | \`ti-${agent.icon}\` |`);
  lines.push('');

  lines.push(`## Purpose`, '', agent.desc, '');

  if (agent.users) {
    lines.push(`## Audiences served`, '', ...agent.users.map((u) => `- ${u}`), '');
  }

  if (agent.dataSources) {
    lines.push(`## Data sources`, '', `| Source | Volume |`, `|---|---|`);
    agent.dataSources.forEach((d) => lines.push(`| ${d.label} | ${d.value} |`));
    lines.push('');
  }

  if (agent.capabilities) {
    lines.push(`## Capabilities`, '', ...agent.capabilities.map((c) => `- ${c}`), '');
  }

  if (agent.hubDependency) {
    lines.push(`## Data dependencies`, '');
    if (agent.hubDependency.length === 0) {
      lines.push(`This agent depends on no intelligence hub — it is self-contained.`, '');
    } else {
      agent.hubDependency.forEach((hid) => {
        const h = hub(hid);
        if (!h) return;
        lines.push(`### ${h.name} (\`${hid}\`)`, '', h.desc, '');
        lines.push(...h.dataSources.map((d) => `- ${d.label}: **${d.value}**`), '');
      });
    }
  }

  if (agent.consumers) {
    lines.push(`## Agents that depend on this hub`, '');
    agent.consumers.forEach((cid) => {
      const a = business(cid);
      lines.push(`- ${a ? a.name : cid} (\`${cid}\`)`);
    });
    lines.push('');
  }

  if (agent.compliancePartners) {
    lines.push(`## Governance pairings`, '');
    lines.push(`Every output is reviewed by these governance agents before delivery.`, '');
    lines.push(`| Governance agent | What it checks |`, `|---|---|`);
    agent.compliancePartners.forEach((pid) => {
      const c = gov(pid);
      lines.push(`| ${c ? c.name : pid} (\`${pid}\`) | ${c ? c.desc : '—'} |`);
    });
    lines.push('');
  }

  if (layer === 'governance') {
    const supervised = BUSINESS_AGENTS.filter((a) => a.compliancePartners.includes(agent.id));
    lines.push(`## Agents supervised`, '');
    if (supervised.length === 0) lines.push(`_None currently paired._`, '');
    else {
      supervised.forEach((a) => lines.push(`- ${a.name} (\`${a.id}\`)`));
      lines.push('');
    }
  }

  lines.push(`## Reference interaction`, '', referenceInteraction(agent.id), '');
  lines.push(`## Enterprise integration`, '', enterpriseSection(agent.id), '');

  lines.push(`## Recreating this agent`, '');
  lines.push(`Add the specification below to \`${layer === 'business' ? 'BUSINESS_AGENTS' : layer === 'hub' ? 'SYSTEM_AGENTS' : 'COMPLIANCE_AGENTS'}\` in \`poc/src/agents-data.js\`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.`, '');
  lines.push('```js', specBlock(agent, layer), '```', '');
  if (layer === 'business') {
    lines.push(`Then, optionally, add an \`AGENT_DEMOS["${agent.id}"]\` entry with \`input\` → \`processing\` → \`draft\` → \`compliance\` → \`output\` steps to give the agent a runnable demo, and record its enterprise bindings in \`poc/tools/agent-enterprise-bindings.js\`. Finally re-run \`npm run docs:agents\`.`, '');
  }
  return lines.join('\n');
}

function renderIndex(groups) {
  const lines = [];
  lines.push(`# MedVerse Agent Specifications`, '');
  lines.push(`> Generated from \`poc/src/agents-data.js\` and \`poc/tools/agent-enterprise-bindings.js\`.`, `> Regenerate with \`npm run docs:agents\` from the \`poc/\` directory.`, '');
  lines.push(`One document per agent, covering purpose, audiences, data dependencies, governance pairings, a reference interaction, enterprise integration, and the specification needed to recreate it.`, '');

  lines.push(`## How MedVerse agents are defined`, '');
  lines.push(`An agent is a **declaration, not a codebase**. Each one is an object in \`agents-data.js\` naming its audiences, the intelligence hubs it reads, and the governance agents that supervise it. The application derives everything else — the ecosystem grid, architecture layer counts, persona filtering, hub dependency graphs, and governance mappings — from those declarations.`, '');
  lines.push(`That is what makes the ecosystem scalable: adding an agent is adding a specification. To add one:`, '');
  lines.push(`1. Add the specification object to the appropriate array in \`poc/src/agents-data.js\``);
  lines.push(`2. Point \`hubDependency\` at the hubs it reads, and \`compliancePartners\` at its governance agents`);
  lines.push(`3. Optionally add an \`AGENT_DEMOS\` entry to give it a runnable reference interaction`);
  lines.push(`4. Record its enterprise bindings in \`poc/tools/agent-enterprise-bindings.js\``);
  lines.push(`5. Run \`npm run docs:agents\` to regenerate this documentation`, '');
  lines.push(`All editions of the application — \`poc/\`, \`poc-external/\`, and \`poc-agents/\` — share \`poc/src\`, so a new agent appears in every edition at once.`, '');

  lines.push(`## Layer summary`, '');
  lines.push(`| Layer | Count |`, `|---|---|`);
  lines.push(`| 2 — Agent Orchestration (business agents) | ${BUSINESS_AGENTS.length} |`);
  lines.push(`| 3 — Intelligence Hubs | ${SYSTEM_AGENTS.length} |`);
  lines.push(`| 4 — Governance | ${COMPLIANCE_AGENTS.length} |`);
  lines.push(`| Governance pairings | ${BUSINESS_AGENTS.reduce((s, a) => s + a.compliancePartners.length, 0)} |`);
  lines.push(`| Connected data sources | ${SYSTEM_AGENTS.reduce((s, h) => s + h.dataSources.length, 0)} |`, '');

  for (const [layer, agents] of Object.entries(groups)) {
    lines.push(`## ${LAYERS[layer].n} — ${LAYERS[layer].label}`, '');
    lines.push(`| Agent | Purpose | Reference interaction | Enterprise binding |`, `|---|---|---|---|`);
    agents.forEach((a) => {
      const short = a.desc.split(/(?<=\.)\s/)[0];
      lines.push(`| [${a.name}](${a.id}.md) | ${short} | ${AGENT_DEMOS[a.id] ? 'yes' : '—'} | ${ENTERPRISE_BINDINGS[a.id] ? 'yes' : 'TODO'} |`);
    });
    lines.push('');
  }
  return lines.join('\n');
}

// --- run ---
mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.md')) unlinkSync(resolve(OUT_DIR, f));
}

const groups = {
  business: BUSINESS_AGENTS,
  hub: SYSTEM_AGENTS,
  governance: COMPLIANCE_AGENTS
};

let count = 0;
for (const [layer, agents] of Object.entries(groups)) {
  for (const agent of agents) {
    writeFileSync(resolve(OUT_DIR, `${agent.id}.md`), renderAgent(agent, layer) + '\n', 'utf8');
    count++;
  }
}
writeFileSync(resolve(OUT_DIR, 'README.md'), renderIndex(groups) + '\n', 'utf8');

const missing = [...BUSINESS_AGENTS, ...SYSTEM_AGENTS, ...COMPLIANCE_AGENTS].filter((a) => !ENTERPRISE_BINDINGS[a.id]).map((a) => a.id);
console.log(`Wrote ${count} agent specs + README.md to docs/agents/`);
console.log(`  business: ${BUSINESS_AGENTS.length}, hubs: ${SYSTEM_AGENTS.length}, governance: ${COMPLIANCE_AGENTS.length}`);
console.log(`  reference interactions: ${Object.keys(AGENT_DEMOS).length}`);
console.log(missing.length ? `  MISSING enterprise bindings: ${missing.join(', ')}` : `  enterprise bindings: complete`);
