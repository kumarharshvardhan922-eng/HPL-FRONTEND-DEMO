import { SportId, Standing, StandingsService } from "../../types";
import { SHOWCASE_STANDINGS } from "../../showcase/showcase";
import { HPL_HOUSES } from "../../config/houses";

export class DemoStandingsService implements StandingsService {
  async getStandings(sportId: SportId): Promise<Standing[]> {
    if (sportId === "cricket") {
      return [...SHOWCASE_STANDINGS];
    }
    // Other sports show the 7 houses with 0 points
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
      isDemo: true,
    }));
  }
}

