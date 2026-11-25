#!/usr/bin/env bash
# Usage: bash scripts/smoke.sh [base-url]
set -u
BASE="${1:-http://localhost:3000}"

check() {
    local url="$1"
    local code
    code=$(curl -s -o /tmp/smoke_body.json -w "%{http_code}" "$url")
    local size
    size=$(wc -c < /tmp/smoke_body.json | tr -d ' ')
    printf "%-88s %s  %s bytes\n" "$url" "$code" "$size"
    if [ "$code" != "200" ]; then head -c 300 /tmp/smoke_body.json; echo; fi
}

check "$BASE/api/yoy?holiday=Easter"
check "$BASE/api/yoy?holiday=Easter&biz_group=Fresh%20%26%20Frozen"
check "$BASE/api/trend?holiday=Easter"
check "$BASE/api/trend?holiday=Easter&biz_group=Fresh%20%26%20Frozen"
check "$BASE/api/comparison?holiday=Zhongqiu"
check "$BASE/api/comparison?holiday=Zhongqiu&yr=2024"
check "$BASE/api/top-products?holiday=Zhongqiu&yr=2024&limit=5"
check "$BASE/api/top-products?holiday=Easter&yr=2024&limit=5"

echo
echo "negative tests (expect 400):"
check "$BASE/api/yoy?holiday=Chuseok"
check "$BASE/api/comparison?holiday=Easter&yr=2019"
check "$BASE/api/top-products?holiday=Easter&limit=999"