"""
Script to run unit tests and display results
"""
import subprocess
import sys

print("=" * 70)
print("Running Unit Tests for GRC Risk Assessment")
print("=" * 70)
print()

# Run pytest with verbose output
result = subprocess.run(
    [sys.executable, "-m", "pytest", "test_logic.py", "-v", "--tb=short"],
    capture_output=True,
    text=True
)

# Print output
print(result.stdout)
if result.stderr:
    print(result.stderr)

# Exit with same code as pytest
sys.exit(result.returncode)
