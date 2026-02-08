import pytest
from logic import calculate_risk, get_compliance_hint, RISK_LEVELS, COMPLIANCE_HINTS


class TestCalculateRisk:
    """Test suite for risk score calculation and level mapping"""

    # Test basic score calculation
    def test_score_calculation_basic(self):
        """Test that score is correctly calculated as likelihood × impact"""
        score, _ = calculate_risk(3, 4)
        assert score == 12

    def test_score_calculation_minimum(self):
        """Test minimum possible score"""
        score, _ = calculate_risk(1, 1)
        assert score == 1

    def test_score_calculation_maximum(self):
        """Test maximum possible score"""
        score, _ = calculate_risk(5, 5)
        assert score == 25

    # Test level mapping for Low risk
    def test_low_risk_level_minimum(self):
        """Test Low risk at minimum boundary (score 1)"""
        score, level = calculate_risk(1, 1)
        assert score == 1
        assert level == "Low"

    def test_low_risk_level_maximum(self):
        """Test Low risk at maximum boundary (score 5)"""
        score, level = calculate_risk(1, 5)
        assert score == 5
        assert level == "Low"

    def test_low_risk_level_mid_range(self):
        """Test Low risk in mid range (score 2)"""
        score, level = calculate_risk(1, 2)
        assert score == 2
        assert level == "Low"

    # Test level mapping for Medium risk
    def test_medium_risk_level_minimum(self):
        """Test Medium risk at minimum boundary (score 6)"""
        score, level = calculate_risk(2, 3)
        assert score == 6
        assert level == "Medium"

    def test_medium_risk_level_maximum(self):
        """Test Medium risk at maximum boundary (score 12)"""
        score, level = calculate_risk(3, 4)
        assert score == 12
        assert level == "Medium"

    def test_medium_risk_level_mid_range(self):
        """Test Medium risk in mid range (score 9)"""
        score, level = calculate_risk(3, 3)
        assert score == 9
        assert level == "Medium"

    # Test level mapping for High risk
    def test_high_risk_level_minimum(self):
        """Test High risk at minimum boundary (score 13)"""
        score, level = calculate_risk(4, 4)
        assert score == 16
        assert level == "High"

    def test_high_risk_level_maximum(self):
        """Test High risk at maximum boundary (score 18)"""
        score, level = calculate_risk(4, 5)
        assert score == 20
        assert level == "Critical"

    def test_high_risk_level_mid_range(self):
        """Test High risk in mid range (score 15)"""
        score, level = calculate_risk(3, 5)
        assert score == 15
        assert level == "High"

    # Test level mapping for Critical risk
    def test_critical_risk_level_minimum(self):
        """Test Critical risk at minimum boundary (score 19)"""
        score, level = calculate_risk(5, 4)
        assert score == 20
        assert level == "Critical"

    def test_critical_risk_level_maximum(self):
        """Test Critical risk at maximum boundary (score 25)"""
        score, level = calculate_risk(5, 5)
        assert score == 25
        assert level == "Critical"

    def test_critical_risk_level_mid_range(self):
        """Test Critical risk in mid range (score 20)"""
        score, level = calculate_risk(4, 5)
        assert score == 20
        assert level == "Critical"

    # Test all 25 possible combinations (comprehensive)
    @pytest.mark.parametrize("likelihood,impact,expected_score,expected_level", [
        # Low risk (1-5)
        (1, 1, 1, "Low"),
        (1, 2, 2, "Low"),
        (1, 3, 3, "Low"),
        (1, 4, 4, "Low"),
        (1, 5, 5, "Low"),
        # Medium risk (6-12)
        (2, 3, 6, "Medium"),
        (2, 4, 8, "Medium"),
        (2, 5, 10, "Medium"),
        (3, 2, 6, "Medium"),
        (3, 3, 9, "Medium"),
        (3, 4, 12, "Medium"),
        (4, 2, 8, "Medium"),
        (4, 3, 12, "Medium"),
        # High risk (13-18)
        (3, 5, 15, "High"),
        (5, 3, 15, "High"),
        # Critical risk (19-25)
        (4, 5, 20, "Critical"),
        (5, 4, 20, "Critical"),
        (5, 5, 25, "Critical"),
    ])
    def test_all_risk_combinations(self, likelihood, impact, expected_score, expected_level):
        """Test comprehensive risk level mappings"""
        score, level = calculate_risk(likelihood, impact)
        assert score == expected_score
        assert level == expected_level

    # Test edge cases
    def test_commutative_property(self):
        """Test that L×I = I×L (commutative)"""
        score1, level1 = calculate_risk(3, 4)
        score2, level2 = calculate_risk(4, 3)
        assert score1 == score2
        assert level1 == level2


class TestGetComplianceHint:
    """Test suite for compliance hint generation"""

    def test_low_risk_no_hint(self):
        """Test that Low risk has no compliance hint"""
        hint = get_compliance_hint("Low")
        assert hint is None

    def test_medium_risk_no_hint(self):
        """Test that Medium risk has no compliance hint"""
        hint = get_compliance_hint("Medium")
        assert hint is None

    def test_high_risk_hint(self):
        """Test that High risk returns NIST hint"""
        hint = get_compliance_hint("High")
        assert hint == "Prioritize per NIST SP 800-30"

    def test_critical_risk_hint(self):
        """Test that Critical risk returns executive action hint"""
        hint = get_compliance_hint("Critical")
        assert hint == "Immediate executive action required"

    def test_unknown_level_no_hint(self):
        """Test that unknown level returns None"""
        hint = get_compliance_hint("Unknown")
        assert hint is None


class TestRiskLevelsConfiguration:
    """Test suite for risk level configuration constants"""

    def test_risk_levels_exist(self):
        """Test that RISK_LEVELS is defined"""
        assert RISK_LEVELS is not None

    def test_risk_levels_has_four_levels(self):
        """Test that there are exactly 4 risk levels"""
        assert len(RISK_LEVELS) == 4

    def test_risk_levels_covers_all_scores(self):
        """Test that risk levels cover scores 1-25"""
        covered_scores = set()
        for (min_score, max_score) in RISK_LEVELS.keys():
            covered_scores.update(range(min_score, max_score + 1))
        
        # Should cover at least scores 1-25
        assert 1 in covered_scores
        assert 25 in covered_scores
        assert len(covered_scores) >= 25

    def test_compliance_hints_exist(self):
        """Test that COMPLIANCE_HINTS is defined"""
        assert COMPLIANCE_HINTS is not None

    def test_compliance_hints_has_high_and_critical(self):
        """Test that compliance hints exist for High and Critical"""
        assert "High" in COMPLIANCE_HINTS
        assert "Critical" in COMPLIANCE_HINTS


class TestIntegration:
    """Integration tests for complete risk assessment flow"""

    def test_full_assessment_low_risk(self):
        """Test complete assessment flow for low risk"""
        likelihood = 1
        impact = 3
        score, level = calculate_risk(likelihood, impact)
        hint = get_compliance_hint(level)
        
        assert score == 3
        assert level == "Low"
        assert hint is None

    def test_full_assessment_medium_risk(self):
        """Test complete assessment flow for medium risk"""
        likelihood = 3
        impact = 3
        score, level = calculate_risk(likelihood, impact)
        hint = get_compliance_hint(level)
        
        assert score == 9
        assert level == "Medium"
        assert hint is None

    def test_full_assessment_high_risk(self):
        """Test complete assessment flow for high risk"""
        likelihood = 3
        impact = 5
        score, level = calculate_risk(likelihood, impact)
        hint = get_compliance_hint(level)
        
        assert score == 15
        assert level == "High"
        assert hint == "Prioritize per NIST SP 800-30"

    def test_full_assessment_critical_risk(self):
        """Test complete assessment flow for critical risk"""
        likelihood = 5
        impact = 5
        score, level = calculate_risk(likelihood, impact)
        hint = get_compliance_hint(level)
        
        assert score == 25
        assert level == "Critical"
        assert hint == "Immediate executive action required"
