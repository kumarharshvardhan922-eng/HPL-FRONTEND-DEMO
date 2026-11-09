import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-hpl-surface-2 text-hpl-accent flex items-center justify-center mb-6 shadow-glow border border-hpl-border">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <span className="font-mono text-sm font-bold text-hpl-accent uppercase tracking-widest font-display">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-5xl font-black text-white mt-2 mb-3 font-display">
        Lost from the Arena?
      </h1>
      <p className="text-sm text-hpl-muted max-w-md mb-8">
        The requested sports fixture, house squad, or scoreboard does not exist or has been relocated in the tournament roster.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg" className="shadow-glow">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tournament Hub
        </Button>
      </Link>
    </div>
  );
};
