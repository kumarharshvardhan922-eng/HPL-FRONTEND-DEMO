import { AnySportScoreState, Match, NotFoundError, ScoreEvent, ScoringService, ValidationError } from "../../types";
import { MOCK_MATCHES } from "../../mocks/matches-registry";
import { deepClone, simulateLatency } from "./mock-utils";

type Listener = (match: Match) => void;

export class MockScoringService implements ScoringService {
  private matches: Match[] = deepClone(MOCK_MATCHES);
  private listeners: Map<string, Set<Listener>> = new Map();

  private notify(matchId: string) {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) return;
    const subs = this.listeners.get(matchId);
    if (subs) {
      subs.forEach((cb) => cb(deepClone(match)));
    }
  }

  async recordEvent(
    matchId: string,
    eventData: Omit<ScoreEvent, "id" | "timestamp">
  ): Promise<{ match: Match; event: ScoreEvent }> {
    await simulateLatency(200, 500);
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new NotFoundError("Match", matchId);

    const event: ScoreEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isUndoable: true,
    };

    match.events.unshift(event);
    match.lastUpdated = new Date().toISOString();
    this.notify(matchId);

    return { match: deepClone(match), event: deepClone(event) };
  }

  async undoLastEvent(matchId: string): Promise<Match> {
    await simulateLatency(200, 400);
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new NotFoundError("Match", matchId);

    const undoableIndex = match.events.findIndex((e) => e.isUndoable !== false);
    if (undoableIndex !== -1) {
      match.events.splice(undoableIndex, 1);
    }
    match.lastUpdated = new Date().toISOString();
    this.notify(matchId);
    return deepClone(match);
  }

  async manualOverrideScore(matchId: string, newScoreState: AnySportScoreState, reason: string): Promise<Match> {
    await simulateLatency(300, 600);
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new NotFoundError("Match", matchId);
    if (!reason || reason.trim().length < 5) {
      throw new ValidationError("A clear override reason is required (minimum 5 characters).", {
        reason: "Reason too short",
      });
    }

    match.scoreState = deepClone(newScoreState);
    match.events.unshift({
      id: `ev-override-${Date.now()}`,
      matchId,
      sportId: match.sportId,
      timestamp: new Date().toISOString(),
      displayTime: "MANUAL",
      eventType: "score_override",
      teamId: match.teamAId,
      detail: `Manual score override applied: ${reason}`,
      isUndoable: false,
    });
    match.lastUpdated = new Date().toISOString();
    this.notify(matchId);
    return deepClone(match);
  }

  subscribeLiveMatch(matchId: string, callback: (match: Match) => void): () => void {
    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, new Set());
    }
    this.listeners.get(matchId)!.add(callback);

    // Immediately push current state
    const current = this.matches.find((m) => m.id === matchId);
    if (current) {
      callback(deepClone(current));
    }

    return () => {
      const subs = this.listeners.get(matchId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.listeners.delete(matchId);
        }
      }
    };
  }
}

