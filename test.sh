#!/bin/bash

# Run tests for catalogue service
echo "Running catalogue service tests..."
cd catalogue-service
npm test
TEST_EXIT_CODE_1=$?

# Run tests for commande service
echo "Running commande service tests..."
cd ../commande-service
npm test
TEST_EXIT_CODE_2=$?

# Check if any tests failed
if [ $TEST_EXIT_CODE_1 -ne 0 ] || [ $TEST_EXIT_CODE_2 -ne 0 ]; then
  echo "Tests failed!"
  exit 1
else
  echo "All tests passed!"
  exit 0
fi
