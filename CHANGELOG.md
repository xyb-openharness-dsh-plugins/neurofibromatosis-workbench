# 变更记录

## v0.1.2 · 2026-10-25

- 修复装机激活错误：dsh/index.js 误用 ctx.config（cannot get property "config" without inject），改为 apply(ctx, config) 由 cordis 注入；升版重装。
- v0.1.1 · 2026-10-25：M5 开发版（API 四路由/读模型/客户端 9 页）；package files 补 schema/（否则安装后迁移失败）。
- v0.1.0 · 2026-10-25：M0–M4 首版（脚手架 + 原型四件套 + schema/0001 冻结 + 临床试验库 364 条）。

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.1.0 — 2026-10-25

- 由社区脚手架 dsh-wb-cli@1.5.7 (c0bcc5d+dirty) 初始化，仅有注册骨架与健康接口，无业务功能。
