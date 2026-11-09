# HPL Frontend Architecture & Real-API Swap Guide

This module (`src/modules/frontend/`) is completely self-contained, theme-aligned with the Image 1 / Image 2 stadium blue visual language, and prepared for seamless production backend integration.

## Design Tokens & Theme Language

The application is styled using centralized design tokens defined in `src/app/globals.css` and extended in `tailwind.config.ts`:

- `--bg-deep`: `#050d17` (stadium night canvas)
- `--bg-surface`: `#0b1a28` (elevated cards)
- `--bg-surface-2`: `#0f2434` (table rows, inputs, interactive panels)
- `--border`: `#17384d` (subtle borders and dividers)
- `--accent`: `#38b6ff` (electric blue links, active states, buttons)
- `--accent-soft`: `#8fd8ff` (light gradient stop)
- `--gold`: `#fbbf24` (leaderboard rankings #1..#7, MVP highlights)
- `--text`: `#ffffff` (primary white text)
- `--text-muted`: `#8fa7ba` (secondary slate text)
- `--live`: `#ef4444` (live match pulse badges)
- `--success`: `#22c55e` (points, wins, form chips)

Typography:
- Display font: `Bebas Neue` via `next/font/google` (`font-display`) for athletic headers and wordmarks.
- Body font: `Inter` via `next/font/google` (`font-sans`).

## Championship Houses (7 Real Competing Houses)

All mock hostels are replaced by the 7 real houses with dedicated brand colors and 14–16 fictional athlete rosters:
1. **Arkavati Lions** (`AL` - Gold/Amber `#f59e0b`)
2. **Harangi Jaguars** (`HJ` - Emerald `#10b981`)
3. **Kabini Lynx** (`KL` - Electric Cyan `#38b6ff`)
4. **Ken Cheetahs** (`KC` - Speed Orange `#f97316`)
5. **Orsang Leopards** (`OL` - Royal Purple `#a855f7`)
6. **Shimsha Panthers** (`SP` - Magenta `#ec4899`)
7. **Tons Tigers** (`TT` - Deep Teal `#06b6d4`)

Standings leaderboard strictly matches Image 2. Fixtures support odd-team scheduling with graceful "Bye" round states.

## How to Swap Mock Services for Real APIs

All components consume data exclusively through the domain service interfaces defined in `src/modules/frontend/types/services.ts`.

### Step 1: Implement the Domain Service Interface
To connect a real REST API or Firebase/Firestore backend, create a new service class implementing the target interface. For example, in `src/modules/frontend/services/api/api-matches-service.ts`:

```typescript
import { MatchesService, Match, SportId, MatchStatus } from "../../types";

export class ApiMatchesService implements MatchesService {
  constructor(private baseUrl: string) {}

  async getMatches(filter?: { sportId?: SportId; status?: MatchStatus }): Promise<Match[]> {
    const res = await fetch(`${this.baseUrl}/matches`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
  }
}
```

### Step 2: Inject Into `ServicesProvider`
In `src/app/layout.tsx` (or inside `ServicesProvider` default configuration):

```tsx
import { ApiMatchesService } from "@/modules/frontend/services/api/api-matches-service";

const customServices = {
  matches: new ApiMatchesService(process.env.NEXT_PUBLIC_API_URL!),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServicesProvider customServices={customServices}>
      <AuthViewProvider>{children}</AuthViewProvider>
    </ServicesProvider>
  );
}
```
Zero component modifications are needed when transitioning from mock data to real backend APIs.
