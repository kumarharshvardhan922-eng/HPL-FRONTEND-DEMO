import { Match } from "../types";
import { formatTimeOnly, formatDateTime } from "./formatters";

export interface MatchScoreDisplay {
  scoreA: string;
  scoreB: string;
  combinedScore: string;
  subScoreA?: string;
  subScoreB?: string;
  minuteOrStatus: string;
  isLive: boolean;
}

export function getMatchScoreDisplay(match: Match): MatchScoreDisplay {
  const isLive = match.status === "live";
  const state = match.scoreState;

  if (!state) {
    return {
      scoreA: "-",
      scoreB: "-",
      combinedScore: "- : -",
      minuteOrStatus: isLive ? "LIVE" : match.status.toUpperCase(),
      isLive,
    };
  }

  switch (state.sportId) {
    case "cricket": {
      const sA = `${state.runsA}/${state.wicketsA}`;
      const sB = `${state.runsB}/${state.wicketsB}`;
      const ovA = `(${state.oversA}.${state.ballsA} ov)`;
      const ovB = `(${state.oversB}.${state.ballsB} ov)`;
      const activeOvers =
        state.currentInnings === 1
          ? `${state.oversA}.${state.ballsA} ov`
          : `${state.oversB}.${state.ballsB} ov`;

      return {
        scoreA: sA,
        scoreB: sB,
        combinedScore: `${sA} : ${sB}`,
        subScoreA: ovA,
        subScoreB: ovB,
        minuteOrStatus: isLive ? activeOvers : match.status === "completed" ? "FT" : match.status.toUpperCase(),
        isLive,
      };
    }
    case "football": {
      const sA = `${state.goalsA}`;
      const sB = `${state.goalsB}`;
      const min = `${state.matchTimeMinutes}'`;
      return {
        scoreA: sA,
        scoreB: sB,
        combinedScore: `${sA} : ${sB}`,
        minuteOrStatus: isLive ? min : match.status === "completed" ? "FT" : match.status.toUpperCase(),
        isLive,
      };
    }
    case "kabaddi": {
      const sA = `${state.scoreA}`;
      const sB = `${state.scoreB}`;
      const half = `H${state.currentHalf}`;
      return {
        scoreA: sA,
        scoreB: sB,
        combinedScore: `${sA} : ${sB}`,
        minuteOrStatus: isLive ? half : match.status === "completed" ? "FT" : match.status.toUpperCase(),
        isLive,
      };
    }
    case "badminton": {
      const sA = `${state.setsWonA}`;
      const sB = `${state.setsWonB}`;
      const gameScore = `(${state.currentScoreA}-${state.currentScoreB})`;
      return {
        scoreA: sA,
        scoreB: sB,
        combinedScore: `${sA} : ${sB}`,
        subScoreA: isLive ? `${state.currentScoreA}` : undefined,
        subScoreB: isLive ? `${state.currentScoreB}` : undefined,
        minuteOrStatus: isLive ? `Game ${state.currentGame}` : match.status === "completed" ? "FT" : match.status.toUpperCase(),
        isLive,
      };
    }
    case "volleyball": {
      const sA = `${state.setsWonA}`;
      const sB = `${state.setsWonB}`;
      return {
        scoreA: sA,
        scoreB: sB,
        combinedScore: `${sA} : ${sB}`,
        subScoreA: isLive ? `${state.currentScoreA}` : undefined,
        subScoreB: isLive ? `${state.currentScoreB}` : undefined,
        minuteOrStatus: isLive ? `Set ${state.currentSet}` : match.status === "completed" ? "FT" : match.status.toUpperCase(),
        isLive,
      };
    }
    case "basketball": {
      const sA = `${state.scoreA}`;
      const sB = `${state.scoreB}`;
      return {
        scoreA: sA,
        scoreB: sB,
        combinedScore: `${sA} : ${sB}`,
        minuteOrStatus: isLive ? `Q${state.currentQuarter}` : match.status === "completed" ? "FT" : match.status.toUpperCase(),
        isLive,
      };
    }
    default:
      return {
        scoreA: "0",
        scoreB: "0",
        combinedScore: "0 : 0",
        minuteOrStatus: isLive ? "LIVE" : match.status.toUpperCase(),
        isLive,
      };
  }
}
