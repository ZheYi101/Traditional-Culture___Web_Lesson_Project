# AGENTS 协作手册

## 1. 项目目标
- 在不安装任何依赖的前提下，用 HTML + CSS + JavaScript（ES Modules）实现传统文化展示网站。
- 当前优先级：节气卡片、哈希占卜、主题切换、小游戏预留入口。

## 2. 技术边界
- 禁止引入 npm 包和构建工具。
- 运行方式：直接打开 `index.html` 或使用任意静态文件服务。
- 组件模式：Web Components（Custom Elements）+ 生命周期管理事件。

## 2.1 命名规范
- JS 标识符默认小驼峰（例如：`pageName`）。
- CSS 类名与 CSS 变量默认 kebab-case（例如：`section-title`）。

## 3. 目录职责
- `index.html`：应用入口。
- `src/main.js`：应用挂载与初始化。
- `src/pages`：页面组装层。
- `src/pages/<page>/components`：页面专用组件（仅该页面使用）。
- `src/pages/<page>/constants`：页面专用静态数据（仅该页面使用）。
- `src/components`：可复用 UI 组件。
- `src/styles/components`：公用组件样式。
- `src/styles/pages`：页面专用样式。
- `src/styles`：设计变量与全局基础样式。
- `src/services`：后续 API 适配层（当前可留空）。
- `public/assets`：静态资源。

## 4. 主题规范
- 使用语义色变量，禁止在组件内硬编码具体色值。
- 主题由 `html[data-theme]` 控制，通过 `src/components/ThemeSwitcher.js` 管理。
- 新增主题时至少定义：背景、文本、主色、强调色、边框色。

## 5. 开发与提交约定
- 变更尽量按模块提交，避免一次性混合大量无关修改。
- 每次新增模块前，在本文件的“模块索引”登记。
- 每次 agent 执行后必须追加“执行记录”。

## 5.1 页面初始化规范
- 每个页面模块必须定义页面级自定义元素（例如：`tc-home-page`）。
- 页面内所有事件绑定与清理统一放在组件生命周期：`connectedCallback` / `disconnectedCallback`。
- `main.js` 只负责三件事：加载组件模块注册、根据路由挂载页面标签、执行少量全局初始化。
- 禁止在 `main.js` 直接处理页面内部交互事件，避免入口文件膨胀。

## 5.2 数据归属规范
- 页面专用静态数据必须放在 `src/pages/<page>/constants`。
- 只有当同一份数据被多个页面复用时，才可提升为共享目录。

## 6. 验证清单
- 页面加载无控制台报错。
- 主题切换可用且刷新后保持。
- 相同占卜输入得到相同结果。
- 移动端宽度下布局不溢出。

## 7. 模块索引
- `src/components/TopBar.js`：顶栏自定义元素 `tc-top-bar`（左侧页面切换、右侧主题切换）。
- `src/components/ThemeSwitcher.js`：主题切换自定义元素 `tc-theme-switcher` 与主题持久化。
- `src/components/SectionTitle.js`：标题自定义元素 `tc-section-title`。
- `src/components/SolarTermCard.js`：节气卡片自定义元素 `tc-solar-term-card`。
- `src/pages/home/index.js`：首页页面级自定义元素 `tc-home-page`。
- `src/pages/home/components/DivinationSection.js`：首页占卜区自定义元素 `tc-divination-section` 与哈希取模逻辑。
- `src/pages/play/index.js`：示例小游戏页面级自定义元素 `tc-play-page`。
- `src/pages/play/components/BoatDragonGame.js`：赛龙舟小游戏自定义元素 `tc-boat-dragon-game`，负责航道切换、碰撞判定与暂停/结算状态。
- `src/pages/play/components/DanmakuShooterGame.js`：弹幕射击小游戏自定义元素 `tc-danmaku-shooter-game`，负责难度、玩法模式、掉落物与暂停/结算状态。
- `src/pages/play/constants/gameItems.js`：小游戏大厅卡片与页面入口配置。
- `src/pages/play/constants/boatGameConfig.js`：赛龙舟页面私有静态配置与资源入口。
- `src/pages/play/constants/shooterConfig.js`：弹幕射击页面私有静态配置与模式参数。
- `src/pages/advisor/index.js`：出行问策页面级自定义元素 `tc-advisor-page`，负责对话 UI 与流式响应渲染。
- `src/pages/terms/index.js`：二十四节气独立页自定义元素 `tc-terms-page`。
- `src/pages/terms/components/SeasonTermsBoard.js`：节气页季节切换与卡片网格组件 `tc-season-terms-board`。
- `src/pages/terms/components/TermFlipCard.js`：节气页私有翻转卡组件 `tc-terms-flip-card`（点击翻面）。
- `src/pages/terms/constants/solarTerms24.js`：二十四节气完整静态数据。
- `src/pages/pageRegistry.js`：页面注册表，统一维护 hash 路由与页面标签映射。
- `src/constants/divinationProfiles.js`：占卜与今日运势共用的签文区间配置。
- `src/constants/fortuneProfiles.js`：生辰八字共用静态映射数据。
- `src/pages/fortune/index.js`：生辰八字页面级自定义元素 `tc-fortune-page`。
- `src/components/ResultBadge.js`：结果标签自定义元素 `tc-result-badge`。
- `src/service/hash.js`：稳定哈希与区间映射工具。
- `src/service/divinationService.js`：占卜结果生成逻辑。
- `src/service/fortuneService.js`：生辰八字模拟结果生成逻辑。
- `src/styles/components/result-badge.css`：结果标签组件样式。
- `src/styles/pages/fortune.css`：生辰八字页面样式。
- `src/services/travelAdvisorApi.js`：出行问策 SSE 流式接口客户端。
- `src/styles/components/top-bar.css`：顶栏组件样式。
- `src/styles/components/theme-switcher.css`：主题切换组件样式。
- `src/styles/components/section-title.css`：标题组件样式。
- `src/styles/components/solar-term-card.css`：节气卡片组件样式。
- `src/styles/pages/home.css`：首页布局样式。
- `src/styles/pages/terms.css`：二十四节气独立页样式（含翻转卡与季节切换样式）。
- `src/styles/pages/home-divination.css`：首页占卜区样式。
- `src/styles/pages/play.css`：小游戏示例页样式。
- `src/styles/pages/advisor.css`：出行问策页面样式。
- `server/cmd/server/main.go`：Go 服务端入口，注册静态文件服务与出行问策 API。
- `server/internal/travelagent/types.go`：出行问策请求、上下文与流式事件结构。
- `server/internal/travelagent/context.go`：天气、黄历和风险规则上下文构建。
- `server/internal/travelagent/agent.go`：基于 Eino ChatModel 的出行建议流式生成。
- `server/internal/travelagent/http.go`：出行问策 HTTP/SSE 接口。

## 8. 执行记录

### 2026-04-20 / Copilot
- 目标：初始化无依赖前端骨架并实现主题系统 + 节气卡片 + 哈希占卜。
- 修改文件：
	- `index.html`
	- `src/main.js`
	- `src/styles/tokens.css`
	- `src/styles/themes.css`
	- `src/styles/base.css`
	- `src/styles/layout.css`
	- `src/core/theme.js`
	- `src/core/hash.js`
	- `src/constant/solarTerms.js`
	- `src/constant/divinations.js`
	- `src/components/SectionTitle.js`
	- `src/components/ThemeSwitcher.js`
	- `src/components/SolarTermCard.js`
	- `src/pages/home/home.js`
- 验证：页面基础渲染通过，控制台错误检查通过。
- 风险与待办：
	- `src/services`、`public/assets` 尚未放入实际内容。
	- 小游戏仅为占位，下一步实现“划龙舟节奏点击”MVP。

### 2026-04-20 / Copilot
- 目标：移除 `src/core` 依赖，将逻辑内聚到对应组件并修复页面崩溃。
- 修改文件：
	- `src/components/ThemeSwitcher.js`
	- `src/main.js`
	- `src/pages/home/components/DivinationSection.js`
	- `AGENTS.md`
- 验证：待执行（建议本地刷新页面并检查控制台 404 是否消失）。
- 风险与待办：
	- 仍需删除空的 `src/core/` 目录，避免后续误用。

### 2026-04-20 / Copilot
- 目标：按页面专用与公用职责重构目录，并拆分样式文件。
- 修改文件：
	- `src/main.js`
	- `src/pages/home/home.js`
	- `src/pages/home/components/SolarTermsSection.js`
	- `src/pages/home/components/DivinationSection.js`
	- `src/styles/layout.css`
	- `src/styles/components/theme-switcher.css`
	- `src/styles/components/section-title.css`
	- `src/styles/components/solar-term-card.css`
	- `src/styles/pages/home.css`
	- `src/styles/pages/home-divination.css`
	- `index.html`
	- `AGENTS.md`
	- `src/features/divination/index.js`（删除）
	- `src/features/solarTerms/index.js`（删除）
	- `src/features/`（删除）
- 验证：待执行（建议本地打开 `index.html` 进行交互验证）。
- 风险与待办：
	- `src/services`、`public/assets` 尚未放入实际内容。
	- 小游戏仅为占位，下一步实现“划龙舟节奏点击”MVP。

### 2026-04-20 / Copilot
- 目标：建立页面级 `initXxxPage` 初始化规范，收敛 `main.js` 入口职责。
- 修改文件：
	- `src/pages/home/home.js`
	- `src/main.js`
	- `AGENTS.md`
- 验证：待执行（建议本地刷新页面，确认主题切换与占卜绑定均正常）。
- 风险与待办：
	- 后续新增页面时需遵循同样导出规范，保持 `main.js` 简洁。

### 2026-04-20 / Copilot
- 目标：将常量数据从全局目录迁移到对应页面目录，保持页面内聚。
- 修改文件：
	- `src/pages/home/constants/solarTerms.js`（新增）
	- `src/pages/home/constants/divinations.js`（新增）
	- `src/pages/home/components/SolarTermsSection.js`
	- `src/pages/home/components/DivinationSection.js`
	- `AGENTS.md`
	- `src/constants/solarTerms.js`（删除）
	- `src/constants/divinations.js`（删除）
	- `src/constants/`（删除）
- 验证：待执行（建议本地刷新页面，确认节气与占卜数据正常渲染）。
- 风险与待办：
	- 若后续多个页面复用同一份数据，再考虑回收为共享目录。

### 2026-04-20 / Copilot
- 目标：统一 README 与 AGENTS 规范内容，确保目录、命名、初始化与数据归属一致。
- 修改文件：
	- `README.md`
	- `AGENTS.md`
- 验证：待执行（建议按 README 规则自检当前目录结构与入口流程）。
- 风险与待办：
	- 若后续新增页面，请同步更新两份文档，避免描述漂移。

### 2026-04-20 / Copilot
- 目标：新增顶栏组件，实现左侧页面切换与右侧主题切换。
- 修改文件：
	- `src/components/TopBar.js`（新增）
	- `src/pages/home/home.js`
	- `src/styles/components/top-bar.css`（新增）
	- `index.html`
	- `AGENTS.md`
- 验证：待执行（建议本地点击“首页/小游戏”切换并验证主题切换可用）。
- 风险与待办：
	- 当前页面切换基于锚点定位，后续多页面时可升级为简易路由。

### 2026-04-20 / Copilot
- 目标：将顶栏切换升级为“页面级路由切换”，并新增示例页面，且顶栏固定在顶部。
- 修改文件：
	- `src/main.js`
	- `src/components/TopBar.js`
	- `src/pages/home/index.js`
	- `src/pages/play/index.js`（新增）
	- `src/styles/components/top-bar.css`
	- `src/styles/pages/play.css`（新增）
	- `index.html`
	- `AGENTS.md`
- 验证：待执行（建议本地切换 `#/home` 与 `#/play` 并检查顶栏是否始终置顶）。
- 风险与待办：
	- 当前为 hash 路由，后续可按需要扩展为 history 路由。

### 2026-04-20 / Copilot
- 目标：将函数组件架构全量迁移为 Web Components（Custom Elements）。
- 修改文件：
	- `src/main.js`
	- `src/components/TopBar.js`
	- `src/components/ThemeSwitcher.js`
	- `src/components/SectionTitle.js`
	- `src/components/SolarTermCard.js`
	- `src/pages/home/index.js`
	- `src/pages/home/home.js`
	- `src/pages/home/components/SolarTermsSection.js`
	- `src/pages/home/components/DivinationSection.js`
	- `src/pages/play/index.js`
	- `AGENTS.md`
- 验证：待执行（建议本地刷新页面后检查首页/小游戏切换、主题切换与占卜交互）。
- 风险与待办：
	- 当前仍沿用全局 CSS；后续若出现样式冲突，可逐步升级到 Shadow DOM 样式隔离。

### 2026-04-20 / Copilot
- 目标：消除 JS 中的 HTML 模板字符串，统一改为 DOM API 渲染。
- 修改文件：
	- `src/main.js`
	- `src/components/TopBar.js`
	- `src/components/ThemeSwitcher.js`
	- `src/components/SectionTitle.js`
	- `src/components/SolarTermCard.js`
	- `src/pages/home/index.js`
	- `src/pages/home/components/SolarTermsSection.js`
	- `src/pages/home/components/DivinationSection.js`
	- `src/pages/play/index.js`
	- `AGENTS.md`
- 验证：已执行静态错误检查，相关 JS 文件均无报错。
- 风险与待办：
	- 仍建议在浏览器手动验证首页与小游戏页切换、主题切换、占卜结果展示。

### 2026-04-22 / Codex
- 目标：新增 Eino 服务端出行问策接口，并在前端增加独立对话路由与流式传输页面。
- 修改文件：
	- `server/go.mod`
	- `server/go.sum`
	- `server/cmd/server/main.go`
	- `server/internal/travelagent/types.go`
	- `server/internal/travelagent/context.go`
	- `server/internal/travelagent/agent.go`
	- `server/internal/travelagent/http.go`
	- `src/main.js`
	- `src/components/TopBar.js`
	- `src/services/travelAdvisorApi.js`
	- `src/pages/advisor/index.js`
	- `src/styles/components/top-bar.css`
	- `src/styles/pages/advisor.css`
	- `index.html`
	- `AGENTS.md`
- 验证：已执行 `go test ./...`、前端 JS `node --check`、`/api/health` 与 `/api/travel-advisor/stream` SSE 请求；Playwright MCP 因本机 `/.playwright-mcp` 目录创建失败未能完成浏览器自动化检查。
- 风险与待办：
	- 未配置 `SILICONFLOW_API_KEY` 时服务端会启动失败；出行问策结果必须通过 Eino OpenAI-compatible ChatModel 调用硅基流动生成。
	- 黄历当前为本地民俗规则上下文，后续如需精确农历黄历可替换为正式黄历数据源。

### 2026-04-23 / Codex
- 目标：调整出行问策页面文案，移除上下文展示面板，并将模型供应商配置切换为硅基流动。
- 修改文件：
	- `src/pages/advisor/index.js`
	- `src/styles/pages/advisor.css`
	- `server/cmd/server/main.go`
	- `server/internal/travelagent/agent.go`
	- `AGENTS.md`
- 验证：已执行前端 JS `node --check`、`go test ./...`、本地 HTTP 首页加载与出行问策 SSE 请求，并检索确认旧 UI 文案与旧 OpenAI 环境变量名不再残留。
- 风险与待办：
	- 硅基流动模型与接口地址可通过 `SILICONFLOW_MODEL`、`SILICONFLOW_BASE_URL` 覆盖。

### 2026-04-23 / Codex
- 目标：移除出行问策页示例填充入口，并删除后端模拟返回逻辑，确保建议结果来自硅基流动模型。
- 修改文件：
	- `src/pages/advisor/index.js`
	- `src/styles/pages/advisor.css`
	- `server/internal/travelagent/agent.go`
	- `AGENTS.md`
- 验证：已执行前端 JS `node --check`、`go test ./...`、无 `SILICONFLOW_API_KEY` 启动失败检查，并检索确认示例入口与模拟返回逻辑不再残留。
- 风险与待办：
	- 本地运行服务端前必须配置 `SILICONFLOW_API_KEY`。

### 2026-04-23 / Codex
- 目标：将出行问策交互改为纯自然语言对话，并在模型上下文中显式注入当前时间。
- 修改文件：
	- `src/pages/advisor/index.js`
	- `src/styles/pages/advisor.css`
	- `server/internal/travelagent/types.go`
	- `server/internal/travelagent/context.go`
	- `server/internal/travelagent/agent.go`
	- `AGENTS.md`
- 验证：已执行前端 JS `node --check`、`go test ./...`；使用本地服务验证自然语言请求“我在上海，明天上午想去杭州西湖走走...”可解析为杭州与明天日期，且 SSE 上下文包含 `currentTime`、`currentDate`、`timezone`。
- 风险与待办：
	- 使用真实硅基流动模型返回结果仍需配置有效 `SILICONFLOW_API_KEY`。


### 2026-04-23 / Codex
- 目标：在保留首页、小游戏与出行问策功能的前提下，新增“占卜”和“算命（生辰八字）”两个独立页面，并接入现有 hash 路由与主题体系。
- 修改文件：
	- `src/main.js`
	- `src/components/TopBar.js`
	- `src/components/ResultBadge.js`（新增）
	- `src/pages/pageRegistry.js`（新增）
	- `src/pages/divination/index.js`（新增）
	- `src/pages/fortune/index.js`（新增）
	- `src/pages/fortune/constants/fortuneProfiles.js`（新增）
	- `src/constants/divinationProfiles.js`（新增）
	- `src/service/hash.js`（新增）
	- `src/service/divinationService.js`（新增）
	- `src/service/fortuneService.js`（新增）
	- `src/styles/components/result-badge.css`（新增）
	- `src/styles/pages/fortune.css`（新增）
	- `index.html`
- 验证：待执行（当前环境缺少 `node`，建议本地打开 `index.html` 手动验证 `#/home`、`#/divination`、`#/fortune`、`#/play`、`#/advisor`）。
- 风险与待办：
	- 生辰八字当前为稳定映射模拟结果，后续如需真实排盘可在 `src/service/fortuneService.js` 替换算法实现。

### 2026-04-23 / Codex
- 目标：消除首页占卜与独立占卜页的功能重复，保留首页“今日运势”并改为无需输入的自动生成模式。
- 修改文件：
	- `src/pages/home/components/DivinationSection.js`
	- `src/styles/pages/home-divination.css`
	- `src/pages/home/index.js`
	- `src/service/divinationService.js`
	- `src/components/TopBar.js`
	- `src/pages/pageRegistry.js`
	- `AGENTS.md`
- 验证：待执行（建议本地打开首页确认无需输入即可展示当日运势，并检查顶部导航已移除重复的“占卜”入口）。
- 风险与待办：
	- 若后续需要恢复独立占卜页，可基于共享的 `src/constants/divinationProfiles.js` 与 `src/service/divinationService.js` 重新接入。

### 2026-04-23 / Codex
- 目标：确认删除未接入主路由的独立占卜页及其样式引用，同时保留首页今日运势所需的共享占卜配置。
- 修改文件：
	- `src/constants/divinationProfiles.js`（新增）
	- `src/service/divinationService.js`
	- `index.html`
	- `AGENTS.md`
	- `src/pages/divination/index.js`（删除）
	- `src/pages/divination/constants/divinationProfiles.js`（删除）
	- `src/styles/pages/divination.css`（删除）
- 验证：待执行（建议本地刷新 `#/home` 与 `#/fortune`，确认首页今日运势正常、页面样式无多余引用）。
- 风险与待办：
	- 当前环境未提供运行时校验工具，删除后的资源引用仅完成源码级检查。

### 2026-04-23 / Codex
- 目标：清理结构层残留耦合与死文件，将八字静态配置提升到共享常量层并移除首页废弃签文数据。
- 修改文件：
	- `src/constants/fortuneProfiles.js`（新增）
	- `src/service/fortuneService.js`
	- `src/pages/home/constants/divinations.js`（删除）
	- `src/pages/fortune/constants/fortuneProfiles.js`（删除）
	- `AGENTS.md`
- 验证：待执行（建议本地打开 `#/home` 与 `#/fortune`，确认首页今日运势和八字结果生成正常）。
- 风险与待办：
	- 当前环境未提供运行时校验工具，本次调整仅完成源码级检查。

### 2026-04-23 / Codex
- 目标：首页聚焦“今日运势”，并将二十四节气拆分为独立页面（四季切换 + 私有翻转卡 + 24 节气完整数据）。
- 修改文件：
	- `src/components/TopBar.js`
	- `src/pages/pageRegistry.js`
	- `src/pages/home/index.js`
	- `src/styles/pages/home.css`
	- `src/pages/terms/index.js`（新增）
	- `src/pages/terms/components/SeasonTermsBoard.js`（新增）
	- `src/pages/terms/components/TermFlipCard.js`（新增）
	- `src/pages/terms/constants/solarTerms24.js`（新增）
	- `src/styles/pages/terms.css`（新增）
	- `index.html`
	- `AGENTS.md`
- 验证：已执行文件级错误检查，以上文件均无语法报错。
- 风险与待办：
	- 建议本地手动验证 `#/home` 与 `#/terms` 的布局、翻卡交互和移动端表现。

### 2026-04-23 / Codex
- 目标：删除首页节气拆页后的旧实现残留，避免维护混淆。
- 修改文件：
	- `src/pages/home/components/SolarTermsSection.js`（删除）
	- `src/pages/home/constants/solarTerms.js`（删除）
	- `AGENTS.md`
- 验证：已执行静态错误检查，未发现由删除引入的引用错误。
- 风险与待办：
	- `src/components/SolarTermCard.js` 目前未被路由页面使用，如后续确认不再复用可继续清理。

### 2026-04-23 / Codex
- 目标：将小游戏页面专用静态数据迁移到 `src/pages/play/constants`，收口小游戏局部主题 token，并补齐模块索引与执行记录。
- 修改文件：
	- `src/pages/play/index.js`
	- `src/pages/play/components/BoatDragonGame.js`
	- `src/pages/play/components/DanmakuShooterGame.js`
	- `src/pages/play/constants/gameItems.js`（新增）
	- `src/pages/play/constants/boatGameConfig.js`（新增）
	- `src/pages/play/constants/shooterConfig.js`（新增）
	- `src/styles/pages/play.css`
	- `AGENTS.md`
- 验证：已执行前端 JS `node --check`，确认小游戏页面与两个小游戏组件在迁移常量后无语法报错。
- 风险与待办：
	- Canvas 绘制色值仍包含少量游戏内局部配色常量；若后续需要做多主题细分，可再进一步提升为可切换主题 token。

### 2026-04-23 / Codex
- 目标：继续规范小游戏模块，收拢 canvas 绘制配色常量，并将 README 页面初始化说明与当前 Web Components 规范对齐。
- 修改文件：
	- `src/pages/play/components/BoatDragonGame.js`
	- `src/pages/play/components/DanmakuShooterGame.js`
	- `src/pages/play/constants/boatGameConfig.js`
	- `src/pages/play/constants/shooterConfig.js`
	- `README.md`
	- `AGENTS.md`
- 验证：待执行（建议本地刷新 `#/play`，确认两个小游戏绘制表现与暂停/结算流程正常）。
- 风险与待办：
	- `play.css` 中仍保留一部分页面级视觉 token 与装饰渐变值；这些值已集中在页面样式层，但若后续要做更严格的主题体系，还可再提升到共享主题变量。
