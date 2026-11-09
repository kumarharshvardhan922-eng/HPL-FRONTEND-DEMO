import { describe, it, expect } from "vitest";
import { calculateGoalDifference, calculatePoints } from "../../utils/football-calc";
import { calculateTotalScore, isSuperRaid, isSuperTackle } from "../../utils/kabaddi-calc";
import { checkGameWinner, checkBadmintonMatchWinner } from "../../utils/badminton-calc";
import { checkSetWinner, checkVolleyballMatchWinner } from "../../utils/volleyball-calc";
import { isBonusSituation, formatGameClock, calculateBasketballTotal } from "../../utils/basketball-calc";

describe("Other Sports Calculations", () => {
  it("calculates football goal difference and points", () => {
    expect(calculateGoalDifference(12, 4)).toBe(8);
    expect(calculateGoalDifference(2, 5)).toBe(-3);
    expect(calculatePoints(3, 1)).toBe(10); // 3*3 + 1
  });

  it("calculates kabaddi scores and checks super raids/tackles", () => {
    // 22 raid + 8 tackle + 4 bonus + 1 allout (2 pts) = 36
    expect(calculateTotalScore(22, 8, 4, 1)).toBe(36);
    expect(isSuperRaid(3)).toBe(true);
    expect(isSuperRaid(2)).toBe(false);
    expect(isSuperTackle(3)).toBe(true);
    expect(isSuperTackle(2)).toBe(true);
    expect(isSuperTackle(4)).toBe(false);
  });

  it("enforces badminton best of 3, 21-point, win-by-2 and 30-cap rules", () => {
    // 21-19 is a win
    expect(checkGameWinner(21, 19)).toBe("A");
    // 21-20 is not won yet (needs win by 2)
    expect(checkGameWinner(21, 20)).toBe(null);
    // 23-21 is a win
    expect(checkGameWinner(23, 21)).toBe("A");
    // 29-29 capped at 30
    expect(checkGameWinner(30, 29)).toBe("A");
    expect(checkBadmintonMatchWinner(2, 1)).toBe("A");
    expect(checkBadmintonMatchWinner(1, 1)).toBe(null);
  });

  it("enforces volleyball best of 5 sets, 25-point, and 5th set 15-point rules", () => {
    // Set 1: 25-23 is a win
    expect(checkSetWinner(1, 25, 23)).toBe("A");
    // Set 1: 25-24 not won yet
    expect(checkSetWinner(1, 25, 24)).toBe(null);
    // 5th set tiebreaker is to 15
    expect(checkSetWinner(5, 15, 13)).toBe("A");
    expect(checkSetWinner(5, 14, 13)).toBe(null);
    expect(checkVolleyballMatchWinner(3, 1)).toBe("A");
    expect(checkVolleyballMatchWinner(2, 2)).toBe(null);
  });

  it("checks basketball team bonus and clocks", () => {
    expect(isBonusSituation(4)).toBe(false);
    expect(isBonusSituation(5)).toBe(true);
    expect(isBonusSituation(7)).toBe(true);
    expect(formatGameClock(185)).toBe("03:05");
    expect(calculateBasketballTotal(5, 10, 4)).toBe(37); // 5*1 + 10*2 + 4*3 = 37
  });
});
