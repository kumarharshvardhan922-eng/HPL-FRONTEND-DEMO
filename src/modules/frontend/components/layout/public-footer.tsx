import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-hpl-surface text-hpl-muted border-t border-hpl-border mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-hpl-accent/60 bg-white">
              <Image
                src="/hpl-logo.png"
                alt="Hostel Premier League logo"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-bold text-white text-base font-display tracking-wider">
              HPL PLATFORM
            </span>
          </div>
          <p className="text-hpl-muted leading-relaxed">
            The official tournament and real-time live scoring portal for the Hostel Premier League championship.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-hpl-accent uppercase tracking-wider text-[11px] mb-3">Sports</h4>
          <ul className="space-y-2">
            <li><Link href="/sports/cricket" className="hover:text-white transition-colors">Cricket (T20/10-Over)</Link></li>
            <li><Link href="/sports/football" className="hover:text-white transition-colors">Football (Full Pitch)</Link></li>
            <li><Link href="/sports/kabaddi" className="hover:text-white transition-colors">Pro Kabaddi</Link></li>
            <li><Link href="/sports/badminton" className="hover:text-white transition-colors">Badminton</Link></li>
            <li><Link href="/sports/volleyball" className="hover:text-white transition-colors">Volleyball</Link></li>
            <li><Link href="/sports/basketball" className="hover:text-white transition-colors">Basketball</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-hpl-accent uppercase tracking-wider text-[11px] mb-3">Houses</h4>
          <ul className="space-y-2">
            <li><Link href="/teams/team-arkavati" className="hover:text-white transition-colors">Arkavati Lions (AL)</Link></li>
            <li><Link href="/teams/team-harangi" className="hover:text-white transition-colors">Harangi Jaguars (HJ)</Link></li>
            <li><Link href="/teams/team-kabini" className="hover:text-white transition-colors">Kabini Lynx (KL)</Link></li>
            <li><Link href="/teams/team-ken" className="hover:text-white transition-colors">Ken Cheetahs (KC)</Link></li>
            <li><Link href="/teams" className="hover:text-white font-medium text-hpl-gold">View All 7 Houses →</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-hpl-accent uppercase tracking-wider text-[11px] mb-3">Administration</h4>
          <p className="text-hpl-muted mb-3">
            Authorized sports convener & sport-specific scoring operators only.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-hpl-surface-2 hover:bg-hpl-border text-hpl-accent hover:text-white font-semibold border border-hpl-border"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-hpl-border py-6 text-center text-hpl-muted/70">
        <p>© 2026 Hostel Premier League (HPL). All rights reserved.</p>
      </div>
    </footer>
  );
};
