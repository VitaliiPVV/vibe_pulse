"use client";

import { endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { JournalEntry } from "../../types";
import { useEffect, useState } from "react";
import { moodColors } from "../../consts";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { Entries } from "../Entries";
import { Filters } from "../Filters";
import { Stats } from "../Stats";
import { Charts } from "../Charts";

interface ContentProps {
  hasSubscription: boolean;
}

const Content = ({ hasSubscription }: ContentProps) => {
  const [dateFilter, setDateFilter] = useState("week");
  const [moodFilter, setMoodFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal/entries?limit=50");
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const now = new Date();

    let dateMatch = true;
    if (dateFilter === "week") {
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      dateMatch = entryDate >= weekStart && entryDate <= weekEnd;
    } else if (dateFilter === "month") {
      dateMatch = entryDate >= subDays(now, 30);
    } else if (dateFilter === "today") {
      dateMatch = format(entryDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    }

    const moodMatch = moodFilter === "all" || entry.mood?.toLowerCase().includes(moodFilter);
    const topicMatch = topicFilter === "all" || entry.topic?.toLowerCase().includes(topicFilter);

    return dateMatch && moodMatch && topicMatch;
  });

  const avgStressLevel = filteredEntries.length > 0
    ? (filteredEntries.reduce((sum, e) => sum + (e.stress_level || 0), 0) / filteredEntries.length).toFixed(1)
    : "0";

  const moodCounts: Record<string, number> = {};
  filteredEntries.forEach((entry) => {
    const mood = entry.mood?.toLowerCase() || "unknown";
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    count,
    fill: moodColors[mood] || "#6b7280",
  }));

  const stressData = filteredEntries
    .slice(0, 7)
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.created_at), "MMM dd"),
      stress: entry.stress_level || 0,
    }));

  const uniqueTopics = Array.from(new Set(entries.map((e) => e.topic).filter(Boolean)));
  const uniqueMoods = Array.from(new Set(entries.map((e) => e.mood?.toLowerCase()).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 space-y-6 py-16">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your emotional wellness journey
        </p>
      </div>

      {hasSubscription ? (
        <>
          <Filters
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            moodFilter={moodFilter}
            setMoodFilter={setMoodFilter}
            uniqueMoods={uniqueMoods}
            topicFilter={topicFilter}
            setTopicFilter={setTopicFilter}
            uniqueTopics={uniqueTopics}
          />
          <Stats
            filteredEntries={filteredEntries}
            avgStressLevel={avgStressLevel}
            moodData={moodData}
          />
          <Charts moodData={moodData} stressData={stressData} />
          <Entries filteredEntries={filteredEntries} />
        </>
      ) : (
        <>
          <Card className="px-6">
            <p>Advanced features are only available with a PRO subscription</p>
            <Link href="/pricing">
              <Button>Subscribe to PRO plan</Button>
            </Link>
          </Card>

          <Entries filteredEntries={filteredEntries} />
        </>
      )}
    </div>
  )
};

export default Content;
