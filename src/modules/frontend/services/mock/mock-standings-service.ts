import { SportId, Standing, StandingsService } from "../../types";
import { MOCK_STANDINGS } from "../../mocks/standings-data";
import { deepClone, simulateLatency } from "./mock-utils";

export class MockStandingsService implements StandingsService {
  private standings = deepClone(MOCK_STANDINGS);

  async getStandings(sportId: SportId): Promise<Standing[]> {
    await simulateLatency();
    const list = this.standings[sportId] || [];
    return deepClone(list);
  }
}

