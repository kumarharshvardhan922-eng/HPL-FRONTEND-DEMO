import React from "react";
import { ScoreEvent, Team } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import { EmptyState } from "../ui/empty-state";

export interface EventsTimelineProps {
  events: ScoreEvent[];
  teams?: Record<string, Team>;
  isLive?: boolean;
}

export const EventsTimeline: React.FC<EventsTimelineProps> = ({ events, teams = {}, isLive }) => {
  if (events.length === 0) {
    return (
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4 text-hpl-accent" />
            <span>Match Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No events recorded yet"
            description="Play has commenced or is scheduled. Scoring events will appear here chronologically."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-hpl-accent" />
            <span>Key Match Events</span>
          </div>
          <span className="text-xs font-normal text-hpl-muted">{events.length} events logged</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-hpl-border">
          {events.map((ev) => {
            const team = teams[ev.teamId];
            return (
              <div key={ev.id} className="relative flex items-start gap-3">
                {/* Node icon dot */}
                <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-hpl-accent border-2 border-hpl-surface shadow-xs flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>

                <div className="flex-1 bg-hpl-surface-2 p-3 rounded-2xl border border-hpl-border">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-hpl-accent/15 text-hpl-accent border border-hpl-accent/30">
                        {ev.displayTime}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {ev.eventType.replace("_", " ")}
                      </span>
                    </div>
                    {team && (
                      <span className="text-xs font-semibold text-hpl-accent-soft">
                        {team.shortName || team.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-hpl-muted mt-1">{ev.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
