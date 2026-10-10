# ZSsite 网站结构（第一版）

> 描述第一版信息架构、路由约定与后续扩展点。实现页面前请先对齐本文档。

---

## 1. 站点地图

```
ZSsite
├── Home              /              个人网站入口页（功能入口卡片）
├── Projects          /projects      项目经历列表页
├── Project Detail    /projects/[slug]   单个项目详情
├── About             /about         关于与简历（Experience / Education / Skills / Publications / Contact）
├── Contact           /contact       联系
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

**当前项目（以 `src/content/projects.ts` 为准，按开始时间由近到远，不跟随任何求职版本 CV 的排序）：**

- Bridge Talk
- LangChain / LangGraph RAG Agent
- WACC Compiler
- Pintos
- ARMv8 Emulator & Assembler
- Drone Pathfinding × LLM
- PyTorch CIFAR-10
- Unity 2D RPG

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

**目的：** 个人背景与能力详细说明，网站承载完整、长期稳定的技术画像（不同于针对具体岗位压缩的 CV）。

**区块（自上而下）：** Experience（实习经历，不新增路由）→ Education → Coursework → Skills → Publications → Contact。

**内容原则：**

- 客观事实（日期、技术栈、经历、联系方式）以最新 CV 为准，并与 CV 保持一致。
- 不写入 CV 的 `Seeking` / `Target Role`，不照搬某一版 CV 的技能顺序或项目排序。
- 网站可以比 CV 更详细，但不得创造 CV 与项目中没有依据的经历、数据或技术栈。
- 简历下载入口目前保持 “Coming Soon”。

---

### 2.5 Contact `/contact`

**目的：** 联系渠道与说明。邮箱、GitHub、LinkedIn；不展示电话号码。

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
| `src/content/profile.ts` | 个人身份、定位（tagline / directions）、联系方式；Hero 与 About 的定位文案统一从这里派生 |
| `src/content/site.ts` | 全站文案：导航、Hero、About Preview、SEO、Footer、Projects 页标题 |
| `src/content/home.ts` | 首页功能入口卡片数据 |
| `src/content/resume.ts` | About 页数据：Experience、Education、Coursework、Skills |
| `src/content/publications.ts` | 论文发表 |
| `src/content/projects.ts` | 项目列表数据（中文源数据 + 结构字段） |
| `src/content/en/*.ts` | 英文文案：`site`、`home`、`profile`、`resume`、`projects`（按 slug 的可翻译字段表） |
| `src/content/index.ts` | 按 locale 取内容：`getSiteContent` / `getHomeContent` / `getProfile` / `getResumePage` / `getPortfolioProjects` / `getLocalizedProjectBySlug` |
| `src/lib/i18n/` | locale 配置、href 本地化、`LocaleProvider`、路由参数校验 |

组件 **不硬编码** 长段文案；中文文件为源，`src/content/en/` 覆盖可翻译字段，结构数据（`type`、`techStack`、`ref`、`period` 等）在两种语言间共用。

---

## 4. 路由与 i18n 约定

### 4.1 当前实现

- 默认语言：**中文（zh）**，URL **不带 locale 前缀**（如 `/projects`）。
- 英文：`/en/...`（如 `/en/projects/pintos`）。
- `src/middleware.ts`：`/en/*` 直通；无前缀路径内部 rewrite 到 `/zh/*`；`/zh/*` 308 重定向回无前缀 URL。
- 页面位于 `src/app/[locale]/`，`[locale]/layout.tsx` 为 root layout（设置 `<html lang>`、SEO metadata）；各页面通过 `alternates` 输出 canonical 与 hreflang。
- Header 的 **中 / EN** 为真实链接，保持在同一页面切换语言。
- 范围：Home、Projects、Project Detail 文案与元数据、About、Contact、Header、Footer、SEO 已双语。
- 未翻译：Analyzer / `projects/review` 及 AI draft 生成的代码导读仅中文；`/en/analyzer`、`/en/projects/review` 重定向到中文路径；英文项目详情页在存在代码导读时提示“仅中文”。

### 4.2 后续

- 如需翻译代码导读，需扩展 AI draft / analysis 数据模型以支持多语言字段。
- 新增页面时：放入 `src/app/[locale]/`，文案进 `src/content/` 与 `src/content/en/`，内部链接使用 `localizeHref`。

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
- [x] i18n 切换功能（zh / en，核心页面）
- [ ] Project Analyzer
- [ ] 其他 Future Modules 首页入口

---

## 8. 与 AI / Cursor 协作说明

- 实现页面前：读 `docs/design/visual-style.md` 与本文件。
- 新增首页入口：编辑 `src/content/home.ts`，无需改页面结构。
- 新增项目：编辑 `src/content/projects.ts`。
- 新增路由：更新本文件对应章节。
