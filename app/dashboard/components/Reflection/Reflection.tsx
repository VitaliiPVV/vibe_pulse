"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ReflectionData } from "./types";

interface ReflectionProps {
  entries: ReflectionData[];
}

type PanelState = "collapsed" | "hover" | "expanded";

type AIResponse = {
  affirmation: string;
  reflection_question: string;
}

const Reflection = ({ entries }: ReflectionProps) => {
  const [panelState, setPanelState] = useState<PanelState>("collapsed");
  const [loading, setLoading] = useState(false);
  const [reflectionData, setReflectionData] = useState<AIResponse | null>(null);

  const getTodayEntries = () => {
    const today = new Date().toISOString().split("T")[0];

    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at)
        .toISOString()
        .split("T")[0];

      return entryDate === today;
    });
  };

  const buildAIPayload = () => {
    const todayEntries = getTodayEntries();

    return {
      date: new Date().toISOString().split("T")[0],
      entries: todayEntries.map((entry) => ({
        mood: entry.mood,
        stress_level: entry.stress_level,
        topic: entry.topic,
        summary: entry.summary,
      })),
    };
  };

  const generateReflection = async () => {
    const todayEntries = getTodayEntries();

    if (todayEntries.length === 0) {
      toast.info("No entries for today yet");
      return;
    }

    setLoading(true);
    setReflectionData(null);

    try {
      const response = await fetch("/api/groq-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildAIPayload()),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reflection");
      }

      const data: AIResponse = await response.json();
      setReflectionData(data);
    } catch (error) {
      console.error("Reflection error:", error);
      toast.error("Failed to generate daily reflection");
    } finally {
      setLoading(false);
      setPanelState("expanded");
    }
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-300 ease-out
        ${panelState === "collapsed" && "w-12 h-12"}
        ${panelState === "hover" && "w-56 h-20"}
        ${panelState === "expanded" && "w-80 min-h-[220px]"}
      `}
      onMouseEnter={() =>
        panelState === "collapsed" && setPanelState("hover")
      }
      onMouseLeave={() =>
        panelState === "hover" && setPanelState("collapsed")
      }
    >
      <div className="w-full h-full bg-black text-white rounded-2xl shadow-lg p-3 flex flex-col">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            setPanelState((s) =>
              s === "expanded" ? "collapsed" : "expanded"
            )
          }
        >
          <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
            ✦
          </div>
          {panelState !== "collapsed" && (
            <span className="text-sm font-medium">
              Daily reflection
            </span>
          )}
        </div>
        {panelState !== "collapsed" && (
          <div className="mt-3 flex-1 text-sm">
            {!reflectionData && (
              <>
                <p className="text-white/80">
                  Take a moment to reflect on your day.
                </p>

                <button
                  onClick={generateReflection}
                  disabled={loading}
                  className="mt-3 w-full rounded-lg bg-white text-black py-2 text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Thinking..." : "Generate reflection"}
                </button>
              </>
            )}
            {reflectionData && (
              <div className="space-y-3">
                <p className="italic">“{reflectionData.affirmation}”</p>

                <p className="text-white/80">
                  {reflectionData.reflection_question}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;
