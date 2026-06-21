#!/usr/bin/env bash
set -uo pipefail
cd /home/claude/wurth-backend

PORT=3000 SEED_PASSWORD=wurth1234 node dist/server.js > /tmp/srv.log 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT

# wait for health
for i in $(seq 1 30); do
  if curl -sf -m 2 http://localhost:3000/health >/dev/null 2>&1; then break; fi
  sleep 0.3
done

B=http://localhost:3000
pass=0; fail=0
check() { # desc, expected_substr, actual
  if echo "$3" | grep -q "$2"; then echo "  PASS  $1"; pass=$((pass+1));
  else echo "  FAIL  $1 -> $3"; fail=$((fail+1)); fi
}

echo "== health =="
check "health ok" '"status":"ok"' "$(curl -s $B/health)"

echo "== auth =="
LOGIN=$(curl -s -X POST $B/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"u1","password":"wurth1234"}')
check "login by id returns role" '"role"' "$LOGIN"
check "login returns token" '"token"' "$LOGIN"
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
EMAIL=$(echo "$LOGIN" | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "  (derived email: $EMAIL)"
check "login by derived email" '"id":"u1"' \
  "$(curl -s -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"wurth1234\"}")"
check "bad password rejected" 'Invalid email or password' \
  "$(curl -s -X POST $B/api/auth/login -H 'Content-Type: application/json' -d '{"email":"u1","password":"nope"}')"
check "me returns user" '"id":"u1"' \
  "$(curl -s $B/api/auth/me -H "Authorization: Bearer $TOKEN")"
check "me without token 401" '401' \
  "$(curl -s $B/api/auth/me)"

echo "== public reads =="
check "users list" '"total"' "$(curl -s $B/api/users)"
check "single user" '"name"' "$(curl -s $B/api/users/u1)"
check "posts list" '"data"' "$(curl -s $B/api/posts)"
check "jobs list" '"data"' "$(curl -s $B/api/jobs)"
check "job-listings" '"data"' "$(curl -s $B/api/job-listings)"
check "bounties" '"data"' "$(curl -s $B/api/bounties)"
check "communities" '"data"' "$(curl -s $B/api/communities)"
check "news" '"data"' "$(curl -s $B/api/news)"
check "we-feed" '"data"' "$(curl -s $B/api/we-feed)"
check "nexus members" '\[' "$(curl -s $B/api/nexus/members)"
check "github portfolio" '"username"' "$(curl -s $B/api/github/alex-mueller/portfolio)"
check "github 404" '404' "$(curl -s $B/api/github/nobody/portfolio)"

echo "== authed writes =="
check "like a post" '"likes"' \
  "$(curl -s -X POST $B/api/posts/p1/like -H "Authorization: Bearer $TOKEN")"
check "create post" '"id"' \
  "$(curl -s -X POST $B/api/posts -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"content":"hello from test"}')"
check "apply to bounty" '"applied":true' \
  "$(curl -s -X POST $B/api/bounties/b1/apply -H "Authorization: Bearer $TOKEN")"
check "write without auth 401" '401' \
  "$(curl -s -X POST $B/api/posts -H 'Content-Type: application/json' -d '{"content":"x"}')"

echo "== admin RBAC =="
check "student blocked from admin 403" '403' \
  "$(curl -s $B/api/admin/analytics/metrics -H "Authorization: Bearer $TOKEN")"
# find an admin user and log in
ADMIN_EMAIL=$(curl -s "$B/api/users?role=corporate_admin" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$ADMIN_EMAIL" ]; then
  ATOK=$(curl -s -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"wurth1234\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  check "admin can read metrics" '\[' "$(curl -s $B/api/admin/analytics/metrics -H "Authorization: Bearer $ATOK")"
else
  echo "  INFO  no corporate_admin seed user (admin RBAC path uses register)"
  AREG=$(curl -s -X POST $B/api/auth/register -H 'Content-Type: application/json' -d '{"email":"admin@wurth.dev","password":"secret123","name":"Admin","role":"corporate_admin"}')
  ATOK=$(echo "$AREG" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  check "registered admin reads metrics" '\[' "$(curl -s $B/api/admin/analytics/metrics -H "Authorization: Bearer $ATOK")"
fi

echo "== 404 =="
check "unknown route 404" '404' "$(curl -s $B/api/does-not-exist)"

echo ""
echo "RESULT: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
