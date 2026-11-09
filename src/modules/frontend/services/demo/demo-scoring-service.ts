import { AnySportScoreState, Match, ScoreEvent, ScoringService } from "../../types";
import { SHOWCASE_MATCHES } from "../../showcase/showcase";

export class DemoScoringService implements ScoringService {
  private matches: Map<string, Match> = new Map(
    SHOWCASE_MATCHES.map((m) => [m.id, { ...m, events: [...m.events] }])
  );
  private listeners: Map<string, Set<(match: Match) => void>> = new Map();

  private getOrCreateMatch(matchId: string): Match {
    if (!this.matches.has(matchId)) {
      const fallback = SHOWCASE_MATCHES.find((m) => m.id === matchId) || SHOWCASE_MATCHES[0];
      this.matches.set(matchId, { ...fallback, id: matchId, events: [...fallback.events] });
    }
    return this.matches.get(matchId)!;
  }

  async recordEvent(
    matchId: string,
    event: Omit<ScoreEvent, "id" | "timestamp">
  ): Promise<{ match: Match; event: ScoreEvent }> {
    const match = this.getOrCreateMatch(matchId);
    const fullEvent: ScoreEvent = {
      ...event,
      id: `ev-demo-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isDemo: true,
    };
    match.events.unshift(fullEvent);
    match.lastUpdated = new Date().toISOString();
    this.notify(matchId, match);
    return { match: { ...match }, event: fullEvent };
  }

  async undoLastEvent(matchId: string): Promise<Match> {
    const match = this.getOrCreateMatch(matchId);
    if (match.events.length > 0) {
      match.events.shift();
      match.lastUpdated = new Date().toISOString();
      this.notify(matchId, match);
    }
    return { ...match };
  }

  async manualOverrideScore(
    matchId: string,
    newScoreState: AnySportScoreState,
    _reason: string
  ): Promise<Match> {
    const match = this.getOrCreateMatch(matchId);
    match.scoreState = newScoreState;
    match.lastUpdated = new Date().toISOString();
    this.notify(matchId, match);
    return { ...match };
  }

  subscribeLiveMatch(matchId: string, callback: (match: Match) => void): () => void {
    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, new Set());
    }
    this.listeners.get(matchId)!.add(callback);
    return () => this.listeners.get(matchId)?.delete(callback);
  }

  private notify(matchId: string, match: Match) {
    this.listeners.get(matchId)?.forEach((cb) => cb({ ...match }));
  }
}
