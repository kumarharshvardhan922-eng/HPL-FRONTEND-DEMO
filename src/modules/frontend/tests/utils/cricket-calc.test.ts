import { describe, it, expect } from "vitest";
import {
  oversToBalls,
  ballsToOvers,
  addBallToOvers,
  calculateRunRate,
  calculateRequiredRunRate,
  calculateStrikeRate,
  calculateEconomy,
  calculateNetRunRate,
} from "../../utils/cricket-calc";

describe("Cricket Calculations", () => {
  it("converts overs and balls accurately", () => {
    expect(oversToBalls(18, 2)).toBe(110);
    expect(oversToBalls(0, 5)).toBe(5);
    expect(oversToBalls(20, 0)).toBe(120);

    expect(ballsToOvers(110)).toEqual({ overs: 18, balls: 2, display: "18.2" });
    expect(ballsToOvers(119)).toEqual({ overs: 19, balls: 5, display: "19.5" });
    expect(ballsToOvers(120)).toEqual({ overs: 20, balls: 0, display: "20.0" });
  });

  it("handles ball addition across over boundaries", () => {
    expect(addBallToOvers(18, 5)).toEqual({ overs: 19, balls: 0, display: "19.0" });
    expect(addBallToOvers(18, 2)).toEqual({ overs: 18, balls: 3, display: "18.3" });
  });

  it("calculates current run rate (CRR)", () => {
    // 168 runs in 18.2 overs (110 balls) -> (168 / 110) * 6 = 9.16
    expect(calculateRunRate(168, 18, 2)).toBe(9.16);
    expect(calculateRunRate(0, 0, 0)).toBe(0);
  });

  it("calculates required run rate (RRR)", () => {
    // Target 173, current 168 in 18.2 overs, 20 overs total -> 5 runs needed in 10 balls -> (5/10)*6 = 3.0
    expect(calculateRequiredRunRate(173, 168, 20, 18, 2)).toBe(3.0);
    // Already achieved
    expect(calculateRequiredRunRate(160, 168, 20, 18, 2)).toBe(0);
  });

  it("calculates batsman strike rate and bowler economy", () => {
    // 74 runs from 46 balls -> 160.87
    expect(calculateStrikeRate(74, 46)).toBe(160.87);
    expect(calculateStrikeRate(0, 0)).toBe(0);

    // 28 runs conceded in 3.2 overs (20 balls) -> (28 / 20) * 6 = 8.4
    expect(calculateEconomy(28, 3, 2)).toBe(8.4);
  });

  it("calculates net run rate (NRR)", () => {
    // Team scored 170 in 20 ov (8.5), conceded 150 in 20 ov (7.5) -> NRR = +1.000
    const nrr = calculateNetRunRate(170, 20, 0, 150, 20, 0);
    expect(nrr).toBe(1.0);
  });
});

