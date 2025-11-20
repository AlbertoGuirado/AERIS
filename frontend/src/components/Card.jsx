// src/components/ui/card.tsx
import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`rounded-xl bg-white/10 p-4 shadow-lg backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );
}
