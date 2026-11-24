"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BarChart2, User } from "lucide-react";

export interface BottomTabBarProps {
  className?: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Fixtures", href: "/fixtures", icon: Calendar },
    { label: "Stats", href: "/standings", icon: BarChart2 },
    { label: "Admin", href: "/admin", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[rgba(11,26,40,0.92)] backdrop-blur-xl border-t border-hpl-border px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl ${className}`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all duration-150 select-none group focus:outline-none ${
                isActive ? "text-hpl-accent font-bold" : "text-hpl-muted hover:text-white"
              }`}
            >
              <div className="relative">
                <IconComponent className="w-5 h-5 transition-transform duration-150 group-hover:scale-110" />
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-hpl-accent shadow-glow mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
