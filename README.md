# HPL Frontend Module

Frontend for the **Hostel Premier League (HPL)**, a real-time multi-sport tournament platform for the seven hostel houses.

- **Module path:** `src/modules/frontend/`
- **Stack:** Next.js (App Router), TypeScript (strict), Tailwind CSS
- **Scope:** UI only. No backend, Firebase, authentication or database code lives here.

---

## 1. What's included

### Public website (read-only)
- Home: hero, live-now strip, upcoming and recent results, top performers, mini standings
- Sport pages: Live / Upcoming / Completed tabs, filters, search, standings
- Match page: sport-specific live scoreboard, timeline, stats
- Houses (teams), players, fixtures and standings pages
- Loading skeletons, empty states, error states with Retry, and a not-found page

### Admin dashboard
- Overview, Sports, Houses, Players, Fixtures/Matches, Admins, Settings
- Create/edit forms with validation, confirmation dialogs, toasts
- Manual score override with a required reason
- Role-aware menus and route guards

### Sport scoreboards (public view + admin scoring console)
| Sport | Highlights |
|---|---|
| Cricket | Runs/wickets/overs, extras, strike rate, run rate, target and required rate, ball-by-ball chips |
| Football | Goals, assists, cards, substitutions, match timer, lineup pitch view |
| Kabaddi | Raid, tackle and bonus points, all-out, super raid/tackle, player points |
| Badminton | Best of 3 games to 21 (win by 2, cap 30), service indicator |
| Volleyball | Best of 5 sets (25 points, 15 in the 5th), rotation, timeouts |
| Basketball | Quarters, game clock, fouls, timeouts, 1/2/3-point scoring |

---

## 2. Houses and sports (configuration)

Real configuration, not mock data:

| Code | House |
|---|---|
| AL | Arkavati Lions |
| HJ | Harangi Jaguars |
| KL | Kabini Lynx |
| KC | Ken Cheetahs |
| OL | Orsang Leopards |
| SP | Shimsha Panthers |
| TT | Tons Tigers |

- Houses live in `config/houses.ts`; sports in `config/sports.ts`.
- Do not duplicate these lists elsewhere. Map over the config so new entries appear automatically.
- With 7 houses, one house has a **Bye** in each round.

---

## 3. Folder structure

```
src/modules/frontend/
  assets/        logo and background image
  config/        houses.ts, sports.ts
  types/         domain types (Sport, House, Player, Match, Standing, ScoreEvent, Role, ...)
  services/      service interfaces (the only data entry point)
    empty/       default implementations, return empty lists
    demo/        showcase implementation (flag-controlled)
  showcase/      the single demo record
  providers/     ServicesProvider, AuthViewProvider (stub)
  hooks/         useMatches, useLiveMatch, useStandings, ...
  components/    ui/, layout/, scoreboards/, forms/
  pages/         page-level compositions exported to src/app
  utils/         scoring maths, validators, permissions
  __tests__/     tests and test-only fixtures
```

---

## 4. Running it

```bash
npm install
npm run dev        # development
npm run lint
npm run typecheck  # or: npx tsc --noEmit
npm test
npm run build
```

### Environment flags

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_FRONTEND_DEMO=1` | Uses the demo service: one completed cricket showcase match, tagged "Demo data" |
| `NEXT_PUBLIC_ROLE_SWITCHER=1` | Shows the dev role switcher outside development builds |

Without the demo flag the app uses the empty services and shows professional empty states.

---

## 5. Roles and the dev role switcher

The switcher is **development only** and uses a stub. It never touches real authentication.

| Option | Access |
|---|---|
| Super Admin | Everything |
| Sport Admin (Cricket / Football / Kabaddi / Badminton / Volleyball / Basketball only) | Only the assigned sport's matches, scoring, fixtures and data |
| Public User | Public site only; `/admin` shows "No access" |

Rules:
- All checks go through `utils/permissions.ts`: `canAccessSport`, `canScoreMatch`, `visibleSports`.
- Guards run in the page components, not only in the menus. Typing another sport's URL shows "No access".
- A sport admin's match form has the sport field locked to their assigned sport.
- The switcher does not render in production unless `NEXT_PUBLIC_ROLE_SWITCHER=1`.

---

## 6. Connecting the real backend

All data goes through the interfaces in `services/`:

`SportsService`, `HousesService`, `PlayersService`, `MatchesService`, `ScoringService`, `StandingsService`, `AuthViewService`

1. Implement each interface against the real API in a new folder, e.g. `services/api/`.
2. Every method is `async`, returns `Promise<T>` and throws typed errors.
3. Register the implementation in `providers/ServicesProvider.tsx`, the **only** place where services are chosen.
4. No component changes are needed.

The exact method signatures are in `services/*.ts`. These are the **shared interfaces** the backend, sports and tournament teams must match.

Real authentication replaces `AuthViewProvider`. Keep the same `{ role, assignedSports }` shape it exposes.

---

## 7. Theme and background

- Dark stadium-blue theme. All colours come from design tokens (CSS variables plus the Tailwind theme). Do not hard-code hex values in components.
- `SiteBackground` renders the stadium image once in the shared layouts, with `HERO_OVERLAY`, `INNER_OVERLAY` and `ADMIN_OVERLAY` constants at the top of the file for tuning.
- The logo is `assets/hpl-logo.png`, used in the header, hero, admin sidebar and footer.

---

## 8. Removing the demo showcase later

1. Delete `showcase/` and `services/demo/`.
2. Remove the demo branch in `providers/ServicesProvider.tsx`.
3. Remove `NEXT_PUBLIC_FRONTEND_DEMO` from your env files.
4. Remove the demo tests in `__tests__/`.

---

## 9. Testing

- **Unit tests:** scoring utils, validators and permission helpers.
- **Component tests:** scoreboards, forms, role-based visibility, empty/error/loading states, the scoreboard header alignment, and the logo.
- Test data lives only in `__tests__/fixtures/` and is never imported by app code.

---

## 10. Boundaries

This module does **not**:
- modify Firebase configuration, authentication, backend APIs or database schemas
- modify the sports or tournament modules
- contain mock data in components (data comes only through services)

Thin re-export files under `src/app/` that point into this module are the only files allowed outside it.

---

## 11. Conventions

- TypeScript strict, no `any`
- Keep files under about 250 lines, no dead code
- Responsive from 360px to large desktop; WCAG AA contrast; keyboard accessible
- Every data view has loading, empty and error states
