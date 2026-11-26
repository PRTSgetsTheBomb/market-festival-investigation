# market-analysis

澳洲连锁超市节庆销售分析：生产库只读导出 → 本地建分析表 → Next.js 只读 API → React + ECharts 前端看板。

## 项目结构

```
backend/               Next.js 14 API（Route Handlers + mysql2 连接池）
frontend/              Vite + React 18 + ECharts 前端
data/                  导出的 CSV
queries/               导出用 SQL
market-sql-da-intern/  前期口径梳理、建表与补丁脚本
out/                   图表与中间产物
load_check.py          CSV 行数与一致性校验
start.bat / stop.bat   本地一键启动 / 关闭 SSH 隧道
```

`data/`、`queries/`、`market-sql-da-intern/`、`out/`、`tunnel.cmd` 属本地数据与内网配置，未纳入版本控制。

## 数据链路

1. 在 Workbench 跑 `queries/` 里的导出 SQL，把结果导出成 CSV 放到 `data/`
2. 用 `market-sql-da-intern/` 的建表脚本在本地库建 `c_calendar`、`c_daily_group`、`c_index_dow`、`c_sku_lift` 等表，以及 `v_yoy` 视图
3. `backend/` 通过 mysql2 只读查询上述表，暴露 `/api/*` 接口
4. `frontend/` 调 `/api/*` 渲染图表

## 环境要求

- Node.js 18+
- Python 3.8+（只有 `load_check.py` 用到）
- 一个只读 MySQL 账号；本地通过 SSH 隧道映射到 `127.0.0.1:3307`（`tunnel.cmd`）

## 后端配置

`backend/.env.local`（不入库）：

```
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=...
DB_PASSWORD=...
DB_NAME=prod_20261023
```

未设置时回落到上面的默认值（密码默认为空）。

## 本地启动

1. `start.bat` —— 先拉起 SSH 隧道（3307），再在 `backend/` 跑 `next dev`，服务在 <http://localhost:3000>
2. `cd frontend` → `npm install` → `npm run dev`，Vite 在 <http://localhost:5173>，`/api` 已代理到 3000 端口
3. `stop.bat` 关闭隧道（后端窗口需手动关闭）

后端首页 <http://localhost:3000> 列出了几个可直接点开的示例接口。

## API

统一返回 `{ data: [...], meta: {...} }`；出错返回 `{ error: string }` 并带对应状态码。

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `GET /api/yoy` | `holiday` 必填，`biz_group` 选填 | 节庆窗口内的同比日曲线。不传 `biz_group` 读现成的 `v_yoy` 视图，传了就实时聚合 |
| `GET /api/trend` | `holiday` 必填，`biz_group` 选填 | 窗口内每日 `sales` / `qty`，附 `day_offset` 与 `before` / `during` / `after` 相位 |
| `GET /api/comparison` | `holiday` 必填，`yr` 选填 | 各业务组的星期对齐指数 `idx`（1.00 为常态） |
| `GET /api/top-products` | `holiday` 必填，`yr` 选填（默认 2024），`limit` 选填（1–100，默认 20） | 按 `uplift` 降序的爆款商品 |

参数白名单，不在表内直接 400：

- `holiday`：Easter、Zhongqiu、Lunar New Year、Christmas & New Year、AFL Grand Final、Duanwu、Yuanxiao、Australia Day、Anzac Day、Melbourne Cup、Mothers Day
- `biz_group`：Asian Grocery、Baby、Bakery & Festive、Fresh & Frozen、Health & Supplements、Household、In-store Food & Wholesale、Manual Price、Personal Care、Snacks Drinks Liquor
- `yr`：2023 – 2026

冒烟测试（含负例）：

```bash
bash backend/scripts/smoke.sh            # 默认 http://localhost:3000
bash backend/scripts/smoke.sh http://localhost:3001
```

## 数据校验

1. Workbench 里跑 `queries/01-extract.sql` 的 Q1，Result Grid 右上角导出 → `data/daily_store.csv`（约 1,391 行）
2. 跑 Q2，同样导出 → `data/daily_category.csv`（约 11,000 行）
3. `python load_check.py`

导出对话框里注意三点：格式 CSV、分隔符逗号、编码 UTF-8。

校验通过的标准：

- 行数：1,391 / 约 11,000
- 日期范围：2023-01-01 → 2026-10-22
- 每年天数：365 / 366 / 365 / 295
- 日级合计 = 品类级合计（差异 0）
- 无「未分类」品类
- 大类占比：生鲜 39.6%、亚洲 32.1%、零食饮料酒水 23.4%

## 数据快照

API 服务的库为 `prod_20261023`，覆盖 2023-12-01 → 2026-10-22。
