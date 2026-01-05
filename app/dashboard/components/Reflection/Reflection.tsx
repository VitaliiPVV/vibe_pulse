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
};

const Reflection = ({ entries }: ReflectionProps) => {
  const [panelState, setPanelState] = useState<PanelState>("collapsed");
  const [animateTitle, setAnimateTitle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reflectionData, setReflectionData] = useState<AIResponse | null>(null);

  const getTodayEntries = () => {
    const todayString = new Date().toLocaleDateString("en-CA");

    return entries.filter((entry) => {
      const entryDateString = new Date(entry.created_at).toLocaleDateString(
        "en-CA"
      );
      return entryDateString === todayString;
    });
  };

  const buildAIPayload = () => {
    const todayEntries = getTodayEntries();

    return {
      date: new Date().toLocaleDateString(),
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
      toast.error("Failed to generate daily reflection");
      console.error(error)
    } finally {
      setLoading(false);
      setPanelState("expanded");
    }
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-150 ease-out
        ${panelState === "collapsed" && "w-12 h-12"}
        ${panelState === "hover" && "w-64 h-[60px]"}
        ${panelState === "expanded" && "w-80 min-h-[220px]"}
      `}
      onMouseEnter={() => {
        if (panelState === "collapsed") {
          setAnimateTitle(true);
          setPanelState("hover");
        }
      }}
      onMouseLeave={() => {
        if (panelState === "hover") {
          setAnimateTitle(false);
          setPanelState("collapsed");
        }
      }}
    >
      <div className="w-full h-full bg-black text-white rounded-2xl shadow-lg p-3 flex flex-col">
        <div className="flex items-center gap-2 w-full">
          <div className="w-6 min-w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
            ✦
          </div>

          {panelState !== "collapsed" && (
            <div className="flex items-start justify-between w-full">
              <span className="text-sm font-medium flex">
                {"Daily reflection".split("").map((char, index) => {
                  const shouldAnimate = animateTitle && panelState === "hover";

                  return (
                    <span
                      key={index}
                      className={`
                        inline-block transition-all duration-300
                        ${
                          shouldAnimate
                            ? "opacity-0 translate-y-2 animate-title"
                            : "opacity-100 translate-y-0"
                        }
                      `}
                      style={{
                        animationDelay: shouldAnimate
                          ? `${index * 20}ms`
                          : "0ms",
                        width: char === " " ? "4px" : "auto",
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>

              <button
                onClick={() =>
                  setPanelState((s) =>
                    s === "expanded" ? "collapsed" : "expanded"
                  )
                }
                className="w-20 cursor-pointer rounded-lg bg-white text-black py-2 text-sm font-medium"
              >
                {panelState === "expanded" ? "Close" : "Open"}
              </button>
            </div>
          )}
        </div>

        {panelState === "expanded" && (
          <div className="mt-3 flex-1 text-sm">
            {!reflectionData && (
              <>
                <p className="text-white/80">
                  Take a moment to reflect on your day.
                </p>

                <button
                  onClick={generateReflection}
                  disabled={loading}
                  className="mt-3 w-full cursor-pointer rounded-lg bg-white text-black py-2 text-sm font-medium disabled:opacity-50"
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

                <button
                  onClick={generateReflection}
                  disabled={loading}
                  className="mt-3 w-full rounded-lg bg-white text-black py-2 text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Thinking..." : "Re-generate reflection"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* animation */}
      <style jsx>{`
        @keyframes title-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-title {
          animation: title-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Reflection;
