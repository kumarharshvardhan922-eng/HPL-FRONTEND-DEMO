import { SportId, Standing, StandingsService } from "../../types";
import { getShowcaseStandings } from "../../showcase/showcase";

export class DemoStandingsService implements StandingsService {
  async getStandings(sportId: SportId): Promise<Standing[]> {
    return getShowcaseStandings(sportId);
  }
}

