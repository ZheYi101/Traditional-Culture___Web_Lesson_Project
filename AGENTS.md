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
- `src/pages/home/components/SolarTermsSection.js`：首页节气区自定义元素 `tc-solar-terms-section`。
- `src/pages/home/components/DivinationSection.js`：首页占卜区自定义元素 `tc-divination-section` 与哈希取模逻辑。
- `src/pages/home/constants/solarTerms.js`：首页节气静态数据。
- `src/pages/home/constants/divinations.js`：首页占卜签文静态数据。
- `src/pages/play/index.js`：示例小游戏页面级自定义元素 `tc-play-page`。
- `src/styles/components/top-bar.css`：顶栏组件样式。
- `src/styles/components/theme-switcher.css`：主题切换组件样式。
- `src/styles/components/section-title.css`：标题组件样式。
- `src/styles/components/solar-term-card.css`：节气卡片组件样式。
- `src/styles/pages/home.css`：首页布局样式。
- `src/styles/pages/home-divination.css`：首页占卜区样式。
- `src/styles/pages/play.css`：小游戏示例页样式。

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
