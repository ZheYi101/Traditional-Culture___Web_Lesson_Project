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
- `src/pages/home/components/ReadingCorner.js`：首页闲读角自定义元素 `tc-reading-corner`，支持拖拽飞出切换下一张卡片。
- `src/pages/home/constants/readingNotes.js`：首页闲读角静态卡片数据。
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
- `src/pages/login/index.js`：登录页自定义元素 `tc-login-page`，负责用户名 + API Key 登录。
- `src/services/authService.js`：登录态、本地用户名与 API Key 校验服务。
- `src/components/SiteFooter.js`：全站页尾自定义元素 `tc-site-footer`。
- `src/styles/pages/login.css`：登录页样式。
- `src/styles/components/site-footer.css`：全站页尾组件样式。
- `src/pages/about/index.js`：关于页自定义元素 `tc-about-page`，展示项目参与者信息卡片。
- `src/pages/about/constants/participants.js`：关于页参与者占位数据（姓名、头像、GitHub、博客）。
- `src/styles/pages/about.css`：关于页样式。
- `server/cmd/server/main.go`：Go 服务端入口，注册静态文件服务与出行问策 API。
- `server/internal/travelagent/types.go`：出行问策请求、上下文与流式事件结构。
- `server/internal/travelagent/context.go`：天气、黄历和风险规则上下文构建。
- `server/internal/travelagent/agent.go`：基于 Eino ChatModel 的出行建议流式生成。
- `server/internal/travelagent/http.go`：出行问策 HTTP/SSE 接口。
