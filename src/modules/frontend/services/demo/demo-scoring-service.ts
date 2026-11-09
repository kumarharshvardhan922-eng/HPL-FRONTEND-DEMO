import { AnySportScoreState, Match, ScoreEvent, ScoringService } from "../../types";
import { SHOWCASE_MATCH } from "../../showcase/showcase";

export class DemoScoringService implements ScoringService {
  private match: Match = { ...SHOWCASE_MATCH };
  private listeners: Set<(match: Match) => void> = new Set();

  async recordEvent(matchId: string, event: Omit<ScoreEvent, "id" | "timestamp">): Promise<{ match: Match; event: ScoreEvent }> {
    const fullEvent: ScoreEvent = {
      ...event,
      id: `ev-demo-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isDemo: true,
    };
    this.match.events.unshift(fullEvent);
    this.match.lastUpdated = new Date().toISOString();
    this.listeners.forEach((cb) => cb({ ...this.match }));
    return { match: { ...this.match }, event: fullEvent };
  }

  async undoLastEvent(matchId: string): Promise<Match> {
    if (this.match.events.length > 0) {
      this.match.events.shift();
      this.match.lastUpdated = new Date().toISOString();
      this.listeners.forEach((cb) => cb({ ...this.match }));
    }
    return { ...this.match };
  }

  async manualOverrideScore(matchId: string, newScoreState: AnySportScoreState, reason: string): Promise<Match> {
    this.match.scoreState = newScoreState;
    this.match.lastUpdated = new Date().toISOString();
    this.listeners.forEach((cb) => cb({ ...this.match }));
    return { ...this.match };
  }

  subscribeLiveMatch(matchId: string, callback: (match: Match) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

