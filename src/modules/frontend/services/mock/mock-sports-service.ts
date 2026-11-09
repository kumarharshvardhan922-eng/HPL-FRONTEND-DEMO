import { NotFoundError, Sport, SportId, SportsService } from "../../types";
import { MOCK_SPORTS } from "../../mocks/sports-data";
import { deepClone, simulateLatency } from "./mock-utils";

export class MockSportsService implements SportsService {
  private sports: Sport[] = deepClone(MOCK_SPORTS);

  async getSports(): Promise<Sport[]> {
    await simulateLatency();
    return deepClone(this.sports);
  }

  async getSportById(id: SportId): Promise<Sport> {
    await simulateLatency();
    const sport = this.sports.find((s) => s.id === id);
    if (!sport) {
      throw new NotFoundError("Sport", id);
    }
    return deepClone(sport);
  }
}

