import { AI_ANALYSIS_CONFIG } from "./analysis-config.js";
import { getStageChecklist } from "./select-candidates.js";
import type { CandidateEntry, ProjectContext } from "./types.js";
import type { ProjectTreeNode } from "../../src/data/projects/types.js";

function renderTree(nodes: ProjectTreeNode[], depth = 0): string {
  if (depth > AI_ANALYSIS_CONFIG.maxTreeDepth) return "";
  const lines: string[] = [];

  for (const node of nodes) {
    const indent = "  ".repeat(depth);
    const label = node.type === "folder" ? `${node.path || "(root)"}/` : node.path;
    lines.push(`${indent}- ${label}`);
    if (node.children?.length) {
      lines.push(renderTree(node.children, depth + 1));
    }
  }

  return lines.filter(Boolean).join("\n");
}

function formatManualReference(context: ProjectContext): string {
  const manual = context.manual;
  if (!manual) return "(no manual analysis)";

  const parts: string[] = [];
  parts.push(`Title: ${manual.title}`);
  parts.push(`Description: ${manual.description}`);

  if (manual.pipeline?.length) {
    parts.push("\nExisting pipeline (reference only, do not copy verbatim):");
    for (const node of manual.pipeline) {
      parts.push(`- ${node.id}: ${node.label} → ${node.path} (${node.role})`);
    }
  }

  if (manual.guidedTour?.length) {
    parts.push("\nExisting guided tour (reference only):");
    for (const step of manual.guidedTour) {
      parts.push(`- ${step.id}: ${step.label} → ${step.path} — ${step.title}`);
    }
  }

  const manualSummaries = Object.entries(manual.entries)
    .filter(([, e]) => e.summary || e.analysis)
    .slice(0, 10)
    .map(([path, e]) => `- ${path}: ${e.summary ?? "(structured analysis present)"}`);

  if (manualSummaries.length) {
    parts.push("\nManual entry summaries (reference only):");
    parts.push(...manualSummaries);
  }

  return parts.join("\n");
}

function formatTemplateReference(context: ProjectContext): string {
  const template = context.template;
  if (!template) return "(no template)";

  const parts: string[] = [
    `Template: ${template.templateId}`,
    `Description: ${template.description}`,
  ];

  const hints = Object.entries(template.folderRoleHints);
  if (hints.length) {
    parts.push("\nFolder role hints:");
    for (const [folder, role] of hints) {
      parts.push(`- ${folder}: ${role}`);
    }
  }

  return parts.join("\n");
}

function formatCandidateGroup(label: string, candidates: CandidateEntry[]): string {
  if (!candidates.length) return `${label}: (none)`;

  return candidates
    .map((c, index) => {
      const header = [
        `### ${label} ${index + 1}: ${c.path}`,
        `Score: ${c.score}`,
        `Reasons: ${c.reasons.join("; ") || "(none)"}`,
        `Type: ${c.type} (${c.category})`,
        c.language ? `Language: ${c.language}` : null,
        c.sizeBytes != null ? `Size: ${c.sizeBytes} bytes` : null,
        c.metadataOnly ? "Content: metadata only (code omitted)" : null,
        c.secretBlocked ? "Content: blocked by secret detection" : null,
        c.truncated ? "Content: truncated" : null,
      ]
        .filter(Boolean)
        .join("\n");

      const body = c.code
        ? `\n\`\`\`\n${c.code}\n\`\`\``
        : c.summary
          ? `\nSummary: ${c.summary}`
          : "";

      return `${header}${body}`;
    })
    .join("\n\n");
}

const TARGET_SCHEMA = `{
  "projectId": "<string>",
  "generatedAt": "<ISO8601>",
  "source": "ai-draft",
  "provider": "deepseek",
  "model": "<string>",
  "confidence": "draft",
  "projectAnalysis": {
    "overview": "<Chinese overview>",
    "suggestedPipeline": [{ "id": "", "label": "", "path": "", "language": "", "role": "" }],
    "suggestedGuidedTour": [{ "id": "", "label": "", "path": "", "title": "", "description": "" }],
    "technicalDecisions": [{ "title": "", "decision": "", "rationale": "", "impact": "" }],
    "skills": [{ "title": "", "description": "" }]
  },
  "entries": {
    "<path>": {
      "path": "<path>",
      "type": "file" | "folder",
      "summary": "<Chinese summary>",
      "analysis": {
        "purpose": "",
        "responsibilities": [],
        "input": "",
        "output": "",
        "role": "",
        "keyLogic": [],
        "relatedModules": [],
        "relatedPaths": [],
        "usedBy": [],
        "notes": []
      },
      "snippetSuggestions": [
        {
          "id": "parser-entry",
          "filePath": "src/main/wacc/parser.scala",
          "title": "Parser entry point",
          "startLine": 21,
          "endLine": 23,
          "reason": "<Chinese reason>",
          "confidence": "high",
          "annotations": [{ "line": 22, "note": "<Chinese note>" }]
        }
      ]
    }
  },
  "warnings": ["<uncertainty or gaps, e.g. missing CFG stage>"]
}`;

export function buildSystemPrompt(context: ProjectContext): string {
  const checklist = getStageChecklist(context).join(" / ");
  const templateId = context.manual?.templateId ?? "generic";

  return `You are an offline Project Analyzer for a personal engineering portfolio.
Output ONLY a valid JSON object. No markdown fences, no explanation text outside JSON.

Critical rules:
- Do NOT invent code. Do NOT output snippet code bodies.
- For snippets, output snippetSuggestions with filePath + startLine + endLine only.
- Snippet code will be extracted from real source by the offline script.
- If you are unsure about line numbers, omit the snippet or set confidence: "low".
- Explanatory fields use Chinese. JSON keys, paths, filenames, and language names stay in English.
- Do not invent files or modules not present in the provided context.
- When inferring from path only, note uncertainty in analysis.notes or warnings.
- Prefer concise structured analysis over verbose prose.

Project-level checks (template: ${templateId}):
- Verify suggestedPipeline covers main stages: ${checklist}
- Check for missing entry point (Main / index / app / server / cli)
- Check for missing IR / model / schema layer if applicable
- Check for missing tests representation
- Add gaps to warnings (e.g. "CFG stage not covered in pipeline")

Snippet rules:
- Max ${AI_ANALYSIS_CONFIG.maxSnippetsPerFile} snippetSuggestions per file entry.
- startLine/endLine must refer to lines visible in the provided source excerpt when possible.
- Do NOT include a "code" field in snippetSuggestions.`;
}

export function buildAnalysisPrompt(
  context: ProjectContext,
  candidates: CandidateEntry[]
): { system: string; user: string } {
  const fileCandidates = candidates.filter((c) => c.category === "file");
  const testCandidates = candidates.filter((c) => c.category === "test");
  const folderCandidates = candidates.filter((c) => c.category === "folder");

  const user = [
    `# Project Analysis Request`,
    ``,
    `Project ID: ${context.projectId}`,
    `Title: ${context.title}`,
    `Description: ${context.description}`,
    `Template: ${context.manual?.templateId ?? "generic"}`,
    ``,
    `## Template Context`,
    formatTemplateReference(context),
    ``,
    `## Manual Analysis (reference only — improve upon, do not plagiarize)`,
    formatManualReference(context),
    ``,
    `## File Tree (depth-limited)`,
    renderTree(context.tree) || "(empty tree)",
    ``,
    `## Selected Source Files (${fileCandidates.length})`,
    formatCandidateGroup("File", fileCandidates),
    ``,
    `## Selected Test Files (${testCandidates.length})`,
    formatCandidateGroup("Test", testCandidates),
    ``,
    `## Selected Folders (${folderCandidates.length}, metadata only)`,
    formatCandidateGroup("Folder", folderCandidates),
    ``,
    `## Target JSON Schema`,
    `Return a single JSON object matching this structure:`,
    TARGET_SCHEMA,
  ].join("\n");

  return { system: buildSystemPrompt(context), user };
}
