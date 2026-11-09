import { SportId, Standing, StandingsService } from "../../types";
import { HPL_HOUSES } from "../../config/houses";

export class EmptyStandingsService implements StandingsService {
  async getStandings(sportId: SportId): Promise<Standing[]> {
    // Returns the 7 official championship houses with zeroed baseline points
    return HPL_HOUSES.map((h) => ({
      teamId: h.id,
      teamName: h.name,
      sportId,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
      netRunRate: 0,
      goalDifference: 0,
      scoreDifference: 0,
      form: [],
    }));
  }
}

