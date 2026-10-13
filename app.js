"use strict";

/* ============================================================
   数据
   ============================================================ */

const SECTIONS = [
{
  id:"quick", num:"0", title:"场景速查",
  blocks:[
    {t:"p", x:"按需求找入口。带 <code>/</code> 的是斜杠命令，其余是需要时让我调用的技能。"},
    {t:"table", head:["你的需求","推荐入口","类型"], rows:[
      ["想清楚一个功能该不该做、怎么做","brainstorming","Skill"],
      ["需求明确，要拆成可执行步骤","writing-plans","Skill"],
      ["让多个子代理并行干活","dispatching-parallel-agents","Skill"],
      ["执行某个已写好的计划","executing-plans · subagent-driven-development","Skill"],
      ["遇到 Bug / 测试失败","systematic-debugging","Skill"],
      ["写代码前先写测试","test-driven-development","Skill"],
      ["宣称「做完了」之前要证据","verification-before-completion","Skill"],
      ["提交 / 推送 / 开 PR","/commit · /commit-push-pr · /clean_gone","命令"],
      ["刚写完代码要评审","/review-pr · /code-review","命令"],
      ["让代码更简洁","/simplify","命令"],
      ["安全审查当前改动","/security-review","命令"],
      ["做 UI / 前端界面","frontend-design","Skill"],
      ["做图表 / 数据可视化","dataviz","Skill"],
      ["处理 Excel / Word / PPT / PDF","document-skills 的 xlsx·docx·pptx·pdf","Skill"],
      ["把网页打包成桌面应用","web-to-app","Skill"],
      ["创作短视频文案","viral-video-copywriting","Skill"],
      ["查「上次我们怎么解决的」","mem-search","Skill"],
      ["让 Claude 通读一个陌生仓库","learn-codebase","Skill"],
      ["减少权限弹窗","/fewer-permission-prompts","命令"],
      ["定时 / 循环执行任务","/loop","命令"],
      ["改 Claude Code 配置","/update-config · /keybindings-help","命令"],
      ["写一个新 Skill","skill-creator","Skill"],
      ["写 Claude API / SDK 代码","claude-api","Skill"],
      ["控制浏览器做验收","Playwright MCP","MCP"],
      ["跨仓库查代码符号","CodeGraph MCP","MCP"]
    ]}
  ]
},
{
  id:"plugins", num:"1", title:"插件",
  blocks:[
    {t:"p", x:"来源：<code>~/.claude/settings.json</code> 的 <code>enabledPlugins</code>；版本以 <code>~/.claude/plugins/installed_plugins.json</code> 为准。"},
    {t:"table", head:["插件","版本","提供什么"], rows:[
      ["superpowers","6.4.1","15 个工程流程类 Skill（TDD、调试、计划、评审）"],
      ["claude-mem","13.4.0","跨会话记忆：15 个 Skill + 1 个 MCP 服务器 + 6 类 hooks"],
      ["feature-dev","快照 f359d43b","/feature-dev 命令 + 3 个子代理"],
      ["frontend-design","快照 f359d43b","前端视觉设计 Skill"],
      ["security-guidance","2.0.13","自动安全审查 hooks：编辑时告警、提交/推送时后台复审"],
      ["commit-commands","快照 f359d43b","/commit、/commit-push-pr、/clean_gone"],
      ["pr-review-toolkit","快照 f359d43b","/review-pr + 6 个专职评审子代理"],
      ["pyright-lsp","1.0.0","Python 语言服务器（代码智能）"],
      ["document-skills","快照 dbd4588f","文档处理：xlsx / docx / pptx / pdf"],
      ["andrej-karpathy-skills","1.0.0","karpathy-guidelines，减少常见 LLM 编码错误"]
    ]},
    {t:"h3", x:"已配置的插件市场"},
    {t:"ul", items:[
      "<code>thedotmack</code> → github.com/thedotmack/claude-mem",
      "<code>claude-community</code> → github.com/anthropics/claude-plugins-community",
      "<code>wshobson-agents</code> → github.com/wshobson/agents",
      "<code>everything-claude-code</code> → github.com/affaan-m/everything-claude-code",
      "<code>anthropic-agent-skills</code> → github.com/anthropics/skills"
    ]},
    {t:"note", x:"官方市场 <b>claude-plugins-official</b> 内含 600+ 可安装插件。上面 10 个只是当前启用的部分，想装新的先来这里找。"}
  ]
},
{
  id:"skills", num:"2", title:"技能 Skills",
  blocks:[
    {t:"h3", x:"2.1 用户自建（~/.claude/skills/，共 3 个）"},
    {t:"table", head:["技能","用途"], rows:[
      ["skill-creator","创建/更新 Skill 的标准化指南：模板、目录规范、打包验证"],
      ["web-to-app","用 Rust + Tauri 把任意网页打包成 macOS/Windows/Linux 桌面应用"],
      ["viral-video-copywriting","对标抖音爆款视频，拆解方法论并创作原创文案"]
    ]},

    {t:"h3", x:"2.2 插件自带（37 个）"},
    {t:"p", x:"<b>superpowers</b> —— 工程流程主干，共 15 个。"},
    {t:"table", head:["技能","用途"], rows:[
      ["brainstorming","创意类工作前必用：把想法变成设计与规格"],
      ["writing-plans","把规格写成多步实施计划"],
      ["executing-plans","在当前会话内亲自执行计划"],
      ["subagent-driven-development","用子代理执行计划中的独立任务"],
      ["dispatching-parallel-agents","2 个以上互不依赖的任务并行分派"],
      ["test-driven-development","先写测试再写实现"],
      ["systematic-debugging","遇到 Bug / 测试失败的根因排查流程"],
      ["verification-before-completion","声称「完成」前必须跑验证命令"],
      ["requesting-code-review","主动请求代码评审"],
      ["receiving-code-review","收到评审意见后的处理规范，要求技术严谨、不盲从"],
      ["finishing-a-development-branch","实现完成后决定如何合入"],
      ["using-git-worktrees","需要隔离工作区时启用 git worktree"],
      ["writing-skills","编写与校验 Skill 本身"],
      ["using-superpowers","开场元技能：如何发现和使用 Skill"],
      ["diagnosing-superpowers","复盘「这次为什么没用好」"]
    ]},
    {t:"p", x:"<b>claude-mem</b> —— 记忆与检索，共 15 个。"},
    {t:"table", head:["技能","用途"], rows:[
      ["mem-search","跨会话搜索记忆：「上次怎么解决的？」"],
      ["learn-codebase","通读整个仓库灌入记忆，约 5 分钟"],
      ["how-it-works","解释记忆系统怎么工作、数据存在哪"],
      ["smart-explore","基于 tree-sitter 的结构化代码搜索，省 token"],
      ["knowledge-agent","从历史观察构建可查询的知识库"],
      ["make-plan","生成分阶段实施计划，含文档发现"],
      ["do","用子代理执行计划"],
      ["timeline-report","生成项目开发史叙事报告"],
      ["weekly-digests","按周生成连载式项目史"],
      ["pathfinder","画功能流程图、找重复关注点、提统一架构"],
      ["babysit","盯 PR / Review 直到可合并"],
      ["oh-my-issues","把一堆 GitHub issue 按根因聚类成计划"],
      ["design-is","按 Dieter Rams 十条原则审计设计"],
      ["wowerpoint","把一份文档变成 kawaii 风幻灯片 PDF"],
      ["version-bump","插件的语义化版本发布全流程"]
    ]},
    {t:"p", x:"<b>其他插件</b>，共 7 个。"},
    {t:"table", head:["技能","来源","用途"], rows:[
      ["feature-dev","feature-dev","完整功能开发流程：探索 → 架构 → 审查"],
      ["frontend-design","frontend-design","做有辨识度的界面视觉设计"],
      ["xlsx","document-skills","Excel / CSV 读写计算"],
      ["docx","document-skills","Word 文档创建与编辑"],
      ["pptx","document-skills","PPT 演示文稿"],
      ["pdf","document-skills","PDF 读取、合并、拆分、OCR"],
      ["karpathy-guidelines","andrej-karpathy-skills","编码行为准则，减少常见 LLM 错误"]
    ]},

    {t:"h3", x:"2.3 Claude Code 内置（13 个）"},
    {t:"table", head:["技能","用途"], rows:[
      ["code-review","审查当前 diff / PR / 分支，查正确性 Bug"],
      ["simplify","只做质量优化：复用、简化、效率、抽象层级"],
      ["security-review","对当前分支未提交改动做完整安全审查"],
      ["dataviz","写任何图表代码前必读：配色、坐标轴、仪表盘规范"],
      ["init","生成 CLAUDE.md"],
      ["run","启动并驱动本项目的应用，确认改动真的生效"],
      ["update-config","改 settings.json：权限、环境变量、hooks"],
      ["keybindings-help","自定义快捷键"],
      ["fewer-permission-prompts","扫描历史，生成只读命令白名单减少弹窗"],
      ["loop","按间隔重复执行某个 prompt 或斜杠命令"],
      ["claude-api","Claude API / SDK 参考：模型 ID、定价、缓存、工具调用"],
      ["plugin-authoring","开发 Claude 自身的界面改造：面板、状态栏、hooks"],
      ["workflow-authoring","编写 Workflow 工具脚本"]
    ]},
    {t:"note", x:"输入 <code>/</code> 会列出全部可调用命令；也可以直接用自然语言描述需求，我会按 description 自动触发对应技能。"}
  ]
},
{
  id:"agents", num:"3", title:"子代理 Agents",
  blocks:[
    {t:"h3", x:"3.1 内置 / 通用"},
    {t:"table", head:["代理","用途"], rows:[
      ["claude","通用兜底"],
      ["general-purpose","复杂多步研究、跨文件搜索、批量任务"],
      ["Explore","只读快速定位代码（找文件、找符号），不用于评审"],
      ["Plan","设计实现方案"],
      ["claude-code-guide","回答 Claude Code / Agent SDK / API 的使用问题"],
      ["statusline-setup","配置状态栏"]
    ]},
    {t:"h3", x:"3.2 插件提供"},
    {t:"table", head:["代理","来源","用途"], rows:[
      ["code-explorer","feature-dev","深度分析现有功能、追踪执行路径"],
      ["code-architect","feature-dev","设计功能架构与实现蓝图"],
      ["code-reviewer","feature-dev","评审代码 Bug / 安全 / 质量问题"],
      ["code-reviewer","pr-review-toolkit","按项目规范评审代码"],
      ["code-simplifier","pr-review-toolkit","简化代码、保持功能不变"],
      ["comment-analyzer","pr-review-toolkit","审查注释准确性与可维护性"],
      ["pr-test-analyzer","pr-review-toolkit","审查测试覆盖质量"],
      ["silent-failure-hunter","pr-review-toolkit","猎捕静默失败、错误吞噬、不当兜底"],
      ["type-design-analyzer","pr-review-toolkit","类型设计质量分析"]
    ]},
    {t:"h3", x:"3.3 自定义子代理（~/.claude/agents/，共 216 个）"},
    {t:"p", x:"文件名一律英文 kebab-case，界面里显示中文名。按前缀分组，少于 3 个的前缀并入「其他」。"},
    {t:"agents"}
  ]
},
{
  id:"mcp", num:"4", title:"MCP 服务器",
  blocks:[
    {t:"p", x:"MCP 工具由我自动调用，你一般无需手动操作；用 <code>/mcp</code> 可查看和管理连接状态。"},
    {t:"h3", x:"4.1 codegraph — 代码知识图谱"},
    {t:"table", head:["工具","用途"], rows:[
      ["codegraph_explore","首选。一句话或一组符号名，返回相关符号原文与调用路径"],
      ["codegraph_search","按名字快速定位符号"],
      ["codegraph_node","取单个符号完整定义，含重载"],
      ["codegraph_callers / codegraph_callees","谁调我 / 我调谁"],
      ["codegraph_impact","改这个符号会波及谁，改前必查"],
      ["codegraph_files","索引内的文件树"],
      ["codegraph_status","索引健康度"]
    ]},
    {t:"note", x:"需要在<b>已建 <code>.codegraph/</code> 索引的项目</b>里使用。当前目录 <code>skillWeb</code> 未建索引，所以在这里调用会报错。"},

    {t:"h3", x:"4.2 memory — 知识图谱记忆"},
    {t:"table", head:["工具","用途"], rows:[
      ["create_entities / create_relations","建实体与关系"],
      ["add_observations","给实体加观察"],
      ["search_nodes / open_nodes / read_graph","查询"],
      ["delete_entities / delete_relations / delete_observations","删除"]
    ]},

    {t:"h3", x:"4.3 playwright — 浏览器自动化"},
    {t:"p", x:"约 25 个工具：<code>browser_navigate</code>、<code>browser_snapshot</code>（比截图更适合驱动操作）、<code>browser_click</code>、<code>browser_type</code>、<code>browser_fill_form</code>、<code>browser_evaluate</code>、<code>browser_network_requests</code>、<code>browser_console_messages</code>、<code>browser_take_screenshot</code>、<code>browser_tabs</code>、<code>browser_resize</code>、<code>browser_emulate_media</code> 等。"},
    {t:"p", x:"用途：前端改动后的真实验收、抓取页面数据、复现线上问题。"},

    {t:"h3", x:"4.4 mcp-search — claude-mem 自带"},
    {t:"table", head:["工具","用途"], rows:[
      ["search","检索第一层。配套 timeline 看上下文、get_observations 取全文"],
      ["smart_search / smart_outline / smart_unfold","tree-sitter 结构化代码探索"],
      ["observation_search / observation_context","全文检索历史观察"],
      ["build_corpus / prime_corpus / query_corpus","构建并查询专属知识库"]
    ]}
  ]
},
{
  id:"hooks", num:"5", title:"Hooks 自动化",
  blocks:[
    {t:"p", x:"由插件自动注册，无需手动触发，但知道它们在做什么很重要。"},
    {t:"h3", x:"claude-mem（记忆采集）"},
    {t:"table", head:["触发时机","动作"], rows:[
      ["Setup","版本检查"],
      ["SessionStart（startup / clear / compact）","启动 worker 服务、注入历史上下文"],
      ["UserPromptSubmit","会话初始化"],
      ["PostToolUse（所有工具）","记录观察 observation"],
      ["PreToolUse（Read）","注入文件相关上下文"],
      ["Stop","压缩总结本轮会话"]
    ]},
    {t:"h3", x:"security-guidance（安全审查）"},
    {t:"table", head:["触发时机","动作"], rows:[
      ["SessionStart","准备 Agent SDK 环境"],
      ["UserPromptSubmit / PostToolUse","安全提醒"],
      ["PostToolUse（Edit / Write / MultiEdit / NotebookEdit）","基于模式的安全告警"],
      ["PostToolUse（git commit / git push / gt create…）","后台异步复审，发现问题会主动回头提醒你"],
      ["Stop","后台 diff 安全复审"]
    ]}
  ]
},
{
  id:"perms", num:"6", title:"权限规则",
  blocks:[
    {t:"p", x:"定义在 <code>~/.claude/settings.json</code>。绝对路径需自行补全 <code>~/</code> 展开。"},
    {t:"h3", x:"自动放行"},
    {t:"ul", items:[
      "<b>只读命令</b>：ls、find、grep、rg、cat、head、tail、wc、sort、uniq、cut、tr、comm、diff、cmp、file、stat、du、df、pwd、which、echo、jq、sed、awk",
      "<b>Git 只读</b>：status、diff、log、show、branch、rev-parse、ls-tree、ls-files、cat-file、grep、remote、fetch；以及 git add、git commit",
      "<b>构建</b>：npx tsc、npx vite build、pnpm",
      "<b>网络</b>：curl、gh、python3、WebSearch、WebFetch（限 github.com / docs.anthropic.com）",
      "<b>Java</b>：mvn，含本机 apache-maven-3.9.6",
      "<b>其他</b>：CodeGraph 全部 MCP 工具、Read(/private/tmp/**)"
    ]},
    {t:"h3", x:"明确禁止"},
    {t:"ul", items:["rm、rm -rf、find -delete、git clean、truncate、shred"]},
    {t:"h3", x:"每次询问"},
    {t:"ul", items:["mv、cp"]}
  ]
},
{
  id:"env", num:"7", title:"本机环境",
  blocks:[
    {t:"table", head:["项目","值"], rows:[
      ["模型后端","本地代理 http://127.0.0.1:15721（cc-switch），实际后端 deepseek-v4-flash"],
      ["界面模型名","映射为 sonnet / opus / haiku / fable 系列"],
      ["子代理模型","CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash[1M]"],
      ["自定义指令","始终使用中文回复"],
      ["当前工作目录","/Users/yat/work/agent-work/skillWeb（空目录，无 git 提交）"]
    ]}
  ]
},
{
  id:"files", num:"8", title:"目录清单",
  blocks:[
    {t:"table", head:["路径","内容"], rows:[
      ["~/.claude/skills/","仅 3 个：skill-creator、viral-video-copywriting、web-to-app"],
      ["~/.claude/agents/","216 个 .md 文件，英文 kebab-case，无子目录"],
      ["~/.claude/commands/","不存在"]
    ]},
    {t:"ul", items:[
      "第 2.3 节标注为「内置」的那些不在本机 skills 目录，来自 Claude Code 自带的技能包。",
      "你在 <code>/</code> 菜单里看到的 commit、review-pr 等全部来自插件，看第 1 节。",
      "Markdown 原文 <code>Claude-能力总览.md</code> 保留在同一目录，是本文的唯一真源。"
    ]},
    {t:"note", x:"插件版本会随更新变化。核对命令：<code>cat ~/.claude/plugins/installed_plugins.json</code> 与 <code>cat ~/.claude/settings.json</code>。"}
  ]
}
];

/* 216 个自定义子代理：[文件名, 中文名, 一句话描述] */
const AGENTS = [
["academic-anthropologist","人类学家","文化体系、仪式、亲属关系与民族志方法"],
["academic-geographer","地理学家","自然与人文地理、气候系统、制图与空间分析"],
["academic-historian","历史学家","历史分期、物质文化与史料验证"],
["academic-narratologist","叙事学家","故事结构、人物弧线与文学分析"],
["academic-psychologist","心理学家","人格理论、动机与认知模式"],
["academic-study-planner","学习规划师","考研考公等重大考试的备考策略与学习计划"],
["accounts-payable-agent","应付账款智能体","供应商付款、承包商发票与定期账单执行"],
["agentic-identity-trust","身份信任架构师","为自主智能体设计身份认证与信任验证体系"],
["agents-orchestrator","智能体编排者","编排整个开发工作流的流水线管理者"],
["automation-governance-architect","自动化治理架构师","治理优先的业务自动化，n8n 优先"],
["blender-addon-engineer","Blender 插件工程师","Python 插件、资源验证器与导出工具"],
["blockchain-security-auditor","区块链安全审计师","智能合约漏洞检测、形式化验证与审计报告"],
["compliance-auditor","合规审计师","SOC 2 / ISO 27001 / HIPAA / PCI-DSS 审计"],
["corporate-training-designer","企业培训课程设计师","培训体系搭建、课程开发与效果评估"],
["data-consolidation-agent","数据整合师","把销售数据整合到实时报告仪表盘"],
["design-brand-guardian","品牌守护者","品牌形象开发、一致性与战略定位"],
["design-image-prompt-engineer","图像提示词工程师","摄影美学与 AI 图像提示词撰写"],
["design-inclusive-visuals-specialist","包容性视觉专家","消除生成图像中的系统性偏见"],
["design-ui-designer","UI 设计师","视觉设计系统、组件库与像素级界面"],
["design-ux-architect","UX 架构师","CSS 体系、布局框架与清晰的实现指引"],
["design-ux-researcher","UX 研究员","用户行为分析、可用性测试与设计洞察"],
["design-visual-storyteller","视觉叙事师","把复杂信息转化成有吸引力的视觉故事"],
["design-whimsy-injector","趣味注入师","给品牌体验注入个性、惊喜与趣味细节"],
["engineering-ai-data-remediation-engineer","AI 数据修复工程师","本地 SLM 加语义聚类，修复大规模数据异常"],
["engineering-ai-engineer","AI 工程师","模型开发到上线的全链路工程化"],
["engineering-autonomous-optimization-architect","自主优化架构师","对 API 做影子测试并守住成本与安全护栏"],
["engineering-backend-architect","后端架构师","可扩展系统设计、数据库架构与 API 开发"],
["engineering-cms-developer","CMS 开发者","Drupal / WordPress 主题、插件与内容架构"],
["engineering-code-reviewer","代码审查员","正确性、可维护性、安全性与性能评审"],
["engineering-codebase-onboarding-engineer","代码库入职引导工程师","读源码、追代码路径，只陈述基于代码的事实"],
["engineering-data-engineer","数据工程师","ETL/ELT、Spark、dbt 与湖仓架构"],
["engineering-database-optimizer","数据库优化师","Schema 设计、查询优化与索引策略"],
["engineering-devops-automator","DevOps 自动化师","基础设施自动化与 CI/CD 流水线"],
["engineering-dingtalk-integration-developer","钉钉集成开发工程师","钉钉机器人、审批流、小程序与宜搭对接"],
["engineering-email-intelligence-engineer","邮件智能工程师","从邮件线程提取可供 AI 推理的结构化数据"],
["engineering-embedded-firmware-engineer","嵌入式固件工程师","ESP32/STM32、FreeRTOS 与 Zephyr 裸机开发"],
["engineering-embedded-linux-driver-engineer","嵌入式 Linux 驱动工程师","内核模块、设备树、BSP 与交叉编译"],
["engineering-feishu-integration-developer","飞书集成开发工程师","飞书机器人、多维表格、审批流与 SSO"],
["engineering-filament-optimization-specialist","Filament 优化专家","重构 Filament 后台管理界面的结构性改造"],
["engineering-fpga-digital-design-engineer","FPGA/ASIC 数字设计工程师","Verilog/SystemVerilog、AXI 总线与时序收敛"],
["engineering-frontend-developer","前端开发者","React / Vue / Angular 与性能优化"],
["engineering-git-workflow-master","Git 工作流大师","分支策略、约定式提交、rebase 与 worktree"],
["engineering-incident-response-commander","故障响应指挥官","生产故障管理、复盘与 on-call 流程设计"],
["engineering-iot-solution-architect","IoT 方案架构师","MQTT/CoAP、边缘计算与设备管理"],
["engineering-mechanical-design-engineer","机械设计工程师","传动机构、强度校核与可制造工程图 BOM"],
["engineering-minimal-change-engineer","最小变更工程师","只修被要求的内容，拒绝范围蔓延"],
["engineering-mobile-app-builder","移动应用开发者","iOS / Android 原生与跨平台框架"],
["engineering-pc-host-engineer","上位机工程师","Qt/QML、串口、Modbus/CAN 与工业协议对接"],
["engineering-rapid-prototyper","快速原型师","超快速的概念验证与 MVP 创建"],
["engineering-security-engineer","安全工程师","威胁建模、漏洞评估与安全代码审查"],
["engineering-senior-developer","高级开发者","Laravel/Livewire/FluxUI 与 Three.js 集成"],
["engineering-software-architect","软件架构师","系统设计、领域驱动设计与架构模式"],
["engineering-solidity-smart-contract-engineer","Solidity 智能合约工程师","EVM 合约架构、Gas 优化与可升级代理"],
["engineering-sre","SRE","SLO、错误预算、可观测性与混沌工程"],
["engineering-technical-writer","技术文档工程师","API 参考、README 与教程写作"],
["engineering-threat-detection-engineer","威胁检测工程师","SIEM 规则开发与 MITRE ATT&CK 覆盖映射"],
["engineering-voice-ai-integration-engineer","语音 AI 集成工程师","Whisper 转录流水线、字幕与说话人分离"],
["engineering-wechat-mini-program-developer","微信小程序开发者","WXML/WXSS/WXS、微信支付与云开发"],
["finance-bookkeeper-controller","簿记与财务总监","日常账务、对账、月末结账与内部控制"],
["finance-financial-analyst","财务分析师","财务建模、预测与场景分析"],
["finance-financial-forecaster","财务预测分析师","收入预测、现金流与烧钱率分析"],
["finance-fpa-analyst","FP&A 分析师","预算编制、差异分析与滚动预测"],
["finance-fraud-detector","金融风控分析师","交易反欺诈、反洗钱与央行征信应用"],
["finance-investment-researcher","投资研究员","尽职调查、组合分析与资产估值"],
["finance-invoice-manager","发票管理专家","专普票、金税系统、三单匹配与报销审批"],
["finance-tax-strategist","税务策略师","税务优化、多辖区合规与转让定价"],
["game-audio-engineer","游戏音频工程师","FMOD/Wwise 集成与自适应音乐系统"],
["game-designer","游戏设计师","GDD 编写、玩家心理、经济平衡与游戏循环"],
["gaokao-college-advisor","高考志愿填报顾问","平行志愿规则、位次法与冲稳保策略"],
["godot-gameplay-scripter","Godot 游戏脚本开发者","GDScript 2.0、节点式架构与类型安全信号"],
["godot-multiplayer-engineer","Godot 多人游戏工程师","MultiplayerAPI、场景复制与 ENet/WebRTC"],
["godot-shader-developer","Godot Shader 开发者","Godot 着色语言与 VisualShader 后处理"],
["government-digital-presales-consultant","政务数字化售前顾问","政务标书、POC 验证与等保密评信创"],
["healthcare-customer-service","医疗客服专家","患者支持、账单查询与临床转接"],
["healthcare-marketing-compliance","医疗健康营销合规师","广告法与医疗广告管理办法下的内容风控"],
["hospitality-guest-services","酒店宾客服务专家","预订、礼宾服务与宾客投诉处理"],
["hr-onboarding","HR 入职管理专家","员工迎新、文档管理、合规追踪与福利登记"],
["hr-performance-reviewer","绩效管理专家","OKR/KPI 双轨、360 反馈与绩效校准会"],
["hr-recruiter","招聘专家","Boss 直聘/猎聘渠道运营与人才管线管理"],
["identity-graph-operator","身份图谱操作员","多智能体共享身份图谱的一致性运维"],
["language-translator","语言翻译专家","西英互译，含文化语境与地区方言适配"],
["legal-billing-time-tracking","律所计费与工时专家","工时记录、发票生成与信托账户合规"],
["legal-client-intake","律所客户接案专家","客户资质审核、咨询预约与利益冲突筛查"],
["legal-contract-reviewer","合同审查专家","民法典合同编下的风险识别与条款修改建议"],
["legal-document-review","法律文书审查专家","合同、诉讼与不动产协议的审查与版本比对"],
["legal-policy-writer","制度文件撰写专家","隐私政策、用户协议与三法合规制度起草"],
["level-designer","关卡设计师","布局理论、节奏架构与遭遇战设计"],
["livestock-archive-auditor","养殖档案核对员","养殖档案 Excel 与生产日报的错填漏填审计"],
["loan-officer-assistant","信贷经理助手","借款人接待、资格预审与过户协调"],
["lsp-index-engineer","LSP 索引工程师","LSP 客户端编排与统一语义索引"],
["macos-spatial-metal-engineer","macOS Metal 空间工程师","Swift/Metal 高性能 3D 渲染与空间计算"],
["marketing-agentic-search-optimizer","智能搜索优化师","WebMCP 就绪审计与智能体任务完成率"],
["marketing-ai-citation-strategist","AI 引文策略师","提升品牌在 ChatGPT/Claude 等平台的引用率"],
["marketing-app-store-optimizer","应用商店优化师","ASO、转化率优化与应用可发现性"],
["marketing-baidu-seo-specialist","百度 SEO 专家","百度算法、生态产品矩阵与 ICP 备案"],
["marketing-bilibili-strategist","B站内容策略师","UP 主运营、弹幕文化与社区生态"],
["marketing-book-co-author","图书联合作者","把语音笔记与碎片想法变成结构化书稿"],
["marketing-carousel-growth-engine","轮播图增长引擎","生成轮播图并自动发布到抖音与 Instagram"],
["marketing-china-ecommerce-operator","中国电商运营专家","淘宝/天猫/拼多多/京东全平台运营"],
["marketing-china-market-localization-strategist","中国市场本地化策略师","把趋势信号转成抖音/小红书上市策略"],
["marketing-content-creator","内容创作者","多平台内容策划与创作"],
["marketing-cross-border-ecommerce","跨境电商运营专家","Amazon/Shopee/Temu 与海外仓合规"],
["marketing-daily-news-briefing","新闻情报官","多源新闻采集与结构化简报生成"],
["marketing-douyin-strategist","抖音策略师","算法推荐机制、爆款策划与直播带货"],
["marketing-ecommerce-operator","电商运营师","店铺运营、大促策划与跨平台差异策略"],
["marketing-growth-hacker","增长黑客","低成本高回报的获客实验设计"],
["marketing-instagram-curator","Instagram 策展师","视觉叙事、社区运营与多格式内容"],
["marketing-knowledge-commerce-strategist","知识付费产品策划师","得到/知识星球/小报童等平台运营"],
["marketing-kuaishou-strategist","快手策略师","下沉市场用户运营与直播电商"],
["marketing-linkedin-content-creator","LinkedIn 内容创作专家","个人品牌打造与专业内容创作"],
["marketing-livestream-commerce-coach","直播电商主播教练","话术设计、选品排品与流量配比"],
["marketing-podcast-strategist","播客内容策略师","小宇宙/喜马拉雅等平台的定位与增长"],
["marketing-private-domain-operator","私域流量运营师","企微 SCRM、社群精细化与裂变增长"],
["marketing-reddit-community-builder","Reddit 社区运营","真实参与、价值输出与长期口碑"],
["marketing-seo-specialist","SEO 专家","技术 SEO、内容优化与外链权重"],
["marketing-short-video-editing-coach","短视频剪辑指导师","剪映/PR/达芬奇全流程与调色音频"],
["marketing-social-media-strategist","社交媒体策略师","LinkedIn/Twitter 品牌建设与整合营销"],
["marketing-tiktok-strategist","TikTok 策略师","病毒式内容创作与算法优化"],
["marketing-twitter-engager","Twitter 互动官","实时互动与思想领袖建设"],
["marketing-video-optimization-specialist","视频优化专家","YouTube 算法、观众留存与封面优化"],
["marketing-wechat-official-account","微信公众号管理","内容营销、用户互动与自动化工作流"],
["marketing-wechat-operator","微信公众号运营","内容策略、社群运营与私域裂变"],
["marketing-weibo-strategist","微博运营策略师","热搜机制、超话运营与舆情管理"],
["marketing-weixin-channels-strategist","微信视频号运营策略师","社交推荐机制与公众号生态联动"],
["marketing-xiaohongshu-operator","小红书运营专家","种草笔记、达人合作与数据驱动获客"],
["marketing-xiaohongshu-specialist","小红书专家","生活方式内容与审美叙事"],
["marketing-zhihu-strategist","知乎策略师","思想领袖建设与知识驱动型互动"],
["narrative-designer","叙事设计师","分支对话、世界观架构与环境叙事"],
["paid-media-auditor","付费媒体审计师","200+ 检查点的广告账户审计"],
["paid-media-creative-strategist","广告创意策略师","RSA 优化、素材组设计与创意测试"],
["paid-media-paid-social-strategist","社交广告策略师","Meta/LinkedIn/TikTok 全链路社交广告"],
["paid-media-ppc-strategist","PPC 竞价策略师","Google/Microsoft/Amazon Ads 账户架构"],
["paid-media-programmatic-buyer","程序化广告采买专家","DV360/The Trade Desk 与 ABM 展示广告"],
["paid-media-search-query-analyst","搜索词分析师","否定关键词架构与查询意图映射"],
["paid-media-tracking-specialist","追踪与归因专家","GTM/GA4/CAPI 与服务端追踪实施"],
["product-behavioral-nudge-engine","行为助推引擎","通过交互节奏与风格提升成功率"],
["product-feedback-synthesizer","反馈分析师","把碎片化用户声音变成改进建议"],
["product-manager","产品经理","产品全生命周期、路线图与 GTM"],
["product-sprint-prioritizer","Sprint 排序师","用框架和数据替代拍脑袋的优先级"],
["product-trend-researcher","趋势研究员","行业趋势与技术前瞻，看清 6-18 个月"],
["project-management-experiment-tracker","实验追踪员","A/B 测试、功能实验与假设验证"],
["project-management-jira-workflow-steward","Jira工作流管家","提交可追溯、PR 结构规范的 Git 工作流"],
["project-management-project-shepherd","项目牧羊人","跨部门协调、时间线与利益方对齐"],
["project-management-studio-operations","工作室运营","日常效率、流程优化与资源协调"],
["project-management-studio-producer","工作室制片人","多项目组合、资源分配与创意对齐"],
["project-manager-senior","高级项目经理","规格拆成可执行任务，务实控制范围"],
["prompt-engineer","提示词工程师","系统提示词架构、思维链与少样本策略"],
["real-estate-buyer-seller","房地产经纪助手","买卖代理、报价谈判与过户支持"],
["recruitment-specialist","招聘专家","简历筛选、面试协调与人才管线"],
["report-distribution-agent","报告分发师","把整合好的销售报告按区域分发"],
["retail-customer-returns","零售退货专家","线上线下退货换货、防欺诈与客户留存"],
["roblox-avatar-creator","Roblox 虚拟形象创作者","UGC 物品制作与 Creator Marketplace 提交"],
["roblox-experience-designer","Roblox 体验设计师","参与循环、DataStore 进度与变现设计"],
["roblox-systems-scripter","Roblox 系统脚本工程师","Luau、客户端服务端安全模型与模块架构"],
["sales-account-strategist","客户拓展策略师","Land-and-Expand 执行与净收入留存管理"],
["sales-coach","销售教练","Pipeline Review、通话辅导与 Forecast 准确度"],
["sales-data-extraction-agent","销售数据提取师","从 Excel 提取月累计、年累计等销售指标"],
["sales-deal-strategist","赢单策略师","MEDDPICC 资质审查与竞争定位"],
["sales-discovery-coach","Discovery 教练","问题设计、现状诊断与差距量化"],
["sales-engineer","售前工程师","技术 Discovery、Demo 设计与 POC 执行"],
["sales-outbound-strategist","Outbound 策略师","基于信号的多渠道触达序列设计"],
["sales-pipeline-analyst","Pipeline 分析师","单子速度分析、Forecast 准确度与辅导"],
["sales-proposal-strategist","投标策略师","把 RFP 转成有说服力的赢标叙事"],
["specialized-ai-policy-writer","AI 治理政策专家","生成式 AI 管理办法与算法备案合规"],
["specialized-chief-of-staff","幕僚长","过滤噪音、掌控流程、把决策路由到最大影响处"],
["specialized-civil-engineer","土木工程师","结构分析、岩土设计与多标准国际项目协调"],
["specialized-cultural-intelligence-strategist","文化智能策略师","检测隐性排斥与跨文化共鸣"],
["specialized-developer-advocate","开发者布道师","开发者社区、技术内容与 DX 优化"],
["specialized-document-generator","文档生成器","代码化生成 PDF/PPTX/DOCX/XLSX"],
["specialized-french-consulting-market","法国咨询市场专家","ESN/SI 自由职业生态与费率定位"],
["specialized-korean-business-navigator","韩国商务专家","품의 决策流程与 KakaoTalk 商务礼仪"],
["specialized-mcp-builder","MCP 构建器","设计、构建和测试 MCP 服务器"],
["specialized-meeting-assistant","会议效率专家","会议纪要、行动项追踪与议程设计"],
["specialized-model-qa","模型 QA 专家","端到端审计机器学习与统计模型"],
["specialized-pricing-optimizer","动态定价策略师","电商定价、促销机制与利润最大化"],
["specialized-risk-assessor","企业风险评估师","国企风控、内控合规与供应链风险"],
["specialized-salesforce-architect","Salesforce 架构师","多云设计与 Governor Limits 治理"],
["specialized-workflow-architect","工作流架构师","为系统绘制完整工作流树与故障恢复路径"],
["study-abroad-advisor","留学规划顾问","全阶段选校定位、文书打磨与签证准备"],
["supply-chain-garment-factory-planning-engineer","服装工厂规划工程师","产线设计、产能测算与设备选型"],
["supply-chain-inventory-forecaster","库存预测专家","需求预测、安全库存与补货策略"],
["supply-chain-route-optimizer","物流路线优化师","配送路线规划与物流成本优化"],
["supply-chain-strategist","供应链采购策略师","供应商开发、战略采购与质量管控"],
["supply-chain-vendor-evaluator","供应商评估专家","供应商筛选评分、验厂审核与账期谈判"],
["support-analytics-reporter","数据分析师","仪表盘、统计分析与 KPI 跟踪"],
["support-executive-summary-generator","高管摘要师","SCQA、金字塔原理压缩成可执行摘要"],
["support-finance-tracker","财务追踪员","财务规划、预算管理与经营绩效分析"],
["support-infrastructure-maintainer","基础设施运维师","系统可靠性、性能优化与成本控制"],
["support-legal-compliance-checker","法务合规员","多辖区法规与行业标准合规"],
["support-recruitment-specialist","招聘运营专家","渠道运营、人才评估与劳动法合规"],
["support-support-responder","客服响应者","多渠道支持与主动客户关怀"],
["technical-artist","技术美术","Shader、VFX、LOD 管线与资源优化"],
["technical-translator-agent","技术翻译专家","技术领域中英文双向翻译"],
["terminal-integration-specialist","终端集成专家","终端模拟、文本渲染与 SwiftTerm 集成"],
["testing-accessibility-auditor","无障碍审核员","WCAG 审查与辅助技术实测"],
["testing-api-tester","API 测试员","API 全面验证与性能测试"],
["testing-embedded-qa-engineer","嵌入式测试工程师","HIL、故障注入与可靠性验证"],
["testing-evidence-collector","证据收集者","保证每个测试结论都有证据链支撑"],
["testing-performance-benchmarker","性能基准师","性能测试、容量规划与瓶颈定位"],
["testing-reality-checker","现实检验者","阻止幻想式审批，默认「需要改进」"],
["testing-test-results-analyzer","测试结果分析师","把原始测试数据变成质量决策洞察"],
["testing-tool-evaluator","工具评估师","功能对比、性能测试与成本分析"],
["testing-workflow-optimizer","工作流优化师","消除瓶颈、精简流程与引入自动化"],
["unity-architect","Unity 架构师","ScriptableObject 与解耦的模块化设计"],
["unity-editor-tool-developer","Unity 编辑器工具开发者","EditorWindow、PropertyDrawer 与管线自动化"],
["unity-multiplayer-engineer","Unity 多人游戏工程师","Netcode for GameObjects、Relay 与状态同步"],
["unity-shader-graph-artist","Unity Shader Graph 美术师","Shader Graph、HLSL 与 URP/HDRP"],
["unreal-multiplayer-architect","Unreal 多人游戏架构师","Actor 复制、服务端权威与网络预测"],
["unreal-systems-engineer","Unreal 系统工程师","C++/Blueprint 边界、Nanite、Lumen 与 GAS"],
["unreal-technical-artist","Unreal 技术美术","材质编辑器、Niagara 与程序化生成"],
["unreal-world-builder","Unreal 世界构建师","World Partition、Landscape 与关卡流式加载"],
["visionos-spatial-engineer","visionOS 空间工程师","SwiftUI 体积式界面与 Liquid Glass"],
["xr-cockpit-interaction-specialist","XR 座舱交互专家","沉浸式座舱控制系统设计"],
["xr-immersive-developer","XR 沉浸式开发者","WebXR/AR/VR 浏览器端应用"],
["xr-interface-architect","XR 界面架构师","空间交互设计与沉浸式界面策略"],
["zk-steward","ZK 管家","卡片盒笔记法驱动的知识库建设与链接"]
];

/* ============================================================
   详情数据
   ============================================================ */

const KIND = {
  plugin:{src:"用户级插件"}, pskill:{src:"插件自带技能"}, pagent:{src:"插件提供的子代理"},
  uskill:{src:"~/.claude/skills/"}, bskill:{src:"Claude Code 内置技能"},
  bagent:{src:"Claude Code 内置代理"}, cmd:{src:"插件提供的斜杠命令"},
  mcp:{src:"MCP 服务器"}, uagent:{src:"~/.claude/agents/"}
};

const INSTALL = {
  plugin:"已启用。改 ~/.claude/settings.json 里的 enabledPlugins 可以开或关。",
  pskill:"随所属插件安装，不用单独操作。想关掉就关掉整个插件。",
  pagent:"随所属插件安装。",
  cmd:"随所属插件安装。",
  bskill:"Claude Code 内置，无需安装，升级版本就有了。",
  bagent:"Claude Code 内置，无需安装。",
  uskill:"把技能目录放到 ~/.claude/skills/你的技能名/，其中 SKILL.md 是必需的。",
  uagent:"把 .md 文件放进 ~/.claude/agents/，新开会话即生效。",
  mcp:"在 ~/.claude/settings.json 或项目的 .mcp.json 里注册 mcpServers。插件自带的 MCP 会写在插件自己的 .mcp.json。"
};

const DETAIL = {

/* ---- 插件 ---- */
"superpowers":{k:"plugin",p:"superpowers v6.4.1",
 intro:"工程流程技能库。管的是「怎么把事做对」——从想清楚、写计划、做测试到验收。",
 when:"任何非平凡的功能开发、重构或排障，尤其当你担心一上来就写代码会写错方向时。",
 how:[["最省事的用法","说「先帮我想清楚这个功能」"]],
 pair:[["brainstorming","所有开发任务的起点"],["writing-plans","设计定完接这一步"]],
 rel:[["systematic-debugging","出 bug 时的入口"],["feature-dev","另一套开发流程，不强制关卡"]],
 note:"它有硬性关卡：brainstorming 没拿到你的确认前，不会开始写实现代码。这是设计意图，不是卡你——觉得啰嗦可以直接说「跳过流程」。",
},
"claude-mem":{k:"plugin",p:"claude-mem v13.4.0",
 intro:"跨会话记忆系统。自动记录每次做了什么，下次开新会话能检索到。",
 when:"接手上周的项目；想不起来某个问题怎么解决的；需要通读一个陌生仓库。",
 how:[["查历史","/mem-search"],["通读仓库","/learn-codebase"]],
 pair:[["make-plan","先灌记忆再定计划"],["smart-explore","检索比全文件读省 token"]],
 rel:[["how-it-works","想搞懂它到底记了什么"]],
 note:"靠 hooks 在后台自动跑：每次工具调用记一条观察，会话结束压缩总结。数据存在本地。",
},
"feature-dev":{k:"plugin",p:"feature-dev",
 intro:"官方的一体化功能开发流程：先探索代码库、再设计架构、最后质量评审，附一个同名技能和三个代理。",
 when:"在已有代码库里加一个中等以上规模的功能，希望按部就班走。",
 how:[["启动","/feature-dev"]],
 pair:[["code-explorer","流程里会自动用到"]],
 rel:[["superpowers","更强调关卡的另一套流程"]],
 note:"它会派三个子代理干不同的活，比单线做慢一些，但覆盖面更全。",
},
"frontend-design":{k:"plugin",p:"frontend-design",
 intro:"做有辨识度的界面视觉，专门避开「一眼 AI 生成」的模板感。附带同名技能。",
 when:"从零做页面，或觉得现有 UI 太普通、想要个明确方向时。",
 how:[["调用","/frontend-design"]],
 pair:[["dataviz","页面里有图表时一起用"],["playwright","做完在真浏览器里验收"]],
 rel:[["design-ui-designer","子代理版本的 UI 设计专家"]],
 note:"它会先给一套配色排版方案让你审，通过了再动手写代码。",
},
"security-guidance":{k:"plugin",p:"security-guidance v2.0.13",
 intro:"自动安全审查。编辑时告警，提交和推送时在后台跑一遍完整 diff 复审。",
 when:"不用主动调用——写涉及鉴权、SQL、文件上传、密钥的代码时它自己会出声。",
 how:[["主动扫描","/security-review"]],
 pair:[["code-review","安全之外的正确性交给它"]],
 rel:[["testing-reality-checker","拒绝放水的验收者"]],
 note:"提交和推送时会异步复审，发现问题主动回头提醒，不用你等。",
},
"commit-commands":{k:"plugin",p:"commit-commands",
 intro:"三个 git 操作的快捷命令。",
 when:"改完要提交，或要一步走完提交加推送加开 PR。",
 how:[["只提交","/commit"],["提交并开 PR","/commit-push-pr"],["清理已删分支","/clean_gone"]],
 pair:[["simplify","提交前先清理代码"],["code-review","提交前先自审"]],
 rel:[["security-guidance","提交时会自动触发它的后台复审"]],
 note:"/clean_gone 会删本地分支，属破坏性操作，执行前它会先问你。",
},
"pr-review-toolkit":{k:"plugin",p:"pr-review-toolkit",
 intro:"六个专职评审代理，每个盯一个维度。",
 when:"代码写完要过评审，或想专门查某类问题。",
 how:[["全套评审","/review-pr"],["只查一类","说「用 silent-failure-hunter 看这段」"]],
 pair:[["feature-dev","开发流程里的评审环节"]],
 rel:[["code-review","内置的通用评审，更轻"]],
 note:"silent-failure-hunter 和 type-design-analyzer 这两个在别处很少见，值得单独用。",
},
"pyright-lsp":{k:"plugin",p:"pyright-lsp v1.0.0",
 intro:"Python 语言服务器，给代码跳转、类型提示、未定义变量警告。",
 when:"写 Python 时自动生效。",
 how:[["无需调用","编辑 .py 文件时自动工作"]],
 pair:[],
 rel:[["codegraph","跨文件符号理解是另一条路"]],
 note:"前提是本机装了 pyright。没装的话这个插件等于不存在。",
},
"document-skills":{k:"plugin",p:"document-skills",
 intro:"处理四类文档文件：Excel、Word、PPT、PDF。",
 when:"要以这些格式产出或读取时，哪怕只是「把这份 xlsx 整理一下」。",
 how:[["调用","直接描述任务，如「把这份 xlsx 按区域汇总」"]],
 pair:[["specialized-document-generator","需要从零生成而不是编辑时"]],
 rel:[["dataviz","要在文档里放图表时"]],
 note:"技能检测到相关文件类型会自动触发，不用手动点名。",
},
"andrej-karpathy-skills":{k:"plugin",p:"andrej-karpathy-skills v1.0.0",
 intro:"一份编码行为准则，针对 LLM 的常见坏习惯：过度设计、乱抽象、不验证就宣布完成。",
 when:"希望我少犯这些毛病时。它是被动的，会一直起作用。",
 how:[["调用","/karpathy-guidelines"]],
 pair:[["engineering-minimal-change-engineer","同一件事的代理版本"]],
 rel:[["simplify","写完之后的清理"]],
 note:"和 minimal-change-engineer 代理理念重合，一起用效果更实。",
},

/* ---- 用户自建技能 ---- */
"skill-creator":{k:"uskill",
 intro:"创建或更新 Skill 的标准流程：模板、目录规范、打包与校验。",
 when:"想把某个重复的工作流固化成技能时。",
 how:[["调用","/skill-creator"],["直接说","「帮我做一个 XXX 技能」"]],
 pair:[["writing-skills","superpowers 那边也有一份写技能的规范"]],
 rel:[["plugin-authoring","想做界面改造而非技能时"]],
 note:"自建技能放 ~/.claude/skills/。它自带打包脚本，最后能产出可分享的 zip。",
},
"web-to-app":{k:"uskill",
 intro:"用 Rust 加 Tauri 把任意网页打包成桌面应用，产物体积约 5MB。",
 when:"想把某个网页版工具变成独立桌面 App 时。",
 how:[["调用","/web-to-app 然后给出网址"],["底层","它调 scripts/build_app.py 跑 pake-cli"]],
 pair:[["skill-creator","想改这个技能本身时"]],
 rel:[],
 note:"首次打包要编译 Rust 依赖，很慢，之后会快。需要先装 pake-cli。macOS 默认出 .dmg。",
},
"viral-video-copywriting":{k:"uskill",
 intro:"对标抖音爆款视频，拆解它的爆点方法论，再套用到你的原创内容上。",
 when:"要做短视频，但不确定怎么起头、怎么排节奏时。",
 how:[["调用","/viral-video-copywriting 然后给对标链接"],["更可靠","直接粘贴对标视频的字幕文稿"]],
 pair:[["marketing-douyin-strategist","运营视角的抖音策略"]],
 rel:[["marketing-short-video-editing-coach","写完文案之后怎么剪"]],
 note:"抖音反爬严格，链接抓取经常失败，手贴文案更稳。它明确只学方法论不抄内容，字数要卡在 ±5%。",
},

/* ---- superpowers 技能 ---- */
"brainstorming":{k:"pskill",p:"superpowers",
 intro:"把模糊想法变成可确认的设计。所有开发任务的第一站。",
 when:"任何「我们做个 X 吧」的时刻，尤其是你还说不清具体要什么的时候。",
 how:[["调用","/brainstorming"],["口头","「先帮我想清楚这个」"]],
 pair:[["writing-plans","设计确认后接这一步"],["frontend-design","方案涉及视觉时"]],
 rel:[["feature-dev","官方流程，不强制关卡"]],
 note:"有硬关卡：你没明确点头之前不会开始写实现代码。它会先把任务分成 spike、bounded、architectural 三档，档位不同流程长度不同。",
},
"writing-plans":{k:"pskill",p:"superpowers",
 intro:"把已确认的设计拆成可执行的多步实施计划。",
 when:"设计已经定了，需要一份能照着做的步骤清单。",
 how:[["调用","/writing-plans"]],
 pair:[["executing-plans","自己执行"],["subagent-driven-development","派子代理执行"]],
 rel:[["make-plan","claude-mem 的同类技能，会先检索历史"]],
 note:"计划写完要你选执行方式，它不会自己开工。",
},
"executing-plans":{k:"pskill",p:"superpowers",
 intro:"在当前会话里亲自按计划一步步做。",
 when:"计划不复杂，你想看着它做、随时能插话。",
 how:[["调用","/executing-plans"]],
 pair:[["writing-plans","上游"]],
 rel:[["subagent-driven-development","任务能拆开时它更快"]],
 note:"",
},
"subagent-driven-development":{k:"pskill",p:"superpowers",
 intro:"把计划里的独立任务派给子代理，各自并行干活。",
 when:"计划里的步骤之间没有依赖。",
 how:[["调用","/subagent-driven-development"]],
 pair:[["dispatching-parallel-agents","更纯粹的分派技能"]],
 rel:[["executing-plans","任务必须串行时用它"]],
 note:"子代理看不到你的对话上下文，所以每个任务的描述都得自带足够信息。",
},
"dispatching-parallel-agents":{k:"pskill",p:"superpowers",
 intro:"把两个以上互不依赖的任务同时派出去。",
 when:"比如「同时查三个仓库」「并行审五个文件」。",
 how:[["调用","/dispatching-parallel-agents"]],
 pair:[],
 rel:[["subagent-driven-development","把它嵌进计划执行流程"]],
 note:"适合研究型、可切分的任务。有共享状态的活儿别拆。",
},
"test-driven-development":{k:"pskill",p:"superpowers",
 intro:"先写测试，再写实现。",
 when:"改核心逻辑、修 bug，或希望这次改动以后有回归保护。",
 how:[["调用","/test-driven-development"]],
 pair:[["verification-before-completion","做完之后证明它真的对"]],
 rel:[["pr-test-analyzer","审测试覆盖质量"]],
 note:"",
},
"systematic-debugging":{k:"pskill",p:"superpowers",
 intro:"结构化排障：先定位根因，再动手改。禁止先猜一个改法试试看。",
 when:"任何 bug、测试失败、或行为不符合预期时。",
 how:[["调用","/systematic-debugging"]],
 pair:[["verification-before-completion","修完后验证"]],
 rel:[["silent-failure-hunter","查被吞掉的错误"]],
 note:"它会明确反对「先加上试试看」这种改法，这正是它存在的理由。",
},
"verification-before-completion":{k:"pskill",p:"superpowers",
 intro:"在说「做完了」之前，强制跑一遍验证命令并贴出结果。",
 when:"我准备告诉你改完了的时候。这个技能就是防我吹牛的。",
 how:[["调用","/verification-before-completion"]],
 pair:[["test-driven-development","有测试才有得验证"]],
 rel:[["testing-reality-checker","更狠的验收代理"]],
 note:"",
},
"requesting-code-review":{k:"pskill",p:"superpowers",
 intro:"主动发起代码评审。",
 when:"一个功能或大改动完成、准备合并前。",
 how:[["调用","/requesting-code-review"]],
 pair:[["pr-review-toolkit","六个专职评审代理"]],
 rel:[["receiving-code-review","拿到意见之后怎么办"]],
 note:"",
},
"receiving-code-review":{k:"pskill",p:"superpowers",
 intro:"拿到评审意见后的处理规范：要技术严谨地判断，不盲从也不敷衍。",
 when:"收到评审反馈、准备照着改之前。",
 how:[["调用","/receiving-code-review"]],
 pair:[["requesting-code-review","上游"]],
 rel:[],
 note:"它要求对不清楚或技术上可疑的意见先质疑，而不是点头就改。",
},
"finishing-a-development-branch":{k:"pskill",p:"superpowers",
 intro:"实现完成、测试通过后，决定这段工作怎么合入。",
 when:"分支做完了，要收尾时。",
 how:[["调用","/finishing-a-development-branch"]],
 pair:[["commit-push-pr","直接走提交加 PR 也行"]],
 rel:[],
 note:"",
},
"using-git-worktrees":{k:"pskill",p:"superpowers",
 intro:"用 git worktree 开一个隔离工作区。",
 when:"手上还有未提交的改动，但想同时开工另一件事。",
 how:[["调用","/using-git-worktrees"]],
 pair:[],
 rel:[["engineering-git-workflow-master","Git 流程专家"]],
 note:"",
},
"using-superpowers":{k:"pskill",p:"superpowers",
 intro:"元技能：说明什么时候该用哪个 superpowers 技能。",
 when:"面对一堆技能不知道从哪下手时。",
 how:[["调用","/using-superpowers"]],
 pair:[],
 rel:[["diagnosing-superpowers","用砸了之后怎么复盘"]],
 note:"",
},
"writing-skills":{k:"pskill",p:"superpowers",
 intro:"写技能这件事本身的规范。",
 when:"要新建或修改技能时。",
 how:[["调用","/writing-skills"]],
 pair:[["skill-creator","你本机那份，含打包脚本"]],
 rel:[],
 note:"",
},
"diagnosing-superpowers":{k:"pskill",p:"superpowers",
 intro:"复盘「这次为什么没用好」：重复劳动、忽略计划、技能没触发、耗时超预算。",
 when:"感觉某次协作特别别扭、特别慢，想知道原因。",
 how:[["调用","/diagnosing-superpowers"]],
 pair:[],
 rel:[["using-superpowers","先看该用哪个技能"]],
 note:"",
},

/* ---- claude-mem 技能 ---- */
"mem-search":{k:"pskill",p:"claude-mem",
 intro:"在历史会话记忆里全文搜索。",
 when:"「这个我们之前是不是弄过？」的时刻。",
 how:[["调用","/mem-search"],["口头","「上次我们怎么解决 X 的」"]],
 pair:[["smart-explore","查代码用那个"]],
 rel:[["how-it-works","想搞懂它的检索范围"]],
 note:"",
},
"learn-codebase":{k:"pskill",p:"claude-mem",
 intro:"把整个仓库逐文件读一遍灌进记忆，约 5 分钟。",
 when:"刚接手陌生项目，希望之后所有会话都有底。",
 how:[["调用","/learn-codebase"]],
 pair:[["make-plan","灌完再定计划"]],
 rel:[["engineering-codebase-onboarding-engineer","一次性读源码的代理"]],
 note:"大仓库会比较慢，也占存储。",
},
"how-it-works":{k:"pskill",p:"claude-mem",
 intro:"解释这套记忆系统怎么采集、什么时候注入、数据存在哪。",
 when:"想知道它到底记了你什么、隐私上是否放心。",
 how:[["调用","/how-it-works"]],
 pair:[],
 rel:[],
 note:"",
},
"smart-explore":{k:"pskill",p:"claude-mem",
 intro:"基于 tree-sitter 的结构化代码搜索，返回符号和签名，不返回全文。",
 when:"快速搞清楚一个文件或模块的结构，又不想读全文烧 token。",
 how:[["调用","说「用 smart-explore 看下这个文件」"]],
 pair:[["codegraph_explore","更完整的图谱视角"]],
 rel:[],
 note:"",
},
"knowledge-agent":{k:"pskill",p:"claude-mem",
 intro:"从历史观察里构建一个可查询的知识库。",
 when:"某个主题反复出现，想把过去所有相关记录整理成能问答的知识体。",
 how:[["调用","/knowledge-agent"]],
 pair:[["mem-search","先搜再建库"]],
 rel:[],
 note:"",
},
"make-plan":{k:"pskill",p:"claude-mem",
 intro:"生成分阶段实施计划，会自动检索相关历史文档。",
 when:"动手前先规划，且希望计划有历史依据。",
 how:[["调用","/make-plan"]],
 pair:[["do","执行它产出的计划"]],
 rel:[["writing-plans","superpowers 的版本，不检索历史"]],
 note:"",
},
"do":{k:"pskill",p:"claude-mem",
 intro:"用子代理执行 make-plan 产出的计划。",
 when:"计划已经写好，准备开工。",
 how:[["调用","/do"]],
 pair:[["make-plan","上游"]],
 rel:[["executing-plans","自己执行而不是派子代理"]],
 note:"",
},
"timeline-report":{k:"pskill",p:"claude-mem",
 intro:"把项目整个开发史写成叙事报告。",
 when:"要回顾一个项目怎么一步步长成现在这样。",
 how:[["调用","/timeline-report"]],
 pair:[["weekly-digests","按周切分的版本"]],
 rel:[],
 note:"",
},
"weekly-digests":{k:"pskill",p:"claude-mem",
 intro:"按 ISO 周切分，每周一章，生成连载式项目史。",
 when:"项目跨度长，想按时间线读完整个历程。",
 how:[["调用","/weekly-digests"]],
 pair:[["timeline-report","单篇长报告的版本"]],
 rel:[],
 note:"",
},
"pathfinder":{k:"pskill",p:"claude-mem",
 intro:"画出功能流程图，找出重复的关注点，提出统一架构。",
 when:"代码里有几套相似但各写各的逻辑，想收敛它们。",
 how:[["调用","/pathfinder"]],
 pair:[["codegraph","图谱视角交叉验证"]],
 rel:[],
 note:"",
},
"babysit":{k:"pskill",p:"claude-mem",
 intro:"持续盯一个 PR：评论、评审、CI，直到可以合并。",
 when:"PR 已提交，需要有人守着处理反馈。",
 how:[["调用","/babysit 然后给 PR 号"]],
 pair:[["review-pr","自己先审一遍"]],
 rel:[["loop","泛化的定时重复执行"]],
 note:"",
},
"oh-my-issues":{k:"pskill",p:"claude-mem",
 intro:"把一堆散乱的 GitHub issue 按根因聚类成少数几个计划。",
 when:"issue 堆到几十条，看着头大又不知道该先动哪个。",
 how:[["调用","/oh-my-issues"]],
 pair:[["gh","会用到 GitHub CLI"]],
 rel:[["product-feedback-synthesizer","从用户反馈角度归类"]],
 note:"",
},
"design-is":{k:"pskill",p:"claude-mem",
 intro:"按 Dieter Rams 的十条设计原则审计一个设计。",
 when:"想给现有 UI 一个不客气的专业批评。",
 how:[["调用","/design-is"]],
 pair:[["frontend-design","审完之后改"]],
 rel:[["testing-accessibility-auditor","无障碍是另一条线"]],
 note:"",
},
"wowerpoint":{k:"pskill",p:"claude-mem",
 intro:"把一份文档变成 kawaii 风格的幻灯片 PDF。",
 when:"要把报告转成能分享的幻灯。",
 how:[["调用","/wowerpoint 然后给文件路径"]],
 pair:[["pptx","需要正经 PPT 时用那个"]],
 rel:[],
 note:"",
},
"version-bump":{k:"pskill",p:"claude-mem",
 intro:"插件的语义化版本发布全流程：改版本号、构建、打 tag、发 GitHub release。",
 when:"你在维护自己的插件、要发新版。",
 how:[["调用","/version-bump"]],
 pair:[["plugin-authoring","改插件本身"]],
 rel:[],
 note:"",
},

/* ---- 其他插件技能 ---- */
"xlsx":{k:"pskill",p:"document-skills",
 intro:"Excel 与 CSV 的读写、计算、格式化、建图表。",
 when:"任何以表格文件为主要输入或产出的任务。",
 how:[["调用","直接描述任务，技能会自动触发"]],
 pair:[["dataviz","要往表里加图时"]],
 rel:[["docx","要的是 Word 而不是表格时"]],
 note:"处理脏数据、合并多表、按条件汇总这类活都归它。",
},
"docx":{k:"pskill",p:"document-skills",
 intro:"Word 文档的创建、编辑与模板套用，支持目录、页码、页眉页脚。",
 when:"要产出报告、备忘录、信函这类 Word 交付物。",
 how:[["调用","直接描述任务"]],
 pair:[],
 rel:[["pdf","最终要 PDF 时"]],
 note:"",
},
"pptx":{k:"pskill",p:"document-skills",
 intro:"PPT 演示文稿的创建与编辑，含版式、演讲者备注、批注。",
 when:"要做幻灯片或改现有 deck 时。",
 how:[["调用","直接描述任务"]],
 pair:[["wowerpoint","想要另一种风格时"]],
 rel:[],
 note:"",
},
"pdf":{k:"pskill",p:"document-skills",
 intro:"PDF 的读取、合并、拆分、旋转、加水印、填表单、OCR。",
 when:"任何跟 PDF 打交道的活。",
 how:[["调用","直接描述任务"]],
 pair:[],
 rel:[["docx","需要可编辑的源文件时"]],
 note:"",
},
"karpathy-guidelines":{k:"pskill",p:"andrej-karpathy-skills",
 intro:"编码行为准则：别过度设计、别乱抽象、别不验证就宣布完成。",
 when:"希望我保持克制时。被动生效。",
 how:[["调用","/karpathy-guidelines"]],
 pair:[["engineering-minimal-change-engineer","同一理念的代理"]],
 rel:[["simplify","收尾清理"]],
 note:"",
},

/* ---- 内置技能 ---- */
"code-review":{k:"bskill",
 intro:"审当前 diff、PR 或分支，重点找正确性 bug。",
 when:"改完代码要过一遍时。",
 how:[["调用","/code-review"],["带强度","/code-review high"],["指定目标","/code-review <PR号>"]],
 pair:[["simplify","只做质量清理不查 bug"],["security-review","安全是另一条线"]],
 rel:[["review-pr","插件版，六个专职代理"]],
 note:"",
},
"simplify":{k:"bskill",
 intro:"只做质量优化：复用、简化、效率、抽象层级。不查 bug。",
 when:"功能已经对了，但代码写得笨重。",
 how:[["调用","/simplify"]],
 pair:[["code-review","正确性交给它"]],
 rel:[["engineering-minimal-change-engineer","少写代码的另一种思路"]],
 note:"它明确声明不猎 bug，别指望它替代 code-review。",
},
"security-review":{k:"bskill",
 intro:"对当前分支未提交的改动做完整安全审查。",
 when:"提交前，尤其碰了鉴权、输入处理、外部请求的代码。",
 how:[["调用","/security-review"]],
 pair:[["security-guidance","它会自动跑后台复审"]],
 rel:[],
 note:"",
},
"dataviz":{k:"bskill",
 intro:"图表与仪表盘的设计规范：配色、坐标轴、图例、明暗色一致性。",
 when:"写任何图表代码之前，不管用什么库、什么输出格式。",
 how:[["调用","说「按 dataviz 规范做这个图」"]],
 pair:[["frontend-design","图表是页面的一部分时"]],
 rel:[],
 note:"这是少数几个「必须先读再写」型技能。不读就容易做出难看或配色不可访问的图。",
},
"init":{k:"bskill",
 intro:"为当前项目生成一份 CLAUDE.md。",
 when:"新项目第一次接进来，想留下项目级约定。",
 how:[["调用","/init"]],
 pair:[["update-config","配权限与环境变量"]],
 rel:[],
 note:"",
},
"run":{k:"bskill",
 intro:"启动并驱动本项目的应用，确认改动真的生效。",
 when:"前端或服务的改动做完，想实际跑一遍验证。",
 how:[["调用","/run"]],
 pair:[["playwright","需要点界面时更细"]],
 rel:[],
 note:"会优先找项目里已有的启动方式，找不到才按类型猜。",
},
"update-config":{k:"bskill",
 intro:"改 settings.json：权限白名单、环境变量、hooks。",
 when:"想让某类命令别再弹窗；想加环境变量；想挂自动化钩子。",
 how:[["调用","/update-config"]],
 pair:[["fewer-permission-prompts","自动生成白名单"]],
 rel:[],
 note:"值得注意的是：希望「每次 X 就自动做 Y」这类需求只能靠 hooks 实现，写进规则文件是没用的。",
},
"keybindings-help":{k:"bskill",
 intro:"自定义 Claude Code 的快捷键。",
 when:"默认键位不顺手时。",
 how:[["调用","/keybindings-help"]],
 pair:[],
 rel:[],
 note:"",
},
"fewer-permission-prompts":{k:"bskill",
 intro:"扫一遍历史，把常用的只读命令自动加进白名单，减少弹窗。",
 when:"被权限确认烦到的时候。",
 how:[["调用","/fewer-permission-prompts"]],
 pair:[["update-config","手动精调"]],
 rel:[],
 note:"",
},
"loop":{k:"bskill",
 intro:"按间隔重复执行某个 prompt 或斜杠命令。",
 when:"要轮询某个状态，或周期性重复一件事。",
 how:[["固定间隔","/loop 5m /some-command"],["不定间隔","/loop 让我持续盯着这个"]],
 pair:[["babysit","专门盯 PR 的版本"]],
 rel:[],
 note:"循环任务有 7 天上限，到期会自己停。",
},
"claude-api":{k:"bskill",
 intro:"Claude API 与 SDK 参考：模型 ID、定价、参数、流式、工具调用、上下文缓存。",
 when:"写调用 Anthropic API 的代码，或要以编程方式调 Claude。",
 how:[["调用","/claude-api"]],
 pair:[],
 rel:[],
 note:"涉及模型选型、计价、缓存这类问题别凭记忆答，让它现读这个技能。",
},
"plugin-authoring":{k:"bskill",
 intro:"开发 Claude 自身界面改造：面板、状态栏、提示框、hooks 模块。",
 when:"想给 Claude Code 加一个自己的界面元素或钩子行为。",
 how:[["调用","/plugin-authoring"]],
 pair:[["skill-creator","做的是技能而非界面时"]],
 rel:[],
 note:"",
},
"workflow-authoring":{k:"bskill",
 intro:"编写 Workflow 工具脚本的参考——多代理编排那套。",
 when:"要用 Workflow 编排多个子代理时。",
 how:[["调用","/workflow-authoring"]],
 pair:[["dispatching-parallel-agents","轻量并行用那个"]],
 rel:[],
 note:"Workflow 会同时拉起一批代理，开销比普通子代理大得多，别随手用。",
},

/* ---- 命令 ---- */
"commit":{k:"cmd",p:"commit-commands",
 intro:"把当前改动提交为一个 commit。",
 when:"改完代码要提交时。",
 how:[["调用","/commit"]],
 pair:[["simplify","提交前先清理代码"],["security-review","提交前先扫安全"]],
 rel:[["commit-push-pr","要一步走完就用它"],["clean-gone","顺手清理分支"]],
 note:"它的 prompt 里限定了只用 git 命令，不会顺手做别的事。提交信息要按你仓库的风格写。",
},
"commit-push-pr":{k:"cmd",p:"commit-commands",
 intro:"提交加推送加开 PR，一条命令走完。",
 when:"改动完整、要直接推到远端发起评审。",
 how:[["调用","/commit-push-pr"]],
 pair:[["review-pr","开完 PR 让它来审"],["babysit","让它持续盯着"]],
 rel:[],
 note:"推送是外部可见操作。它会先给你看远端、分支和变更摘要再动手。",
},
"clean-gone":{k:"cmd",p:"commit-commands",
 intro:"清理远端已删除、本地还留着的分支，含对应的 worktree。",
 when:"分支合完后本地列表越来越乱。",
 how:[["调用","/clean_gone"]],
 pair:[],
 rel:[["engineering-git-workflow-master","分支策略专家"]],
 note:"会删本地分支，属破坏性操作。执行前会先让你确认。",
},
"review-pr":{k:"cmd",p:"pr-review-toolkit",
 intro:"用六个专职代理做一次全面的 PR 评审。",
 when:"PR 已开、想系统过一遍。",
 how:[["调用","/review-pr"],["附 PR 号","/review-pr 123"]],
 pair:[["babysit","让它持续盯着反馈"]],
 rel:[["code-review","内置的轻量版本"]],
 note:"",
},

/* ---- MCP ---- */
"codegraph":{k:"mcp",
 intro:"代码知识图谱。把仓库里每个符号和每条调用边建成 SQLite 索引，查询是亚毫秒级。",
 when:"跨文件理解代码、查调用链、评估改动影响面时。",
 how:[["前提","项目里要有 .codegraph/ 索引目录"],["用法","让我「用 codegraph 查一下 XX 的流程」"]],
 pair:[["smart-explore","token 更省的另一种探索"]],
 rel:[["codegraph_impact","改之前先看影响面"]],
 note:"没有索引的目录调用会直接报错。当前 skillWeb 目录就没有索引，所以在这里用不了。",
},
"codegraph_explore":{k:"mcp",p:"codegraph",
 intro:"CodeGraph 的主力工具：给一句话或一组符号名，返回相关符号的完整源码以及它们之间的调用路径。",
 when:"问「X 是怎么走到 Y 的」「这个功能在哪实现」。",
 how:[["用法","让我「用 codegraph 查一下 XX 的流程」"]],
 pair:[["codegraph_impact","改之前先看影响面"]],
 rel:[["codegraph_callers","只看谁调用了它"]],
 note:"一次调用通常就够，不需要再 grep 一遍验证——结果来自完整 AST 解析。",
},
"codegraph_search":{k:"mcp",p:"codegraph",
 intro:"按名字快速定位符号，只返回位置和签名。",
 when:"知道叫什么、只想找到它在哪。",
 how:[["用法","让我「找一下 XX 定义在哪」"]],pair:[],rel:[["codegraph_node","要完整定义体"]],note:"",
},
"codegraph_node":{k:"mcp",p:"codegraph",
 intro:"取单个符号的完整定义。名字有重载时会一次返回所有匹配版本。",
 when:"explore 返回的代码被截断，需要看完整函数体。",
 how:[["用法","让我「看下 XX 的完整实现」"]],pair:[],rel:[["codegraph_explore","一次看一批符号"]],note:"",
},
"codegraph_callers":{k:"mcp",p:"codegraph",
 intro:"列出所有调用某个函数的函数。",
 when:"想搞清楚「谁在用这个」。",
 how:[["用法","让我「查一下谁调用了 XX」"]],pair:[],rel:[["codegraph_impact","要的是完整波及面"]],note:"",
},
"codegraph_impact":{k:"mcp",p:"codegraph",
 intro:"列出改动某个符号会波及到的所有符号。",
 when:"重构之前必查。",
 how:[["用法","让我「改 XX 会影响到什么」"]],pair:[],
 rel:[["codegraph_callers","只想看直接调用者"]],
 note:"波及面这个答案只有 impact 给得出，手动顺着 callers 往上爬容易漏。",
},
"codegraph_files":{k:"mcp",p:"codegraph",
 intro:"列出索引内的文件树，带语言和符号数量。",
 when:"想先看一眼项目规模和组织方式。",
 how:[["用法","让我「用 codegraph 列一下文件」"]],pair:[],rel:[],note:"比 glob 快。",
},
"codegraph_status":{k:"mcp",p:"codegraph",
 intro:"检查索引健康度：文件数、节点数、边数。",
 when:"怀疑索引过期，或 codegraph 行为异常。",
 how:[["用法","让我「看下 codegraph 索引状态」"]],pair:[],rel:[],note:"",
},
"memory":{k:"mcp",
 intro:"一个通用的知识图谱记忆服务器：实体、关系、观察。",
 when:"要跨会话维护结构化事实。",
 how:[["读","read_graph、search_nodes、open_nodes"],["写","create_entities、create_relations、add_observations"]],
 pair:[["claude-mem","自动记忆与手动图谱是两套东西"]],
 rel:[],
 note:"当前这个图谱是空的，没有任何实体。它和 claude-mem 是两套独立系统，别混淆。",
},
"create_entities":{k:"mcp",p:"memory",
 intro:"在知识图谱里创建实体，并建立它们之间的关系。",
 when:"想手动把一组事实固化下来给以后的会话用。",
 how:[["用法","让我「记进 memory 图谱里」"]],pair:[],rel:[["add_observations","给已有实体追加观察"]],note:"",
},
"add_observations":{k:"mcp",p:"memory",
 intro:"给已存在的实体追加观察条目。",
 when:"实体已经在图谱里，只想补充新事实。",
 how:[["用法","让我「把这个也记到 XX 下面」"]],pair:[],rel:[["create_entities","实体还不存在时先建"]],note:"",
},
"search_nodes":{k:"mcp",p:"memory",
 intro:"按关键词搜索图谱里的节点。",
 when:"想查之前往图谱里记了什么。",
 how:[["用法","让我「从 memory 图谱里查一下 XX」"]],pair:[],rel:[["claude-mem","更常用的记忆检索在那边"]],note:"",
},
"delete_entities":{k:"mcp",p:"memory",
 intro:"删除实体及其关联的关系。",
 when:"图谱里有过期或记错的内容。",
 how:[["用法","让我「把 XX 从图谱里删掉」"]],pair:[],rel:[],
 note:"删除同时会带走所有关联关系，不可恢复。",
},
"mcp-search":{k:"mcp",p:"claude-mem",
 intro:"claude-mem 自带的 MCP 服务器，提供记忆检索和结构化代码搜索。",
 when:"我要查历史观察或做省 token 的代码探索时。",
 how:[["三层检索","search 拿索引，timeline 看上下文，get_observations 取详情"]],
 pair:[["smart-explore","同一插件里的代码搜索"]],
 rel:[["memory","另一套独立的知识图谱"]],
 note:"三层走法的意义是省 token：先拿索引过滤，只对真正关心的几条取全文。",
},
"search":{k:"mcp",p:"claude-mem mcp-search",
 intro:"记忆检索第一层，返回带 ID 的索引，每条约 50 到 100 token。",
 when:"想知道历史里有哪些相关内容。",
 how:[["用法","让我「搜一下历史里关于 XX 的记录」"]],
 pair:[["get_observations","第二三层取详情"]],
 rel:[["observation_search","跳过索引直接全文检索"]],
 note:"别跳过第一层直接取详情，那样会浪费大量 token。",
},
"smart_search":{k:"mcp",p:"claude-mem mcp-search",
 intro:"树解析级的代码搜索，返回结构化的折叠视图。",
 when:"想在不读全文的前提下理解代码结构。",
 how:[["用法","让我「用 smart_search 找一下 XX」"]],pair:[],rel:[["smart_outline","已知文件路径时更直接"]],note:"",
},
"observation_search":{k:"mcp",p:"claude-mem mcp-search",
 intro:"对历史观察做全文检索。",
 when:"记得大概内容但不知道关键词。",
 how:[["用法","让我「在观察记录里搜 XX」"]],pair:[],rel:[["search","先走索引更省"]],note:"",
},
"build_corpus":{k:"mcp",p:"claude-mem mcp-search",
 intro:"把筛选出的观察构建成一个可查询的知识库。",
 when:"某个主题反复出现，想做成一个能持续问答的专业知识体。",
 how:[["用法","/knowledge-agent 或让我「给 XX 建个语料库」"]],
 pair:[["query_corpus","建完之后提问"]],
 rel:[],
 note:"",
},

/* ---- 内置与插件的子代理 ---- */
"claude":{k:"bagent",intro:"通用兜底代理，什么活都能接。",when:"没有更合适的专职代理时。",how:[["用法","让我「派个子代理去做」"]],pair:[],rel:[["general-purpose","更偏研究型"]],note:""},
"general-purpose":{k:"bagent",intro:"复杂多步研究、跨文件搜索、批量任务。",when:"要在多个文件里反复找东西、或做开放式调研。",how:[["用法","让我「派个 general-purpose 去查」"]],pair:[],rel:[["Explore","只读定位更轻"]],note:""},
"Explore":{k:"bagent",intro:"只读快速定位代码：找文件、找符号、回答「X 在哪」。",when:"只需要定位，不需要评审或分析。",how:[["用法","让我「用 Explore 找一下」"]],pair:[],rel:[["codegraph_search","有索引时更快"]],note:"它只读片段，不做跨文件一致性审计——那类活别派给它。"},
"Plan":{k:"bagent",intro:"设计实现方案。",when:"需要一份架构级的实施计划。",how:[["用法","让我「用 Plan 设计一下」"]],pair:[],rel:[["writing-plans","更偏流程的技能版"]],note:""},
"claude-code-guide":{k:"bagent",intro:"回答 Claude Code、Agent SDK、Claude API 的使用问题。",when:"想问我关于 Claude Code 本身的功能怎么用。",how:[["用法","让我「用 claude-code-guide 查一下」"]],pair:[],rel:[["claude-api","API 细节参考"]],note:"涉及本工具的用法问题时，它比我凭记忆答更靠谱。"},
"statusline-setup":{k:"bagent",intro:"配置 Claude Code 的状态栏。",when:"想定制状态栏显示内容。",how:[["用法","让我「改一下状态栏」"]],pair:[],rel:[["update-config","改其他配置"]],note:""},
"code-explorer":{k:"pagent",p:"feature-dev",intro:"深度分析现有功能，追踪执行路径，理解代码库结构与约定。",when:"接手一块不熟悉的代码，想先摸清它怎么运作。",how:[["用法","/feature-dev 流程里自动调用"]],pair:[],rel:[["Explore","轻量版定位"]],note:""},
"code-architect":{k:"pagent",p:"feature-dev",intro:"设计功能架构，给出具体文件与组件级的实现蓝图。",when:"需求清楚了，要落到「改哪些文件、怎么改」。",how:[["用法","/feature-dev 流程里自动调用"]],pair:[],rel:[["Plan","通用规划代理"]],note:""},
"code-reviewer":{k:"pagent",p:"feature-dev 与 pr-review-toolkit",intro:"按项目规范评审代码，找 bug、安全和质量问题。",when:"要一次有重点的代码评审。",how:[["用法","/review-pr 或让我「派 code-reviewer 审这段」"]],pair:[["silent-failure-hunter","专查静默失败"]],rel:[["code-review","技能版，更轻"]],note:"feature-dev 和 pr-review-toolkit 各有一个同名代理，侧重点略有不同。"},
"code-simplifier":{k:"pagent",p:"pr-review-toolkit",intro:"简化代码，保持功能不变。",when:"改完一版之后想让代码更清爽。",how:[["用法","让我「用 code-simplifier 过一遍」"]],pair:[],rel:[["simplify","技能版"]],note:""},
"comment-analyzer":{k:"pagent",p:"pr-review-toolkit",intro:"审查注释的准确性、完整性与长期可维护性。",when:"大量写了注释或文档字符串之后。",how:[["用法","让我「用 comment-analyzer 查注释」"]],pair:[],rel:[],note:"专治注释与代码对不上、以及会随代码腐烂的注释。"},
"pr-test-analyzer":{k:"pagent",p:"pr-review-toolkit",intro:"审查测试覆盖的质量与完整性。",when:"PR 带着新测试，想知道测够了没有。",how:[["用法","让我「用 pr-test-analyzer 看测试」"]],pair:[],rel:[["test-driven-development","先把测试写对"]],note:""},
"silent-failure-hunter":{k:"pagent",p:"pr-review-toolkit",intro:"猎捕静默失败、不充分的错误处理、以及不恰当的兜底逻辑。",when:"代码里有 try-catch、降级逻辑、默认值时。",how:[["用法","让我「用 silent-failure-hunter 看这段」"]],pair:[],rel:[["systematic-debugging","查到之后怎么修"]],note:"这个代理在别处很少见，专治「出错了但没人知道」。"},
"type-design-analyzer":{k:"pagent",p:"pr-review-toolkit",intro:"分析类型设计：封装、不变量表达、可用性、约束强度。",when:"引入新类型，或重构已有类型。",how:[["用法","让我「用 type-design-analyzer 看这几个类型」"]],pair:[],rel:[],note:""},

};

/* ---- 216 个子代理的「何时用」 ---- */
const AWHEN = {
"academic-anthropologist":"构建有生活气息、文化上自洽的社会设定时",
"academic-geographer":"要让地形、气候、资源分布科学合理时",
"academic-historian":"需要校验时代细节与物质文化是否失真时",
"academic-narratologist":"分析或设计故事结构与人物弧线时",
"academic-psychologist":"要设计可信的角色动机与互动时",
"academic-study-planner":"制定考研考公等重大考试的备考计划时",
"accounts-payable-agent":"要批量执行供应商付款与定期账单时",
"agentic-identity-trust":"给自主智能体设计身份认证与授权时",
"agents-orchestrator":"要端到端编排整条开发流水线时",
"automation-governance-architect":"上自动化之前先审价值与风险时",
"blender-addon-engineer":"要把重复的 Blender 操作固化成插件时",
"blockchain-security-auditor":"合约上线前做安全审计时",
"compliance-auditor":"准备 SOC 2 或 ISO 27001 认证时",
"corporate-training-designer":"搭企业培训体系或开发课程时",
"data-consolidation-agent":"要把销售数据汇总成实时看板时",
"design-brand-guardian":"需要统一品牌调性与一致性时",
"design-image-prompt-engineer":"要写专业的 AI 图像提示词时",
"design-inclusive-visuals-specialist":"检查生成图像是否带有偏见时",
"design-ui-designer":"要从零设计一套界面视觉系统时",
"design-ux-architect":"要搭 CSS 体系与布局框架时",
"design-ux-researcher":"需要可用性测试与用户行为洞察时",
"design-visual-storyteller":"要把复杂信息做成视觉故事时",
"design-whimsy-injector":"产品太严肃、想加点个性细节时",
"engineering-ai-data-remediation-engineer":"数据管道出了坏数据但不能停机时",
"engineering-ai-engineer":"从数据处理到模型上线要走全链路时",
"engineering-autonomous-optimization-architect":"要持续优化 API 又怕成本失控时",
"engineering-backend-architect":"设计服务端架构与 API 时",
"engineering-cms-developer":"做 Drupal 或 WordPress 站点时",
"engineering-code-reviewer":"想让代码被严格审一遍时",
"engineering-codebase-onboarding-engineer":"刚接手一个陌生代码库时",
"engineering-data-engineer":"搭 ETL 与湖仓管道时",
"engineering-database-optimizer":"查询变慢、索引设计要调整时",
"engineering-devops-automator":"写 CI/CD 与基础设施自动化时",
"engineering-dingtalk-integration-developer":"做钉钉机器人或审批流时",
"engineering-email-intelligence-engineer":"要从邮件线程里抽结构化数据时",
"engineering-embedded-firmware-engineer":"写 ESP32、STM32 裸机或 RTOS 时",
"engineering-embedded-linux-driver-engineer":"写内核驱动或 BSP 时",
"engineering-feishu-integration-developer":"做飞书机器人或多维表格时",
"engineering-filament-optimization-specialist":"要重构 Filament 后台管理界面时",
"engineering-fpga-digital-design-engineer":"写 Verilog 或做时序收敛时",
"engineering-frontend-developer":"写 React、Vue 前端时",
"engineering-git-workflow-master":"要规范分支、提交与 rebase 时",
"engineering-incident-response-commander":"线上出事、需要有人指挥时",
"engineering-iot-solution-architect":"设计设备接入与边缘计算方案时",
"engineering-mechanical-design-engineer":"做机械结构设计与出图时",
"engineering-minimal-change-engineer":"怕改动范围失控、只想改该改的时",
"engineering-mobile-app-builder":"写 iOS 或 Android 应用时",
"engineering-pc-host-engineer":"写 Qt 上位机或对接工业协议时",
"engineering-rapid-prototyper":"要最快跑通一个 MVP 时",
"engineering-security-engineer":"做威胁建模与安全代码审查时",
"engineering-senior-developer":"写 Laravel、Livewire 项目时",
"engineering-software-architect":"需要系统级架构决策时",
"engineering-solidity-smart-contract-engineer":"写 EVM 合约或优化 Gas 时",
"engineering-sre":"要定 SLO、做可观测性时",
"engineering-technical-writer":"写 API 文档与 README 时",
"engineering-threat-detection-engineer":"写 SIEM 规则、映射 ATT&CK 覆盖时",
"engineering-voice-ai-integration-engineer":"做语音转录与字幕流水线时",
"engineering-wechat-mini-program-developer":"写微信小程序时",
"finance-bookkeeper-controller":"做月末结账与对账时",
"finance-financial-analyst":"建财务模型与做预测时",
"finance-financial-forecaster":"要预测现金流与烧钱率时",
"finance-fpa-analyst":"做预算编制与差异分析时",
"finance-fraud-detector":"设计交易反欺诈规则时",
"finance-investment-researcher":"做尽职调查与资产估值时",
"finance-invoice-manager":"管理发票与三单匹配时",
"finance-tax-strategist":"做税务优化与多辖区合规时",
"game-audio-engineer":"接 FMOD 或 Wwise 做交互音频时",
"game-designer":"写 GDD 或调游戏经济平衡时",
"gaokao-college-advisor":"填高考志愿、做冲稳保策略时",
"godot-gameplay-scripter":"写 GDScript 玩法逻辑时",
"godot-multiplayer-engineer":"做 Godot 联机时",
"godot-shader-developer":"写 Godot 着色器时",
"government-digital-presales-consultant":"投政务信息化项目、写标书时",
"healthcare-customer-service":"做患者支持与预约转接时",
"healthcare-marketing-compliance":"审医疗健康类营销内容时",
"hospitality-guest-services":"做酒店预订与宾客服务时",
"hr-onboarding":"搭新人入职流程时",
"hr-performance-reviewer":"做绩效评估与校准会时",
"hr-recruiter":"做招聘渠道运营与简历筛选时",
"identity-graph-operator":"多智能体共享身份数据、要保一致时",
"language-translator":"做西班牙语与英语互译时",
"legal-billing-time-tracking":"律所计费与工时记录管理时",
"legal-client-intake":"律所接案与利益冲突筛查时",
"legal-contract-reviewer":"审商业合同的风险条款时",
"legal-document-review":"审合同、诉讼与不动产文书时",
"legal-policy-writer":"写隐私政策与内部制度文件时",
"level-designer":"设计关卡布局与节奏时",
"livestock-archive-auditor":"核对养殖档案与生产日报时",
"loan-officer-assistant":"处理信贷预审与过户协调时",
"lsp-index-engineer":"搭 LSP 语义索引系统时",
"macos-spatial-metal-engineer":"写 Swift 与 Metal 的 3D 渲染时",
"marketing-agentic-search-optimizer":"想让 AI 能直接在你网站完成任务时",
"marketing-ai-citation-strategist":"想让品牌被 AI 更多引用时",
"marketing-app-store-optimizer":"做应用商店优化时",
"marketing-baidu-seo-specialist":"做百度搜索优化时",
"marketing-bilibili-strategist":"运营 B 站账号时",
"marketing-book-co-author":"要把素材与笔记整理成书稿时",
"marketing-carousel-growth-engine":"要批量产出轮播图并自动发布时",
"marketing-china-ecommerce-operator":"运营淘宝、天猫、拼多多、京东时",
"marketing-china-market-localization-strategist":"为品牌做中国市场本地化时",
"marketing-content-creator":"做多平台内容策划时",
"marketing-cross-border-ecommerce":"做出海电商运营时",
"marketing-daily-news-briefing":"要每天的结构化新闻简报时",
"marketing-douyin-strategist":"做抖音内容与直播时",
"marketing-ecommerce-operator":"做电商店铺运营与大促策划时",
"marketing-growth-hacker":"要找低成本获客实验时",
"marketing-instagram-curator":"运营 Instagram 时",
"marketing-knowledge-commerce-strategist":"做知识付费产品时",
"marketing-kuaishou-strategist":"运营快手时",
"marketing-linkedin-content-creator":"做 LinkedIn 个人品牌时",
"marketing-livestream-commerce-coach":"要提升直播间转化时",
"marketing-podcast-strategist":"运营播客节目时",
"marketing-private-domain-operator":"搭企业微信私域体系时",
"marketing-reddit-community-builder":"在 Reddit 建立长期口碑时",
"marketing-seo-specialist":"做 SEO 技术优化与外链时",
"marketing-short-video-editing-coach":"剪辑短视频时",
"marketing-social-media-strategist":"做社媒整合营销时",
"marketing-tiktok-strategist":"做 TikTok 内容时",
"marketing-twitter-engager":"做 Twitter 实时互动时",
"marketing-video-optimization-specialist":"优化 YouTube 视频留存时",
"marketing-wechat-official-account":"管理公众号内容时",
"marketing-wechat-operator":"运营公众号私域时",
"marketing-weibo-strategist":"运营微博与舆情管理时",
"marketing-weixin-channels-strategist":"运营微信视频号时",
"marketing-xiaohongshu-operator":"做小红书种草获客时",
"marketing-xiaohongshu-specialist":"做小红书内容时",
"marketing-zhihu-strategist":"在知乎建设品牌权威时",
"narrative-designer":"设计分支对话与世界观时",
"paid-media-auditor":"系统审计广告账户时",
"paid-media-creative-strategist":"写广告文案与设计素材时",
"paid-media-paid-social-strategist":"投 Meta 或 LinkedIn 广告时",
"paid-media-ppc-strategist":"管 Google、Microsoft、Amazon Ads 账户时",
"paid-media-programmatic-buyer":"做程序化采买与 ABM 投放时",
"paid-media-search-query-analyst":"分析搜索词、加否定关键词时",
"paid-media-tracking-specialist":"做转化追踪与归因时",
"product-behavioral-nudge-engine":"想提升用户的行动转化率时",
"product-feedback-synthesizer":"要把用户反馈变成改进项时",
"product-manager":"做产品规划与上市策略时",
"product-sprint-prioritizer":"排 Sprint 优先级时",
"product-trend-researcher":"要判断未来 6 到 18 个月的方向时",
"project-management-experiment-tracker":"管 A/B 测试与实验时",
"project-management-jira-workflow-steward":"规范 Jira 与 Git 的联动时",
"project-management-project-shepherd":"做跨部门项目协调时",
"project-management-studio-operations":"优化工作室日常流程与资源协调时",
"project-management-studio-producer":"管多项目组合与资源分配时",
"project-manager-senior":"要把规格拆成任务并控制范围时",
"prompt-engineer":"设计系统提示词时",
"real-estate-buyer-seller":"处理房产买卖与过户流程时",
"recruitment-specialist":"做招聘筛选与面试协调时",
"report-distribution-agent":"要定期分发销售报告时",
"retail-customer-returns":"处理退货换货与防欺诈时",
"roblox-avatar-creator":"做 Roblox UGC 虚拟形象物品时",
"roblox-experience-designer":"设计 Roblox 参与循环与变现时",
"roblox-systems-scripter":"写 Roblox 系统脚本时",
"sales-account-strategist":"做客户拓展与续约时",
"sales-coach":"要辅导销售团队时",
"sales-data-extraction-agent":"要从 Excel 提取销售指标时",
"sales-deal-strategist":"给大单做赢单规划时",
"sales-discovery-coach":"练 Discovery 提问技巧时",
"sales-engineer":"做售前技术方案与 POC 时",
"sales-outbound-strategist":"设计外呼触达序列时",
"sales-pipeline-analyst":"诊断 Pipeline 健康度时",
"sales-proposal-strategist":"写投标方案时",
"specialized-ai-policy-writer":"做 AI 治理与算法备案时",
"specialized-chief-of-staff":"需要有人帮你过滤噪音、路由决策时",
"specialized-civil-engineer":"做结构或岩土设计时",
"specialized-cultural-intelligence-strategist":"检查产品的跨文化适配时",
"specialized-developer-advocate":"做开发者社区与技术内容时",
"specialized-document-generator":"要生成 PDF、PPTX、DOCX 或 XLSX 时",
"specialized-french-consulting-market":"在法国接自由职业咨询项目时",
"specialized-korean-business-navigator":"和韩国团队或客户打交道时",
"specialized-mcp-builder":"要自己写一个 MCP 服务器时",
"specialized-meeting-assistant":"要会议纪要与行动项追踪时",
"specialized-model-qa":"要独立审计机器学习模型时",
"specialized-pricing-optimizer":"调电商定价与促销机制时",
"specialized-risk-assessor":"做国企风控与内控合规时",
"specialized-salesforce-architect":"做 Salesforce 方案设计时",
"specialized-workflow-architect":"要把流程画成可直接实现的规格时",
"study-abroad-advisor":"规划留学申请时",
"supply-chain-garment-factory-planning-engineer":"做服装工厂产线规划时",
"supply-chain-inventory-forecaster":"算安全库存与补货策略时",
"supply-chain-route-optimizer":"优化配送路线与物流成本时",
"supply-chain-strategist":"做采购战略与供应商开发时",
"supply-chain-vendor-evaluator":"评估与审核供应商时",
"support-analytics-reporter":"做数据看板与 KPI 跟踪时",
"support-executive-summary-generator":"要 C-level 级别的决策摘要时",
"support-finance-tracker":"做预算管理与经营分析时",
"support-infrastructure-maintainer":"要保系统稳定并降本时",
"support-legal-compliance-checker":"检查多辖区法规合规时",
"support-recruitment-specialist":"做招聘运营与劳动法合规时",
"support-support-responder":"处理客户支持与投诉时",
"technical-artist":"调 Shader、VFX 与资源优化时",
"technical-translator-agent":"翻译技术文档时",
"terminal-integration-specialist":"做终端模拟与文本渲染集成时",
"testing-accessibility-auditor":"按 WCAG 标准审无障碍时",
"testing-api-tester":"要全面验证 API 时",
"testing-embedded-qa-engineer":"做嵌入式 HIL 与可靠性测试时",
"testing-evidence-collector":"要让测试结论有完整证据链时",
"testing-performance-benchmarker":"做性能压测与容量规划时",
"testing-reality-checker":"想在验收前被泼盆冷水时",
"testing-test-results-analyzer":"要从测试数据提炼质量问题时",
"testing-tool-evaluator":"做工具选型对比时",
"testing-workflow-optimizer":"想消除流程瓶颈时",
"unity-architect":"设计 Unity 模块化架构时",
"unity-editor-tool-developer":"写 Unity 编辑器扩展时",
"unity-multiplayer-engineer":"做 Unity 联机时",
"unity-shader-graph-artist":"做 Unity 视觉效果时",
"unreal-multiplayer-architect":"做 Unreal 联机时",
"unreal-systems-engineer":"写 Unreal C++ 与 Blueprint 时",
"unreal-technical-artist":"做 Unreal 材质与特效时",
"unreal-world-builder":"搭 Unreal 开放世界时",
"visionos-spatial-engineer":"写 visionOS 空间应用时",
"xr-cockpit-interaction-specialist":"设计 XR 座舱交互时",
"xr-immersive-developer":"写 WebXR 或浏览器端 AR 应用时",
"xr-interface-architect":"设计空间界面与交互策略时",
"zk-steward":"建卡片盒风格的长期知识库时"
};

/* 由 AGENTS + AWHEN 生成 216 条简版详情 */
AGENTS.forEach(([file, cn, desc]) => {
  DETAIL[file] = {
    k:"uagent", title:cn, intro:desc,
    when: AWHEN[file] || "",
    how:[["调用方式", `用「${cn}」来做这件事，或在输入框打 @ 选择`, false]],
    pair:[], rel:[], note:""
  };
});


/* ============================================================
   渲染
   ============================================================ */

const doc = document.getElementById("doc");
const nav = document.getElementById("nav");
const rail = document.getElementById("rail");
const qEl = document.getElementById("q");
const resEl = document.getElementById("results");

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* 判断一段内容该用哪种样式 */
function clsOf(v){
  if(v.startsWith("/")) return "cmd";
  if(/[/\\]/.test(v) || /\.[a-z0-9]{1,5}$/i.test(v)) return "path";
  return "id";
}

/* 把命令、路径、标识符渲染成可区分、可点击复制的行内元素。
   已包裹的片段先换成占位符，避免后续规则二次匹配。 */
function idify(text){
  const stash = [];
  const keep = html => `\u0001${stash.push(html) - 1}\u0001`;
  const wrap = (cls, raw) => keep(
    `<span class="${cls}" data-copy="${raw}" title="点击复制">${raw}</span>`);

  let s = esc(text);

  /* 放行少量内联标签，其余一律当纯文本 */
  s = s.replace(/&lt;code&gt;([\s\S]*?)&lt;\/code&gt;/g, (m, a) => wrap(clsOf(a), a));
  s = s.replace(/&lt;(\/?)(b|em|strong)&gt;/g, "<$1$2>");

  /* 反引号包裹的按内容判类型 */
  s = s.replace(/`([^`]+)`/g, (m, a) => wrap(clsOf(a), a));

  /* 家目录、绝对路径、点开头的隐藏目录 */
  s = s.replace(/(~\/[^\s，。、）)「」\]]+)/g, (m, a) => wrap("path", a));
  s = s.replace(/(^|[\s（(「｜])(\/(?:Users|private|tmp|etc|var|opt)\/[^\s，。、）)「」\]]*)/g,
                (m, pre, a) => pre + wrap("path", a));
  s = s.replace(/(^|[\s（(「｜])(\.[a-z][a-z0-9-]*\/[^\s，。、）)「」\]]*)/g,
                (m, pre, a) => pre + wrap("path", a));
  /* 文件名 */
  s = s.replace(/(^|[\s（(「｜])(\.?[A-Za-z0-9_一-鿿-]+\.(?:md|json|js|css|html|py|ico|svg|ya?ml|tsx?|java|xml|toml|txt))\b/g,
                (m, pre, a) => pre + wrap("path", a));

  /* 斜杠命令 */
  s = s.replace(/(^|[\s（(「｜])(\/[a-z][a-z0-9-]{1,40})(?![\/\w-])/g,
                (m, pre, a) => pre + wrap("cmd", a));

  /* 余下的按标识符处理 */
  s = s.replace(/\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/g, (m, a) => wrap("id", a));
  s = s.replace(/\b([a-z]+(?:-[a-z0-9]+){1,})\b/g, (m, a) => wrap("id", a));

  return s.replace(/\u0001(\d+)\u0001/g, (m, i) => stash[Number(i)]);
}

/* 表格行 → 详情 key。返回 null 表示该行没有详情。 */
const QUICK_KEY = {
  "Playwright MCP":"playwright",
  "CodeGraph MCP":"codegraph",
  "document-skills 的 xlsx·docx·pptx·pdf":"xlsx"
};

function keyFor(secId, row){
  if(secId === "quick"){
    const raw = row[1];
    return QUICK_KEY[raw] || raw.split(" · ")[0].replace(/^\//,"").trim();
  }
  if(secId === "plugins" || secId === "skills" || secId === "agents") return row[0];
  if(secId === "mcp") return row[0].split(" / ")[0].trim();
  return null;
}

function renderBlock(b, secId){
  if(b.t === "h3") return `<h3>${esc(b.x)}</h3>`;
  if(b.t === "p")  return `<p>${idify(b.x)}</p>`;
  if(b.t === "ul") return `<ul class="plain">${b.items.map(i => `<li>${idify(i)}</li>`).join("")}</ul>`;
  if(b.t === "note") return `<div class="note">${idify(b.x)}</div>`;
  if(b.t === "agents") return `<div id="agentdir"></div>`;
  if(b.t === "table"){
    const head = b.head.map(h => `<th>${esc(h)}</th>`).join("");
    const rows = b.rows.map(r => {
      const tds = r.map((c,i) => {
        const cls = i === 0 ? "name" : (i === r.length - 1 && r.length > 2 ? "wide" : "");
        return `<td class="${cls}">${idify(c)}</td>`;
      }).join("");
      const k = keyFor(secId, r);
      return k ? `<tr data-key="${esc(k)}">${tds}</tr>` : `<tr>${tds}</tr>`;
    }).join("");
    return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
  }
  return "";
}

SECTIONS.forEach(sec => {
  const el = document.createElement("section");
  el.id = sec.id;
  el.innerHTML = `<h2 id="${sec.id}-h"><span class="num">${sec.num}</span>${esc(sec.title)}</h2>`
    + sec.blocks.map(b => renderBlock(b, sec.id)).join("");
  doc.appendChild(el);
});

/* 目录 */
nav.innerHTML = SECTIONS.map(s =>
  `<a href="#${s.id}" data-sec="${s.id}"><span class="n">${s.num}</span><span>${esc(s.title)}</span></a>`
).join("");

/* ---- 子代理目录 ---- */
const AGENT_PREFIX_MAP = {
  academic:"学术", accounts:"财务", agentic:"智能体", agents:"智能体", automation:"自动化",
  blender:"3D", blockchain:"区块链", compliance:"合规", corporate:"企业", data:"数据",
  design:"设计", engineering:"工程", finance:"财务", game:"游戏", gaokao:"教育",
  godot:"Godot", government:"政务", healthcare:"医疗", hospitality:"酒店", hr:"人力",
  identity:"身份", language:"语言", legal:"法律", level:"游戏", livestock:"农业",
  loan:"金融", lsp:"工具链", macos:"平台", marketing:"营销", narrative:"叙事",
  paid:"投放", product:"产品", project:"项目", prompt:"提示词", real:"地产",
  recruitment:"招聘", report:"运营", retail:"零售", roblox:"Roblox", sales:"销售",
  specialized:"专业", study:"教育", supply:"供应链", support:"职能", technical:"技术美术",
  terminal:"工具链", testing:"测试", unity:"Unity", unreal:"Unreal",
  visionos:"平台", xr:"XR", zk:"知识管理"
};

(function renderAgents(){
  const host = document.getElementById("agentdir");
  if(!host) return;

  const groups = new Map();
  AGENTS.forEach(([file, cn, desc]) => {
    const p = file.split("-")[0];
    const label = AGENT_PREFIX_MAP[p] || "其他";
    if(!groups.has(label)) groups.set(label, []);
    groups.get(label).push([file, cn, desc]);
  });

  const big = [...groups.entries()].filter(([,v]) => v.length >= 3).sort((a,b) => b[1].length - a[1].length);
  const small = [...groups.entries()].filter(([,v]) => v.length < 3).flatMap(([,v]) => v);
  if(small.length) big.push(["其他", small.sort((a,b) => a[0].localeCompare(b[0]))]);

  host.innerHTML = big.map(([label, list]) => `
    <h3 class="agroup">${esc(label)}　<span class="cnt">${list.length}</span></h3>
    <table class="agtable"><tbody>
      ${list.map(([file, cn, desc]) => `
        <tr data-key="${esc(file)}">
          <td class="name" style="width:15em">${esc(cn)}</td>
          <td style="width:22em"><span class="id" data-copy="${esc(file)}" title="点击复制文件名">${esc(file)}</span></td>
          <td class="wide">${esc(desc)}</td>
        </tr>`).join("")}
    </tbody></table>`).join("");

  host.insertAdjacentHTML("afterbegin",
    `<p class="hint">共 ${AGENTS.length} 个，按用途分组。点文件名可复制，直接说「用 <b>最小变更工程师</b>」或 <b>@</b> 唤起即可调用。</p>`);
})();

/* ============================================================
   索引（供搜索）
   ============================================================ */

/* [元素, 所属章节标题, 展示文本] */
const INDEX = [];

const CAT_LABEL = {
  quick:"场景", plugins:"插件", skills:"技能", agents:"子代理",
  mcp:"MCP", hooks:"Hooks", perms:"权限", env:"环境", files:"目录"
};

function indexNode(el, cat, secTitle, text, key){
  if(!text || !text.trim()) return;
  INDEX.push({el, cat, secTitle, key:key || null, text:text.replace(/\s+/g," ").trim()});
}

doc.querySelectorAll("section").forEach(sec => {
  const h2 = sec.querySelector("h2");
  const secTitle = h2 ? h2.textContent.trim() : "";
  sec.querySelectorAll("h2,h3,tr,li").forEach(el => {
    if(el.tagName === "TR"){
      const tds = [...el.querySelectorAll("td")];
      if(!tds.length) return;
      indexNode(el, sec.id, secTitle, tds.map(t => t.textContent).join(" ｜ "), el.dataset.key);
    } else if(el.tagName === "LI"){
      indexNode(el, sec.id, secTitle, el.textContent, null);
    } else if(el.tagName === "H3"){
      indexNode(el, sec.id, secTitle, el.textContent, null);
    }
  });
});

/* 分类筛选按钮 */
const chipsEl = document.getElementById("chips");
let activeCat = "";

chipsEl.innerHTML = `<button data-cat="" class="on">全部<span class="c">${INDEX.length}</span></button>`
  + SECTIONS.map(s => {
      const n = INDEX.filter(r => r.cat === s.id).length;
      return `<button data-cat="${s.id}">${esc(CAT_LABEL[s.id])}<span class="c">${n}</span></button>`;
    }).join("");

chipsEl.addEventListener("click", e => {
  const b = e.target.closest("button[data-cat]");
  if(!b) return;
  activeCat = b.dataset.cat;
  [...chipsEl.querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
  search(qEl.value);
});

function resetChips(){
  activeCat = "";
  [...chipsEl.querySelectorAll("button")].forEach((x,i) => x.classList.toggle("on", i === 0));
}

/* ============================================================
   搜索
   ============================================================ */

let matches = [];
let cursor = -1;

function hl(text, q){
  const e = esc(text);
  if(!q) return e;
  const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return e.replace(re, "<mark>$1</mark>");
}

function search(qRaw){
  const q = qRaw.trim().toLowerCase();
  closeDrawer();
  if(!q && !activeCat) return closeResults();

  matches = INDEX.filter(r =>
    (!activeCat || r.cat === activeCat) &&
    (!q || r.text.toLowerCase().includes(q))
  );
  cursor = -1;

  doc.style.display = "none";
  resEl.style.display = "block";
  window.scrollTo(0,0);

  if(!matches.length){
    resEl.innerHTML = `<p class="rsum">没有匹配的内容。</p>
      <p class="rempty">换个词试试，或点「全部」取消分类筛选。常见入口：提交、浏览器、测试、小红书、PDF、搜索词、绩效。</p>`;
    return;
  }

  const scope = (activeCat ? `，限「${esc(CAT_LABEL[activeCat])}」` : "")
              + (q ? `，匹配「${esc(qRaw)}」` : "");

  resEl.innerHTML = `<p class="rsum">共 <b>${matches.length}</b> 条${scope}　<span style="font-size:13px">↑ ↓ 选择，Enter 看详情</span></p>
    <ul class="rlist" id="rlist">${matches.map((m,i) => `
      <li><button data-i="${i}">
        <span class="rsec">${esc(m.secTitle)}</span>
        <div class="rtxt">${hl(m.text, qRaw)}</div>
      </button></li>`).join("")}</ul>`;
}

function closeResults(){
  resEl.style.display = "none";
  resEl.innerHTML = "";
  doc.style.display = "";
  matches = [];
  cursor = -1;
  syncNav();
}

function moveCursor(d){
  if(!matches.length) return;
  cursor = Math.max(0, Math.min(matches.length - 1, cursor + d));
  const btns = resEl.querySelectorAll(".rlist button");
  btns.forEach((b,i) => b.classList.toggle("cursor", i === cursor));
  if(btns[cursor]) btns[cursor].scrollIntoView({block:"nearest"});
}

function jump(i){
  const m = matches[i];
  if(!m) return;
  qEl.value = "";
  closeResults();
  requestAnimationFrame(() => {
    m.el.scrollIntoView({block:"center", behavior:"smooth"});
    m.el.classList.add("flash");
    setTimeout(() => m.el.classList.remove("flash"), 1200);
  });
}

/* ============================================================
   详情抽屉
   ============================================================ */

const drawer = document.createElement("aside");
drawer.id = "drawer";
drawer.className = "drawer";
drawer.setAttribute("role", "dialog");
drawer.setAttribute("aria-label", "条目详情");
document.body.appendChild(drawer);

/* 每个 key 在正文里的第一个落点 */
const BY_KEY = new Map();
INDEX.forEach(r => { if(r.key && !BY_KEY.has(r.key)) BY_KEY.set(r.key, r.el); });

function copyText(t){
  navigator.clipboard.writeText(t.dataset.copy).then(() => {
    t.classList.add("flash");
    setTimeout(() => t.classList.remove("flash"), 900);
  }).catch(() => {});
}

function links(arr, cls){
  return `<div class="${cls}">${arr.map(([k,t]) => {
    if(!DETAIL[k]) return `<span class="id" data-copy="${esc(k)}" title="点击复制">${esc(k)}</span>`;
    const nm = DETAIL[k].title || k;
    return `<button data-goto="${esc(k)}">${esc(nm)}${t ? `<em>${esc(t)}</em>` : ""}</button>`;
  }).join("")}</div>`;
}

function field(label, html){
  return html ? `<div class="dfield"><h4>${label}</h4>${html}</div>` : "";
}

function openDrawer(key){
  const d = DETAIL[key];
  if(!d) return false;
  const kind = KIND[d.k] || {src:""};
  const parts = [];
  if(d.intro) parts.push(`<p class="dlead">${idify(d.intro)}</p>`);
  if(d.when)  parts.push(field("何时用它", `<p>${idify(d.when)}</p>`));
  if(d.how && d.how.length) parts.push(field("调用方式",
    `<div class="dhow">${d.how.map(([l,c,cp]) =>
      `<div class="row"><span class="lbl">${esc(l)}</span>` +
      (cp === false
        ? `<span class="howtext">${esc(c)}</span>`
        : `<span class="${clsOf(c)}" data-copy="${esc(c)}" title="点击复制">${esc(c)}</span>`) +
      `</div>`).join("")}</div>`));
  parts.push(field("安装与启用", `<p>${idify(INSTALL[d.k] || "")}</p>`));
  if(d.pair && d.pair.length) parts.push(field("搭配推荐", links(d.pair, "dlinks")));
  if(d.note) parts.push(field("注意事项", `<p>${idify(d.note)}</p>`));
  if(d.rel && d.rel.length)  parts.push(field("相关条目", links(d.rel, "dlinks")));

  drawer.innerHTML =
    `<div class="dhead">
       <div style="flex:1;min-width:0">
         <div class="dtitle">${esc(d.title || key)}</div>
         <div class="dmeta">${esc(kind.src + (d.p ? "　" + d.p : ""))}</div>
       </div>
       <button class="dclose" aria-label="关闭详情">✕</button>
     </div>
     <div class="dbody">${parts.join("")}</div>
     <div class="dfoot">
       <button class="primary" data-jump="${esc(key)}">在正文中定位</button>
       <button class="dclose">关闭</button>
     </div>`;
  drawer.classList.add("open");
  drawer.querySelector(".dbody").scrollTop = 0;
  return true;
}

function closeDrawer(){ drawer.classList.remove("open"); }

function jumpToKey(key){
  const el = BY_KEY.get(key);
  closeDrawer();
  qEl.value = "";
  resetChips();
  closeResults();
  if(!el) return;
  requestAnimationFrame(() => {
    el.scrollIntoView({block:"center", behavior:"smooth"});
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1200);
  });
}

/* ============================================================
   事件
   ============================================================ */

function activate(i){
  const m = matches[i];
  if(!m) return;
  if(m.key && DETAIL[m.key]) openDrawer(m.key);
  else jump(i);
}

qEl.addEventListener("input", e => search(e.target.value));
qEl.addEventListener("keydown", e => {
  if(e.key === "ArrowDown"){ e.preventDefault(); moveCursor(1); }
  else if(e.key === "ArrowUp"){ e.preventDefault(); moveCursor(-1); }
  else if(e.key === "Enter"){ e.preventDefault(); activate(cursor < 0 ? 0 : cursor); }
  else if(e.key === "Escape"){ qEl.value = ""; resetChips(); closeResults(); closeDrawer(); qEl.blur(); }
});

resEl.addEventListener("click", e => {
  const b = e.target.closest(".rlist button");
  if(b) activate(Number(b.dataset.i));
});

drawer.addEventListener("click", e => {
  if(e.target.closest(".dclose")) return closeDrawer();
  const g = e.target.closest("[data-goto]");
  if(g) return void openDrawer(g.dataset.goto);
  const j = e.target.closest("[data-jump]");
  if(j) return jumpToKey(j.dataset.jump);
  const cp = e.target.closest(".id,.cmd,.path");
  if(cp) copyText(cp);
});

document.addEventListener("keydown", e => {
  if(e.key === "Escape" && drawer.classList.contains("open")){ closeDrawer(); return; }
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){
    e.preventDefault(); rail.classList.add("open"); closeDrawer(); qEl.focus(); qEl.select();
  }
});

/* 点抽屉外面收起（移动端抽屉铺满，不会触发） */
document.addEventListener("click", e => {
  if(!drawer.classList.contains("open")) return;
  if(drawer.contains(e.target)) return;
  if(e.target.closest(".rlist button")) return;
  closeDrawer();
});

doc.addEventListener("click", e => {
  const t = e.target.closest(".id,.cmd,.path");
  if(t){ copyText(t); return; }
  const tr = e.target.closest("tr[data-key]");
  if(tr) openDrawer(tr.dataset.key);
});

/* ============================================================
   导航高亮 + 移动端抽屉
   ============================================================ */

const navLinks = [...nav.querySelectorAll("a")];
function syncNav(){
  let cur = SECTIONS[0].id;
  for(const s of SECTIONS){
    const el = document.getElementById(s.id);
    if(el && el.getBoundingClientRect().top <= 90) cur = s.id;
  }
  navLinks.forEach(a => a.classList.toggle("on", a.dataset.sec === cur));
}
let ticking = false;
window.addEventListener("scroll", () => {
  if(ticking) return;
  ticking = true;
  requestAnimationFrame(() => { if(doc.style.display !== "none") syncNav(); ticking = false; });
}, {passive:true});
syncNav();

navLinks.forEach(a => a.addEventListener("click", () => rail.classList.remove("open")));

const toggle = document.getElementById("railtoggle");
toggle.addEventListener("click", () => {
  const open = rail.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", e => {
  if(window.innerWidth > 900) return;
  if(!rail.classList.contains("open")) return;
  if(rail.contains(e.target) || toggle.contains(e.target)) return;
  rail.classList.remove("open");
});

/* ============================================================
   深浅色
   ============================================================ */

const themebtn = document.getElementById("themebtn");
const themelabel = document.getElementById("themelabel");

function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  themelabel.textContent = t === "dark" ? "浅色" : "深色";
}
themebtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try{ localStorage.setItem("cccap-theme", next); }catch(e){}
});
applyTheme(document.documentElement.getAttribute("data-theme") || "light");
