# AGENTS.md

本文件用于约定 AI 助手在此仓库中的工作方式。

## 提交前必须先汇报

每次执行 `git commit` **之前**，先告诉用户本次提交涉及多少个文件，并按类型分列：

- 新增 / 修改 / 删除 / 重命名 各多少个
- 列出每个文件的路径（重命名写成 `旧 → 新`）

汇报完再执行提交，不要跳过这一步。

## 提交信息

- 使用 Conventional Commits：`type(scope): subject`，例如 `feat(frontend): ...`、`fix(lib): ...`
- `scope` 用受影响的目录：`frontend`、`backend`、`api`、`lib`、`docs`、`chore`
- 标题用英文祈使句，不加句号；正文说明「为什么」
- 结尾追加：

  ```
  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  ```

## 不入库的内容

以下属于本地数据或内网配置，**不要**提交：

| 路径 | 原因 |
| --- | --- |
| `data/` | 生产库导出的 CSV |
| `queries/` | 临时取数 SQL |
| `market-sql-da-intern/` | 前期调研文档与脚本 |
| `load_check.py` | 本地校验脚本 |
| `tunnel.cmd`、`tunnel.log` | 含内网跳板机地址与 SSH key 路径 |
| `.env*` | 数据库凭据 |

根 [.gitignore](.gitignore) 已覆盖 `node_modules/`、`.next/`、`dist/`、`out/`、`*.tsbuildinfo`、`*.log`。

## 项目约定

- 目录结构：`backend/`（Next.js 14 Route Handlers + mysql2）、`frontend/`（Vite + React 18 + ECharts）
- 前端样式统一放 `frontend/src/styles/`，组件内不写内联样式
- CSS 数值必须带单位（`12px`，不是 `12`），缺单位浏览器会整条丢弃
- 后端接口统一返回 `{ data, meta }`，参数白名单校验在 `backend/lib/validate.ts`

## 验证

| 改动 | 命令 |
| --- | --- |
| 前端 | `cd frontend && npx tsc --noEmit` |
| 后端类型 | `cd backend && npx tsc --noEmit` |
| 接口冒烟 | `bash backend/scripts/smoke.sh`（需后端在 3000 端口） |

前端要真正跑起来，`frontend/src/components/` 下被 `App.tsx` 引用的每个组件都必须导出 default，空文件会导致整页白屏。
