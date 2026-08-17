# Security

## 数据与权限

- 插件配置（含推送渠道 id、提醒模板）存储在 `$DSH_HOME/peakvalley/config.json`，
  请确保该目录仅当前用户可读写。
- 本插件不收集、不上传任何遥测数据；运行时仅访问：
  - 同源 fenced API `/peakvalley/api/*`（仅同源 / loopback / 受信 host）；
  - 可选的外部推送渠道（由 chicheng-push 渠道配置决定，经其自身机制发送）。
- 浏览器本地通知仅在用户显式授权后使用（`Notification` API）。

## 依赖

- 运行时零第三方依赖（Node 内置模块 + dsh profile 组合服务）。

## 报告问题

发现安全问题请直接提交 GitHub issue：
https://github.com/534119219/chicheng-peak/issues