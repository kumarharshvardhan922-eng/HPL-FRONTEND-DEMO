import React from "react";
import { Team } from "../../../types";
import { getInitials } from "../../../utils/formatters";

export interface PitchPlayer {
  id: string;
  name: string;
  jerseyNumber: number;
  rating: number;
  position: string;
}

export interface FootballPitchLineupProps {
  team: Team;
  formation: string; // e.g. "4-4-2"
  players: PitchPlayer[];
}

export const FootballPitchLineup: React.FC<FootballPitchLineupProps> = ({
  team,
  formation,
  players,
}) => {
  // Safe fallback if fewer players
  const gk = players[0] || { id: "p-gk", name: "Goalkeeper", jerseyNumber: 1, rating: 7.0 };
  const defenders = players.slice(1, 5);
  const midfielders = players.slice(5, 9);
  const forwards = players.slice(9, 11);

  return (
    <div className="w-full bg-[#204e33] rounded-3xl p-4 sm:p-6 border-4 border-[#2b6443] shadow-inner relative overflow-hidden text-white">
      {/* Pitch markings */}
      <div className="absolute inset-x-8 top-0 h-24 border-b-2 border-x-2 border-white/30 rounded-b-xl pointer-events-none" />
      <div className="absolute inset-x-16 top-0 h-10 border-b-2 border-x-2 border-white/30 rounded-b-lg pointer-events-none" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-white/30 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/30 rounded-full pointer-events-none" />

      {/* Team & Formation Tag matching Image 3 */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: team.primaryColor || "#ffffff" }}
          />
          <span className="text-xs sm:text-sm font-bold">{team.name}</span>
        </div>
        <div className="bg-[#1b432a] text-emerald-300 font-mono text-xs font-bold px-3 py-1 rounded-xl border border-emerald-500/40">
          {formation}
        </div>
      </div>

      {/* Pitch Players Layout (GK -> DEF -> MID -> ATT) */}
      <div className="relative z-10 flex flex-col justify-between gap-6 py-2 min-h-[460px]">
        {/* Goalkeeper */}
        <div className="flex justify-center">
          <PitchPlayerBadge player={gk} />
        </div>

        {/* Defenders */}
        <div className="flex justify-around items-center px-2">
          {defenders.map((p) => (
            <PitchPlayerBadge key={p.id} player={p} />
          ))}
        </div>

        {/* Midfielders */}
        <div className="flex justify-around items-center px-2">
          {midfielders.map((p) => (
            <PitchPlayerBadge key={p.id} player={p} />
          ))}
        </div>

        {/* Forwards */}
        <div className="flex justify-around items-center px-12">
          {forwards.map((p) => (
            <PitchPlayerBadge key={p.id} player={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PitchPlayerBadge: React.FC<{ player: PitchPlayer }> = ({ player }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
      <div className="relative flex items-center justify-center">
        {/* Player avatar */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-slate-900 border-2 border-white shadow-md flex items-center justify-center font-bold text-xs sm:text-sm">
          {getInitials(player.name)}
        </div>
        {/* Rating pill style directly from Image 3 */}
        <span className="absolute -bottom-1.5 bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full border border-amber-600 shadow-xs">
          {player.rating.toFixed(1)}
        </span>
      </div>
      <div className="text-center mt-2">
        <span className="text-[10px] sm:text-xs font-semibold text-white drop-shadow-sm block leading-tight">
          {player.jerseyNumber} {player.name.split(" ")[1] || player.name}
        </span>
      </div>
    </div>
  );
};

