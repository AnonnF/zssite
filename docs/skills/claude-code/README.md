# Claude Code Skills 参考目录

本目录用于存放从 **Claude Code skills** 复制来的 Markdown 参考文件，供 Cursor / AI 在做 UI、UX、前端设计时查阅。

## 用途

- 作为 `.cursor/rules/zssite-design.mdc` 的补充参考
- 不替代项目自有设计文档：`docs/design/visual-style.md` 优先级更高
- 文件均为 **只读参考**；ZSsite 的视觉约束以米白 + 黑、工业档案风为准

## 推荐放置的文件

将 Claude Code 中的 skill 导出或复制为平铺的 `.md` 文件，例如：

| 文件名 | 说明 |
|--------|------|
| `ui-ux-pro-max.md` | UI/UX 模式、布局与组件建议 |
| `awesome-design.md` | 设计灵感与最佳实践摘要 |
| `frontend-design.md` | 前端视觉与排版指南 |

当前仓库中可能已有子目录形式的 skill（如 `ui-ux-pro-max/`）；若存在，设计规则会一并参考。逐步整理为上述平铺 `.md` 可便于 AI 直接读取。

## 使用方式

1. 从 Claude Code 复制 skill 内容到本目录
2. 文件名使用 kebab-case，扩展名 `.md`
3. 若 skill 内容与 ZSsite 视觉指南冲突，**以 `docs/design/visual-style.md` 为准**

## 注意

- 勿在此目录放项目业务代码
- 勿提交大型二进制或版权不明素材
- 复制外部 skill 时保留出处说明（可选 frontmatter 或文首注释）
