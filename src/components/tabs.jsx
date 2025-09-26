import React from "react";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 bg-indigo-800 rounded-md p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
              active === t.key ? "bg-white text-indigo-800" : "text-white/80 hover:bg-indigo-700/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
