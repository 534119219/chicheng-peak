# Changelog

All notable changes to this project are documented in this file.

## [0.1.1] — dsh 0.2 compatibility

### Fixed

- **设置页在 dsh 0.2 下整页空白**：`client.js` 绑定了 `primitives.IconRefreshOutline16`，
  而 0.2 把图标导出统一改名成 `Icon<Name><Weight>`（`IconRefreshOutlineMedium` /
  `IconRefreshOutlineRegular`），旧名已不存在。该绑定得到 `undefined`，又被用在
  `PeakValleySection` 无条件渲染的头部「重新获取」按钮上，React 渲染到它就抛
  「Element type is invalid」，被设置面板的错误边界吞掉 —— 表现为导航项在、内容全空白。
  现在通过 `pickPrimitive()` 按候选名依次探测，取第一个存在的导出；全部缺失时退化为
  纯文字按钮，未来再改名也不会白屏。

### Added

- `test/client.icon-compat.mjs`：跨版本契约检查。直接读取本机已安装的
  `@deepseek-ai/dsh-client-ui-primitives` 真实导出清单，核对 `client.js` 引用的每个
  primitives 名字是否真的存在（`pickPrimitive` 的候选表按设计允许缺失）。找不到包时跳过，
  保持可移植。可用 `DSH_PRIMITIVES_DIR` 指定包目录。

### Changed

- `test/client.load.mjs`、`test/client.runtime.mjs` 的 primitives 桩改为**真实 0.2 导出面**
  （不再提供 `IconRefreshOutline16`）。旧桩会把这次的白屏断裂掩盖掉。

### Verified

- host 半无需改动：0.2 的 `webServer.register({ kind: "prefix", path, handler })`、
  `webServer.port`、`webRuntime.trustedHosts` 契约均未变化。
- `settings.section` 插槽契约未变化（仍为 `slots.inject` + `slots.register(def, Component)`）。

## [Unreleased]

### Added

- 状态角标**独立化**：不再随页面边框开关联动；新增顶层 `badge` 配置（启用 + PC/手机端各自四角位置与水平/垂直偏移），设置页新增独立圆角分区「状态角标」；存储迁移自旧 `edge.badge`。
- 输入框光效**完全独立**：新增顶层 `composer` 配置（高峰色/低峰色、宽度、光晕、不透明度、呼吸动画与频率、光效方向、流光开关与速度），与页面边缘互不影响；存储迁移自旧 `edge.composer`。
- 设置页新增独立圆角分区「输入框光效」，含即时预览与恢复默认。

### Fixed

- 手机端：光效层级降到侧栏抽屉之下（z-index 30）。
- 手机端：单行/双行切换时输入框容器选择稳定（绝对高度差判定），打字自增高实时跟随。

## [0.1.0] — 2026-08-17

### Added

- DeepSeek 官方峰谷时段感知：高峰 09:00–12:00 / 14:00–18:00（北京时间），其余为低峰。
- 网页边缘贴屏呼吸边框：高峰橙色 / 低峰蓝色，呼吸光晕在边框内圈起伏。
- 边框外观设置：颜色（色板 + 取色器）、宽度、光晕强度、不透明度（默认 40%）、
  呼吸动画（呼吸/常亮/关闭）、呼吸频率、流光彗星（开关 + 速度）、状态角标（默认开启）。
- 服务端提醒调度：高峰/低峰转折前提前 0/5/10/15/30/60 分钟，或每日固定时间；
  标题/内容模板（`{phase}` `{start}` `{end}` `{time}` 等变量）；渠道支持
  chicheng-push 全部渠道与 messaging-core 消息平台目标；页面关闭也能送达。
- 浏览器本地通知：阶段转折 / 托管提醒触发时通知（可分别开关）。
- 手机端角标跟随输入框右上角（含输入法弹出/收起时的重定位）。
- fenced API `/peakvalley/api/*`（status / config / save / reset / pushChannels / test / fireNow）。
- 测试：引擎 31 项、host 冒烟 8 项、client 加载 6 项、client 运行时 12 项。

### Fixed

- 修复 overlay 中悬空 `flow` 元素引用导致的边框静默不渲染（新增运行时回归测试）。
