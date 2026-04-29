#!/bin/bash

# Email System Individual Test Runner
# Run single tests to isolate issues

SERVER_URL="${1:-http://localhost:3000}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Email System Individual Test Runner"
echo "Server: $SERVER_URL"
echo ""

# Prompt for test email
while true; do
  read -rp "Enter test email address: " TEST_EMAIL
  if [[ "$TEST_EMAIL" =~ ^[^@]+@[^@]+\.[^@]+$ ]]; then
    break
  else
    echo -e "${RED}Invalid email address. Please try again.${NC}"
  fi
done
echo ""

# Test connectivity
echo "Checking server connectivity..."
if ! curl -s -m 5 "$SERVER_URL/api/emails?action=stats" > /dev/null 2>&1; then
  echo "ERROR: Cannot connect to $SERVER_URL"
  echo "Make sure your dev server is running: npm run dev"
  exit 1
fi
echo "Server is reachable"
echo ""

# Test 1: Test Email
echo "Test 1: Send Test Email"
echo "-----------------------"
echo "Sending to: $TEST_EMAIL"
RESPONSE=$(curl -s -X POST "$SERVER_URL/api/emails" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"test\",\"email\":\"$TEST_EMAIL\"}")
echo "Response:"
echo "$RESPONSE" | jq . || echo "$RESPONSE"
echo ""

# To Do - Remaining steps
# Awaiting a working backend to
# test functionality including Email Log data read/write.

# Test 2: Email Statistics
#echo "Test 2: Email Statistics (7 days)"
# echo "---------------------------------"
# RESPONSE=$(curl -s "$SERVER_URL/api/emails?action=stats&days=7")
# echo "Response:"
# echo "$RESPONSE" | jq . || echo "$RESPONSE"
# echo ""

# Test 3: Email Logs
# echo "Test 3: Email Logs (Last 10)"
# echo "----------------------------"
# RESPONSE=$(curl -s "$SERVER_URL/api/emails?action=logs&limit=10&page=1")
# echo "Response:"
# echo "$RESPONSE" | jq . || echo "$RESPONSE"
# echo ""

echo "Test Run Complete"