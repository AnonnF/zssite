# ZSsite 网站结构（第一版）

> 描述第一版信息架构、路由约定与后续扩展点。实现页面前请先对齐本文档。

---

## 1. 站点地图

```
ZSsite
├── Home              /              个人网站入口页（功能入口卡片）
├── Projects          /projects      项目经历列表页
├── Project Detail    /projects/[slug]   单个项目详情（未来）
├── About             /about         关于（占位）
├── Contact           /contact       联系（占位）
└── Future Modules    能力地图、项目分析器、学习记录、CV 等
```

**核心原则：** 首页 **不直接展示** 所有项目卡片；项目列表仅在 `/projects` 展开。

第一版 **不做** Project Detail 完整页与 Project Analyzer，但数据模型与路由已预留。

---

## 2. 各页面职责

### 2.1 Home `/`

**目的：** 个人网站入口页，建立身份认知，通过 **功能入口卡片** 引导至各模块。

**区块（自上而下）：**

| 区块 | 内容 |
|------|------|
| Header | ZS / SITE 标识、导航、语言切换占位 |
| Hero | 姓名、站点定位、能力概述、英文标签 |
| Entry Cards | 功能入口面板（第一版仅「项目经历」→ `/projects`） |
| About Preview | 极简教育背景说明 |
| Footer | GitHub / LinkedIn / Email / CV 链接 |

**第一版不做：** 首页直接展示项目列表、Featured Projects 网格、Analyzer 入口。

**后续可增入口卡片：** 能力地图、项目分析器、学习记录、CV、联系等 — 在 `src/content/home.ts` 的 `cards` 数组追加即可。

---

### 2.2 Projects `/projects`

**目的：** 项目经历 **列表页**，展示所有工程项目档案。

**元素：**

- 页面标题 + `PROJECT ARCHIVE` 英文标签
- 简短说明 + 项目总数元数据
- 项目列表面板（细线边框、编号、年份、类型、技术栈、标签）

**数据来源：** `src/content/projects.ts`

**第一版项目：**

- ARMv8 Emulator & Assembler
- WACC Compiler
- BridgeTalk
- Resume-Job Matching Agent
- LangChain / RAG Practice

---

### 2.3 Project Detail `/projects/[slug]`

**目的：** 单个项目的完整档案 — 结构分析、技术决策、文件说明、能力总结。

**未来结构：**

```
[返回 Projects]     [REF-001]

# 项目标题
元数据面板：年份 | 类型 | 状态 | 仓库链接

── 概述 ──
── 结构分析 ──
── 技术决策 ──
── 能力总结 ──
```

**第一版：** 路由与数据字段已预留（`slug`、`analysis`），页面 **尚未实现**。

---

### 2.4 About `/about`

**目的：** 个人背景与能力详细说明。

**第一版：** 占位页，后续扩展能力矩阵、时间线等面板式内容。

---

### 2.5 Contact `/contact`

**目的：** 联系渠道与说明。

**第一版：** 占位页；Footer 已提供链接占位。

---

### 2.6 Future Modules（未来模块）

以下模块可通过首页 Entry Card 接入，各自独立路由：

| 模块 | 说明 | 状态 |
|------|------|------|
| 能力地图 | Capability Map，技能与领域可视化 | 未开始 |
| 项目分析器 | 对 repo 做结构 / 技术解读 | 未开始 |
| 学习记录 | 学习笔记与进度档案 | 未开始 |
| CV | 结构化简历页 | 未开始 |
| 联系 | 完整联系页（首页 Footer 已有占位） | 占位 |

---

## 3. 内容文件组织

| 文件 | 用途 |
|------|------|
| `src/content/site.ts` | 全站文案：导航、Hero、About Preview、Footer、Projects 页标题 |
| `src/content/home.ts` | 首页功能入口卡片数据 |
| `src/content/projects.ts` | 项目列表数据 |

组件 **不硬编码** 长段中文；后续 i18n 可将上述文件拆为 `zh` / `en` 字典。

---

## 4. 路由与 i18n 约定

### 4.1 第一版

- 默认语言：**中文（zh）**
- URL：**不带 locale 前缀**
- Header 预留 **中 / EN** 切换按钮（暂未启用）

### 4.2 后续

- 推荐 `/en/...` 与中文路由并存
- 系统 UI 与内容分文件维护

---

## 5. 数据模型

```ts
// src/content/home.ts
interface HomeEntryCard {
  id: string;
  title: string;
  label: string;        // 英文视觉标签
  description: string;
  href: string;
  meta: { key: string; value: string }[];
}

// src/content/projects.ts
interface Project {
  slug: string;
  title: string;
  year: number;
  type: string;
  status: 'ongoing' | 'completed' | 'archived';
  summary: string;
  stack: string[];
  tags: string[];
  ref?: string;
  analysis?: {
    status: 'none' | 'pending' | 'ready';
    source?: 'github' | 'gitlab' | 'local';
    repoUrl?: string;
  };
}
```

---

## 6. 组件结构

```
src/components/
├── layout/     Header, Footer
├── home/       Hero, EntryCards, EntryCard, AboutPreview
├── projects/   ProjectCard
└── ui/         SectionLabel, Divider, Tag
```

---

## 7. 第一版交付 Checklist

- [x] Home（入口页 + 功能卡片，不展示项目列表）
- [x] Projects 列表（静态数据）
- [ ] Project Detail
- [ ] About（完整内容）
- [ ] Contact（完整内容）
- [x] 响应式基础
- [x] 基础 SEO（layout metadata）
- [ ] — 以下不在第一版 —
- [ ] i18n 切换功能
- [ ] Project Analyzer
- [ ] 其他 Future Modules 首页入口

---

## 8. 与 AI / Cursor 协作说明

- 实现页面前：读 `docs/design/visual-style.md` 与本文件。
- 新增首页入口：编辑 `src/content/home.ts`，无需改页面结构。
- 新增项目：编辑 `src/content/projects.ts`。
- 新增路由：更新本文件对应章节。
