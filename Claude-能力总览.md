# Claude Code 本机能力总览

> 扫描时间：2026-10-13
> 扫描范围：`~/.claude/`（用户级配置）、`~/.claude/plugins/`（插件缓存）、当前会话运行时暴露的 skills / agents / MCP 工具
> 数据来源：`~/.claude/settings.json`、`~/.claude/plugins/installed_plugins.json`、各插件 `plugin.json` 与 `hooks/hooks.json`、会话运行时清单

---

## 0. 场景速查：什么时候用什么

| 你的需求 | 推荐入口 | 类型 |
|---|---|---|
| 想清楚一个功能该不该做、怎么做 | `superpowers:brainstorming` | Skill |
| 需求明确，要拆成可执行步骤 | `superpowers:writing-plans` | Skill |
| 让多个子代理并行干活 | `superpowers:dispatching-parallel-agents` | Skill |
| 执行某个已写好的计划 | `superpowers:executing-plans` / `subagent-driven-development` | Skill |
| 遇到 Bug / 测试失败 | `superpowers:systematic-debugging` | Skill |
| 写代码前先写测试 | `superpowers:test-driven-development` | Skill |
| 宣称"做完了"之前要证据 | `superpowers:verification-before-completion` | Skill |
| 提交 / 推送 / 开 PR | `/commit`、`/commit-push-pr`、`/clean_gone` | 斜杠命令 |
| 刚写完代码要评审 | `/review-pr`、`/code-review` | 斜杠命令 |
| 让代码更简洁 | `/simplify` | 斜杠命令 |
| 安全审查当前改动 | `/security-review` | 斜杠命令 |
| 做 UI / 前端界面 | `frontend-design:frontend-design` | Skill |
| 做图表 / 数据可视化 | `dataviz` | Skill |
| 处理 Excel/Word/PPT/PDF | `document-skills:xlsx/docx/pptx/pdf` | Skill |
| 把网页打包成桌面应用 | `web-to-app` | Skill |
| 创作短视频文案 | `viral-video-copywriting` | Skill |
| 查"上次我们怎么解决的" | `claude-mem:mem-search` | Skill |
| 让 Claude 通读一个陌生仓库 | `claude-mem:learn-codebase` | Skill |
| 给项目建长期记忆 | `claude-mem:make-plan` + 自动 hooks | 插件 |
| 减少权限弹窗 | `/fewer-permission-prompts` | Skill |
| 定时 / 循环执行任务 | `/loop` | Skill |
| 改 Claude Code 配置 | `/update-config`、`/keybindings-help` | Skill |
| 写一个新 Skill | `skill-creator` | Skill |
| 写 Claude API / SDK 代码 | `claude-api` | Skill |
| 控制浏览器做验收 | Playwright MCP（自动可用） | MCP |
| 跨仓库查代码符号 | CodeGraph MCP（自动可用） | MCP |

---

## 1. 已启用插件（10 个）

来源：`~/.claude/settings.json` 的 `enabledPlugins`
安装清单：`~/.claude/plugins/installed_plugins.json`

| 插件 | 版本 | 提供什么 | 安装路径 |
|---|---|---|---|
| `superpowers` | 6.4.1 | 15 个工程流程类 Skill（TDD、调试、计划、评审） | `~/.claude/plugins/cache/claude-plugins-official/superpowers/6.4.1` |
| `claude-mem` | 13.4.0 | 跨会话记忆系统：15 个 Skill + 1 个 MCP 服务器 + 6 类 hooks | `~/.claude/plugins/cache/thedotmack/claude-mem/13.4.0` |
| `feature-dev` | 快照 `f359d43b4060` | `/feature-dev` 命令 + 3 个子代理 | `~/.claude/plugins/cache/claude-plugins-official/feature-dev/f359d43b4060` |
| `frontend-design` | 快照 `f359d43b4060` | 前端视觉设计 Skill | `~/.claude/plugins/cache/claude-plugins-official/frontend-design/f359d43b4060` |
| `security-guidance` | 2.0.13 | 自动安全审查 hooks（编辑时告警、提交/推送时后台复审） | `~/.claude/plugins/cache/claude-plugins-official/security-guidance/2.0.13` |
| `commit-commands` | 快照 `f359d43b4060` | `/commit`、`/commit-push-pr`、`/clean_gone` | `~/.claude/plugins/cache/claude-plugins-official/commit-commands/f359d43b4060` |
| `pr-review-toolkit` | 快照 `f359d43b4060` | `/review-pr` + 6 个专职评审子代理 | `~/.claude/plugins/cache/claude-plugins-official/pr-review-toolkit/f359d43b4060` |
| `pyright-lsp` | 1.0.0 | Python 语言服务器（代码智能） | `~/.claude/plugins/cache/claude-plugins-official/pyright-lsp/1.0.0` |
| `document-skills` | 快照 `dbd4588f9e10` | 文档处理 Skill：xlsx / docx / pptx / pdf | `~/.claude/plugins/cache/anthropic-agent-skills/document-skills/dbd4588f9e10` |
| `andrej-karpathy-skills` | 1.0.0 | `karpathy-guidelines`（减少 LLM 常见编码错误） | `~/.claude/plugins/cache/karpathy-skills/andrej-karpathy-skills/1.0.0` |

### 已配置的插件市场（marketplace）

来自 `settings.json` 的 `extraKnownMarketplaces`：

- `thedotmack` → github.com/thedotmack/claude-mem
- `claude-community` → github.com/anthropics/claude-plugins-community
- `wshobson-agents` → github.com/wshobson/agents
- `everything-claude-code` → github.com/affaan-m/everything-claude-code
- `anthropic-agent-skills` → github.com/anthropics/skills

> 官方市场 `claude-plugins-official` 内含 **600+ 可安装插件**（完整目录见 `~/.claude/plugins/marketplaces/claude-plugins-official/.claude-plugin/marketplace.json`，共 4428 行）。上面 10 个只是**当前已启用**的部分。

---

## 2. Skills 技能

### 2.1 用户自建 Skill（`~/.claude/skills/`）

| Skill | 用途 | 用法 |
|---|---|---|
| `skill-creator` | 创建/更新 Skill 的标准化指南（模板、目录规范、打包验证） | `/skill-creator` 或说"帮我做一个 skill" |
| `web-to-app` | 用 Rust + Tauri 把任意网页打包成 macOS/Windows/Linux 桌面应用 | `/web-to-app` 或说"把 XX 网页打包成桌面应用" |
| `viral-video-copywriting` | 对标抖音爆款视频，拆解方法论并创作原创文案 | `/viral-video-copywriting` 或说"帮我写短视频文案" |

### 2.2 插件自带 Skill

**superpowers（15 个，工程流程主干）**

| Skill | 用途 |
|---|---|
| `brainstorming` | **创意类工作前必用**：把想法变成设计与规格 |
| `writing-plans` | 把规格写成多步实施计划 |
| `executing-plans` | 在当前会话内亲自执行计划 |
| `subagent-driven-development` | 用子代理执行计划中的独立任务 |
| `dispatching-parallel-agents` | 2 个以上互不依赖的任务并行分派 |
| `test-driven-development` | 先写测试再写实现 |
| `systematic-debugging` | 遇到 Bug / 测试失败的根因排查流程 |
| `verification-before-completion` | 声称"完成"前必须跑验证命令 |
| `requesting-code-review` | 主动请求代码评审 |
| `receiving-code-review` | 收到评审意见后的处理规范（要求技术严谨，不盲从） |
| `finishing-a-development-branch` | 实现完成后决定如何合入 |
| `using-git-worktrees` | 需要隔离工作区时启用 git worktree |
| `writing-skills` | 编写/校验 Skill 本身 |
| `using-superpowers` | 开场元技能：如何发现和使用 Skill |
| `diagnosing-superpowers` | 复盘"这次为什么没用好" |

**claude-mem（15 个，记忆与检索）**

| Skill | 用途 |
|---|---|
| `mem-search` | 搜索跨会话记忆："上次怎么解决的？" |
| `learn-codebase` | 通读整个仓库灌入记忆（约 5 分钟） |
| `how-it-works` | 解释记忆系统怎么工作、数据存在哪 |
| `smart-explore` | 基于 tree-sitter 的结构化代码搜索（省 token） |
| `knowledge-agent` | 从历史观察构建可查询的知识库 |
| `make-plan` | 生成分阶段实施计划（含文档发现） |
| `do` | 用子代理执行计划 |
| `timeline-report` | 生成项目开发史叙事报告 |
| `weekly-digests` | 按周生成连载式项目史 |
| `pathfinder` | 画出功能流程图、找出重复关注点、提出统一架构 |
| `babysit` | 盯 PR / Review 直到可合并 |
| `oh-my-issues` | 把一堆 GitHub issue 按根因聚类成计划 |
| `design-is` | 按 Dieter Rams 十条原则审计设计 |
| `wowerpoint` | 把一份文档变成 kawaii 风幻灯片 PDF |
| `version-bump` | 插件的语义化版本发布全流程 |

**其他插件**

| Skill | 来源 | 用途 |
|---|---|---|
| `feature-dev:feature-dev` | feature-dev | 完整功能开发流程（探索→架构→审查） |
| `frontend-design:frontend-design` | frontend-design | 做有辨识度的界面视觉设计 |
| `document-skills:xlsx` | document-skills | Excel / CSV 读写计算 |
| `document-skills:docx` | document-skills | Word 文档创建与编辑 |
| `document-skills:pptx` | document-skills | PPT 演示文稿 |
| `document-skills:pdf` | document-skills | PDF 读取、合并、拆分、OCR |
| `andrej-karpathy-skills:karpathy-guidelines` | andrej-karpathy-skills | 编码行为准则，减少常见 LLM 错误 |

### 2.3 Claude Code 内置 Skill

| Skill | 用途 |
|---|---|
| `code-review` | 审查当前 diff / PR / 分支，查正确性 Bug |
| `simplify` | 只做质量优化：复用、简化、效率、抽象层级 |
| `security-review` | 对当前分支未提交改动做完整安全审查 |
| `dataviz` | **写任何图表代码前必读**：配色、坐标轴、仪表盘规范 |
| `init` | 生成 `CLAUDE.md` |
| `run` | 启动并驱动本项目的应用，确认改动真的生效 |
| `update-config` | 改 `settings.json`：权限、环境变量、hooks |
| `keybindings-help` | 自定义快捷键 |
| `fewer-permission-prompts` | 扫描历史，生成只读命令白名单减少弹窗 |
| `loop` | 按间隔重复执行某个 prompt 或斜杠命令 |
| `claude-api` | Claude API / SDK 参考（模型 ID、定价、缓存、工具调用） |
| `plugin-authoring` | 开发 Claude 自身的界面改造（面板、状态栏、hooks） |
| `workflow-authoring` | 编写 Workflow 工具脚本 |

**用法**：输入 `/` 会列出全部可调用命令；也可直接用自然语言描述需求，模型按 description 自动触发对应 Skill。

---

## 3. 子代理（Agents）

### 3.1 内置 / 通用

| 代理 | 用途 |
|---|---|
| `claude` | 通用兜底 |
| `general-purpose` | 复杂多步研究、跨文件搜索、批量任务 |
| `Explore` | 只读快速定位代码（找文件、找符号），不用于评审 |
| `Plan` | 设计实现方案 |
| `claude-code-guide` | 回答 Claude Code / Agent SDK / API 的使用问题 |
| `statusline-setup` | 配置状态栏 |

### 3.2 插件提供

| 代理 | 来源 | 用途 |
|---|---|---|
| `feature-dev:code-explorer` | feature-dev | 深度分析现有功能、追踪执行路径 |
| `feature-dev:code-architect` | feature-dev | 设计功能架构与实现蓝图 |
| `feature-dev:code-reviewer` | feature-dev | 评审代码 Bug / 安全 / 质量问题 |
| `pr-review-toolkit:code-reviewer` | pr-review-toolkit | 按项目规范评审代码 |
| `pr-review-toolkit:code-simplifier` | pr-review-toolkit | 简化代码、保持功能不变 |
| `pr-review-toolkit:comment-analyzer` | pr-review-toolkit | 审查注释准确性与可维护性 |
| `pr-review-toolkit:pr-test-analyzer` | pr-review-toolkit | 审查测试覆盖质量 |
| `pr-review-toolkit:silent-failure-hunter` | pr-review-toolkit | 猎捕静默失败、错误吞噬、不当兜底 |
| `pr-review-toolkit:type-design-analyzer` | pr-review-toolkit | 类型设计质量分析 |

### 3.3 自定义子代理（`~/.claude/agents/`，共 216 个）

文件名一律为英文 kebab-case，UI 中显示为中文名。按前缀分组：

| 前缀 | 数量 | 覆盖方向 |
|---|---|---|
| `marketing-` | 36 | 抖音/小红书/B站/微博/知乎/快手/视频号、SEO、增长、跨境电商、播客、私域 |
| `engineering-` | 35 | AI 工程师、后端架构师、前端开发者、SRE、数据库优化师、嵌入式固件/Linux 驱动、FPGA、Solidity、钉钉/飞书集成、微信小程序、最小变更工程师、代码库入职引导 |
| `specialized-` | 15 | 幕僚长、民事工程师、MCP 构建器、工作流架构师、Salesforce 架构师、模型 QA、定价优化、风险评估、韩语商务、法国咨询市场 |
| `sales-` | 9 | 赢单策略、Discovery 教练、销售教练、售前工程师、Pipeline 分析、Outbound |
| `testing-` | 9 | 无障碍审核、API 测试、性能基准、证据收集、现实检验者、工具评估 |
| `design-` | 8 | UI 设计师、UX 架构师、UX 研究员、品牌守护者、视觉叙事、图像提示词、包容性视觉 |
| `finance-` | 8 | 簿记与财务总监、财务分析、预测、FP&A、风控、投资研究、发票、税务 |
| `paid-media-` | 7 | PPC、搜索词分析、程序化采买、追踪归因、广告创意、社交广告、付费媒体审计 |
| `support-` | 7 | 客服响应、高管摘要、财务追踪、基建运维、法务合规检查、招聘运营、数据分析 |
| `academic-` | 6 | 人类学家、地理学家、历史学家、叙事学家、心理学家、学习规划师 |
| `legal-` | 5 | 合同审查、文书审查、客户接案、计费工时、制度文件撰写 |
| `product-` | 5 | 产品经理、Sprint 排序、趋势研究、反馈分析、行为助推引擎 |
| `project-management-` | 5 | 项目牧羊人、Jira 工作流管家、实验追踪、工作室制片/运营 |
| `supply-chain-` | 5 | 采购策略、库存预测、物流路线、供应商评估、服装工厂规划 |
| `unity-` / `unreal-` | 各 4 | Unity 架构/编辑器工具/多人/Shader；Unreal 多人/系统/技术美术/世界构建 |
| `godot-` / `roblox-` / `xr-` | 各 3 | 引擎脚本、多人、Shader；UGC、体验设计；座舱交互、沉浸式、界面架构 |
| `hr-` | 3 | 招聘、入职、绩效管理 |
| `game-*` / 其他单件 | ~40 | 音效工程师、关卡设计、叙事设计、区块链审计、合规审计、合规审计师、macOS Metal、visionOS、ZK 管家、终端集成、LSP 索引等 |

**用法**

- 输入 `@` 唤起子代理选择器
- 或直接说"用 **最小变更工程师** 来做这个改动"
- 或指定英文文件名："用 `engineering-minimal-change-engineer`"

> 完整清单：`ls -1 ~/.claude/agents/`

---

## 4. MCP 服务器（4 个）

MCP 工具由模型自动调用，用户一般无需手动操作；用 `/mcp` 可查看和管理连接状态。

### 4.1 `codegraph` — 代码知识图谱

SQLite 索引，亚毫秒读取，写文件约 1 秒后同步。

| 工具 | 用途 |
|---|---|
| `codegraph_explore` | **首选**：一句话或一组符号名，返回相关符号的原文+调用路径 |
| `codegraph_search` | 按名字快速定位符号 |
| `codegraph_node` | 取单个符号完整定义（含重载） |
| `codegraph_callers` / `codegraph_callees` | 谁调我 / 我调谁 |
| `codegraph_impact` | 改这个符号会波及谁（改前必查） |
| `codegraph_files` | 索引内的文件树 |
| `codegraph_status` | 索引健康度 |

> 注意：需在**已建 `.codegraph/` 索引的项目**里使用，当前目录 `skillWeb` 未建索引，故本次调用报错。

### 4.2 `memory` — 知识图谱记忆

| 工具 | 用途 |
|---|---|
| `create_entities` / `create_relations` | 建实体与关系 |
| `add_observations` | 给实体加观察 |
| `search_nodes` / `open_nodes` / `read_graph` | 查询 |
| `delete_entities` / `delete_relations` / `delete_observations` | 删除 |

资源：`memory://knowledge-graph`（当前为空）。

### 4.3 `playwright` — 浏览器自动化

约 25 个工具：`browser_navigate`、`browser_snapshot`（比截图更适合驱动操作）、`browser_click`、`browser_type`、`browser_fill_form`、`browser_evaluate`、`browser_network_requests`、`browser_console_messages`、`browser_take_screenshot`、`browser_tabs`、`browser_resize`、`browser_emulate_media` 等。

**用途**：前端改动后的真实验收、抓取页面数据、复现线上问题。

### 4.4 `mcp-search`（claude-mem 插件自带）

| 工具 | 用途 |
|---|---|
| `search` → `timeline` → `get_observations` | 三层检索：先拿索引，再看上下文，最后取详情 |
| `smart_search` / `smart_outline` / `smart_unfold` | tree-sitter 结构化代码探索 |
| `observation_search` / `observation_context` | 全文检索历史观察 |
| `build_corpus` / `prime_corpus` / `query_corpus` | 构建并查询专属知识库 |

---

## 5. Hooks：当前自动生效的行为

Hooks 由插件自动注册，**无需手动触发**，但知道它们在做什么很重要。

### claude-mem（记忆采集）

| 触发时机 | 动作 |
|---|---|
| `Setup` | 版本检查 |
| `SessionStart`（startup / clear / compact） | 启动 worker 服务、注入历史上下文 |
| `UserPromptSubmit` | 会话初始化 |
| `PostToolUse`（所有工具） | 记录观察（observation） |
| `PreToolUse`（`Read`） | 注入文件相关上下文 |
| `Stop` | 压缩总结本轮会话 |

### security-guidance（安全审查）

| 触发时机 | 动作 |
|---|---|
| `SessionStart` | 准备 Agent SDK 环境 |
| `UserPromptSubmit` / `PostToolUse` | 安全提醒 |
| `PostToolUse`（`Edit`/`Write`/`MultiEdit`/`NotebookEdit`） | 基于模式的安全告警 |
| `PostToolUse`（`git commit` / `git push` / `gt create`…） | **后台异步**复审，发现问题会主动回头提醒你 |
| `Stop` | 后台 diff 安全复审 |

---

## 6. 权限规则（`~/.claude/settings.json`）

**自动放行（allow）**
- 只读命令：`ls find grep rg cat head tail wc sort uniq cut tr comm diff cmp file stat du df pwd which echo jq sed awk`
- Git 只读：`status diff log show branch rev-parse ls-tree ls-files cat-file grep remote fetch` + `git add` / `git commit`
- 构建：`npx tsc`、`npx vite build`、`pnpm`
- 网络：`curl`、`gh`、`python3`、`WebSearch`、`WebFetch(github.com / docs.anthropic.com)`
- Java：`mvn`（含本机 `apache-maven-3.9.6`）
- CodeGraph 全部 MCP 工具、`Read(/private/tmp/**)`

**明确禁止（deny）**
- `rm`、`rm -rf`、`find -delete`、`git clean`、`truncate`、`shred`

**每次询问（ask）**
- `mv`、`cp`

---

## 7. 本机环境备注

- **模型**：配置走本地代理 `http://127.0.0.1:15721`（cc-switch），实际后端为 `deepseek-v4-flash`；界面模型名映射为 sonnet/opus/haiku/fable 系列。
- **子代理模型**：`CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash[1M]`
- **自定义指令**：始终使用中文回复。
- **当前工作目录**：`/Users/yat/work/agent-work/skillWeb`（空目录，无 git 提交、无 `.claude/`）。

---

## 8. 常见组合用法

```text
# 新功能开发（推荐链路）
1. /brainstorming          → 想清楚要做什么
2. /writing-plans          → 拆成可执行步骤
3. /subagent-driven-development → 并行执行
4. /review-pr 或 /code-review   → 评审
5. /commit-push-pr         → 提交并开 PR

# 排查 Bug
1. /systematic-debugging   → 定位根因（禁止先猜后改）
2. /verification-before-completion → 证明真的修好了

# 接手陌生仓库
1. /claude-mem:learn-codebase  → 灌入记忆
2. /codegraph__explore...      → 用 CodeGraph 查流程图
3. /claude-mem:mem-search      → 之后跨会话回忆

# 前端改版
1. /frontend-design        → 定视觉方向
2. Playwright MCP          → 真实浏览器验收
3. /dataviz                → 若涉及图表
```

---

## 9. 目录清单（已确认）

```text
~/.claude/skills/          → 仅 3 个（skill-creator, viral-video-copywriting, web-to-app）
~/.claude/agents/          → 215 个 .md 文件
~/.claude/commands/        → 不存在
```

- **用户自建 Skill 共 3 个**，无遗漏；第 2.3 节标注为"内置"的那些（`dataviz`、`code-review`、`loop` 等）不在本机 skills 目录中，来自 Claude Code 自带的 Skill 包。
- **自定义子代理 215 个**全部平铺在 `~/.claude/agents/`，文件名英文 kebab-case，无子目录。
- **无用户级自定义斜杠命令**：你在 `/` 菜单里看到的 `commit`、`review-pr` 等全部来自插件（见第 1 节）。

### 维护提示

插件版本会随更新变化，以这两个文件为准：

```bash
cat ~/.claude/plugins/installed_plugins.json   # 已装插件与版本
cat ~/.claude/settings.json                    # 启用开关、权限、环境变量
```

---

*本文档由 Claude Code 生成于 2026-10-13，第 3.3 / 9 节于同日用 `ls` 实测补全。*
