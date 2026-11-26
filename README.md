# market-analysis

C 方案：库里只读导出，本地做分析。

## 目录

    data/       CSV 放这里（也是 category_map.csv 的家）
    queries/    导出用的 SQL
    out/        图表和中间结果
    load_check.py

## 三步

1. Workbench 里跑 `queries/01-extract.sql` 的 Q1，Result Grid 右上角导出
   → `data/daily_store.csv`（约 1,391 行）
2. 跑 Q2，同样导出 → `data/daily_category.csv`（约 11,000 行）
3. `python load_check.py`

导出对话框里注意三点：格式 CSV、分隔符逗号、编码 UTF-8。

## 校验通过的标准

- 行数：1,391 / 约 11,000
- 日期范围：2023-01-01 → 2026-10-22
- 每年天数：365 / 366 / 365 / 295
- 日级合计 = 品类级合计（差异 0）
- 无"未分类"品类
- 大类占比：生鲜 39.6%、亚洲 32.1%、零食饮料酒水 23.4%

## 下一步

`data/daily_biz_group.csv` 是品类映射后的结果，DID 和节日窗口都基于它。
