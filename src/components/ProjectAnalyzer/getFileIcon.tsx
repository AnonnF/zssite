"use client";

import { Icon } from "@iconify/react";
import { addCollection } from "@iconify/react";
import { icons as materialIconThemeData } from "@iconify-json/material-icon-theme";
import type { IconifyIcon } from "@iconify/types";
import type { ProjectTreeNode } from "@/data/projects/types";

const ICON_PREFIX = "material-icon-theme";

const USED_ICON_NAMES = [
  "folder-base",
  "folder-base-open",
  "folder-src",
  "folder-src-open",
  "folder-test",
  "folder-test-open",
  "folder-components",
  "folder-components-open",
  "scala",
  "markdown",
  "typescript",
  "javascript",
  "json",
  "css",
  "react",
  "react-ts",
  "document",
] as const;

type MaterialIconName = (typeof USED_ICON_NAMES)[number];

const FALLBACK_ICON: MaterialIconName = "document";

const FOLDER_NAME_ICONS: Record<
  string,
  { closed: MaterialIconName; open: MaterialIconName }
> = {
  src: { closed: "folder-src", open: "folder-src-open" },
  tests: { closed: "folder-test", open: "folder-test-open" },
  test: { closed: "folder-test", open: "folder-test-open" },
  lexer: { closed: "folder-components", open: "folder-components-open" },
  parser: { closed: "folder-components", open: "folder-components-open" },
  semantic: { closed: "folder-components", open: "folder-components-open" },
  codegen: { closed: "folder-components", open: "folder-components-open" },
  ast: { closed: "folder-components", open: "folder-components-open" },
};

const EXTENSION_ICONS: Record<string, MaterialIconName> = {
  scala: "scala",
  md: "markdown",
  ts: "typescript",
  tsx: "react-ts",
  js: "javascript",
  jsx: "react",
  json: "json",
  css: "css",
};

let collectionRegistered = false;

function ensureIconCollection(): void {
  if (collectionRegistered) return;

  const allIcons = materialIconThemeData.icons;
  const partialIcons: Record<string, IconifyIcon> = {};

  for (const name of USED_ICON_NAMES) {
    const icon = allIcons[name];
    if (icon) partialIcons[name] = icon;
  }

  addCollection({
    prefix: ICON_PREFIX,
    icons: partialIcons,
    width: 32,
    height: 32,
  });

  collectionRegistered = true;
}

export interface FileIconOptions {
  node: Pick<ProjectTreeNode, "type" | "name" | "path">;
  expanded?: boolean;
}

function resolveFolderIconName(
  name: string,
  expanded: boolean
): MaterialIconName {
  const mapped = FOLDER_NAME_ICONS[name.toLowerCase()];
  if (mapped) {
    return expanded ? mapped.open : mapped.closed;
  }

  return expanded ? "folder-base-open" : "folder-base";
}

function resolveFileIconName(name: string): MaterialIconName {
  const lowerName = name.toLowerCase();

  if (lowerName === "readme.md" || lowerName.endsWith(".md")) {
    return "markdown";
  }

  const extension = lowerName.includes(".")
    ? (lowerName.split(".").pop() ?? "")
    : "";

  return EXTENSION_ICONS[extension] ?? FALLBACK_ICON;
}

export function resolveFileIconNameFromNode({
  node,
  expanded = false,
}: FileIconOptions): MaterialIconName {
  if (node.type === "folder") {
    return resolveFolderIconName(node.name, expanded);
  }

  return resolveFileIconName(node.name);
}

export interface FileTreeIconProps extends FileIconOptions {
  size?: number;
  className?: string;
}

export function FileTreeIcon({
  node,
  expanded = false,
  size = 18,
  className = "",
}: FileTreeIconProps) {
  ensureIconCollection();

  const iconName = resolveFileIconNameFromNode({ node, expanded });
  const iconId = `${ICON_PREFIX}:${iconName}`;

  return (
    <Icon
      icon={iconId}
      width={size}
      height={size}
      className={`shrink-0 opacity-95 ${className}`.trim()}
      aria-hidden
    />
  );
}
