import { Sport } from "../types";

export const HPL_SPORTS: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    icon: "Trophy",
    description: "T20 & 10-over limited overs format with run rates and ball-by-ball tracking.",
    rulesSummary: "6 balls per over. Extras tracked: Wides, No-Balls, Byes, Leg Byes. Target & NRR calculated.",
    activeMatchesCount: 0,
  },
  {
    id: "football",
    name: "Football",
    icon: "Activity",
    description: "Full pitch hostel format with halves, goals, cards, and tactical pitch view.",
    rulesSummary: "Two 30 or 45 min halves. Yellow & red cards, goals, substitutions, and possession tracked.",
    activeMatchesCount: 0,
  },
  {
    id: "kabaddi",
    name: "Kabaddi",
    icon: "Zap",
    description: "High-octane raid & tackle matches with bonus, super raid, and do-or-die situations.",
    rulesSummary: "Two 20-minute halves. Raid & tackle points, all-out points (+2), do-or-die on 3rd empty raid.",
    activeMatchesCount: 0,
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "Target",
    description: "Singles and Doubles matches played best-of-3 games.",
    rulesSummary: "Best of 3 games to 21 points (must win by 2, capped at 30). Service shifts on point win.",
    activeMatchesCount: 0,
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "Flame",
    description: "Fast-paced rallies with sets to 25 points and 5th set tiebreaker to 15.",
    rulesSummary: "Best of 5 sets. Sets 1-4 to 25 pts (win by 2). 5th set to 15 pts. Rotations & timeouts tracked.",
    activeMatchesCount: 0,
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "Dribbble",
    description: "4 quarters of high-intensity play with 1, 2, and 3-point scoring and team foul bonus.",
    rulesSummary: "Four 10-minute quarters. 1-pt free throws, 2-pt field goals, 3-pointers. Team fouls & bonus at 5.",
    activeMatchesCount: 0,
  },
];

