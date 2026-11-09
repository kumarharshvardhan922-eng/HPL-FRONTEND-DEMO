import { NotFoundError, Sport, SportId, SportsService } from "../../types";
import { HPL_SPORTS } from "../../config/sports";

export class DemoSportsService implements SportsService {
  async getSports(): Promise<Sport[]> {
    return HPL_SPORTS.map((s) => ({
      ...s,
      activeMatchesCount: s.id === "cricket" ? 1 : 0,
      isDemo: true,
    }));
  }

  async getSportById(id: SportId): Promise<Sport> {
    const s = HPL_SPORTS.find((sp) => sp.id === id);
    if (!s) throw new NotFoundError("Sport", id);
    return { ...s, isDemo: true };
  }
}
