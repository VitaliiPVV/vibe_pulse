"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { Smile, Frown, Meh, TrendingUp, Brain, Calendar } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface JournalEntry {
  id: string;
  clerk_user_id: string;
  entry_text: string;
  mood: string;
  stress_level: number;
  topic: string;
  summary: string;
  advice: string;
  created_at: string;
}

const moodIcons: Record<string, any> = {
  happy: Smile,
  positive: Smile,
  grateful: Smile,
  sad: Frown,
  stressed: Frown,
  anxious: Frown,
  neutral: Meh,
  mixed: Meh,
};

const moodColors: Record<string, string> = {
  happy: "#22c55e",
  positive: "#22c55e",
  grateful: "#22c55e",
  sad: "#ef4444",
  stressed: "#f59e0b",
  anxious: "#f59e0b",
  neutral: "#6b7280",
  mixed: "#8b5cf6",
};

export const Content = ({ hasSubscription }: { hasSubscription: boolean }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("week");
  const [moodFilter, setMoodFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

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

  // Filter entries based on selected filters
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const now = new Date();
    
    // Date filter
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

    // Mood filter
    const moodMatch = moodFilter === "all" || entry.mood?.toLowerCase().includes(moodFilter);

    // Topic filter
    const topicMatch = topicFilter === "all" || entry.topic?.toLowerCase().includes(topicFilter);

    return dateMatch && moodMatch && topicMatch;
  });

  // Calculate statistics
  const avgStressLevel = filteredEntries.length > 0
    ? (filteredEntries.reduce((sum, e) => sum + (e.stress_level || 0), 0) / filteredEntries.length).toFixed(1)
    : "0";

  // Mood distribution
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

  // Stress trend (last 7 days)
  const stressData = filteredEntries
    .slice(0, 7)
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.created_at), "MMM dd"),
      stress: entry.stress_level || 0,
    }));

  // Get unique topics and moods for filters
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
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your emotional wellness journey
          {hasSubscription && (
            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Pro
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Mood</label>
            <Select value={moodFilter} onValueChange={setMoodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                {uniqueMoods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Topic</label>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {uniqueTopics.map((topic) => (
                  <SelectItem key={topic} value={topic.toLowerCase()}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEntries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Journal entries tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stress Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStressLevel}/10</div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(parseFloat(avgStressLevel) / 10) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Mood</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moodData.length > 0
                ? moodData.sort((a, b) => b.count - a.count)[0].mood
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on filtered entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Your emotional patterns</CardDescription>
          </CardHeader>
          <CardContent>
            {moodData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mood" />
                    <YAxis />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No data available for selected filters
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stress Trend</CardTitle>
            <CardDescription>Last 7 entries</CardDescription>
          </CardHeader>
          <CardContent>
            {stressData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No stress data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your latest journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries.slice(0, 5).map((entry) => {
                const MoodIcon = moodIcons[entry.mood?.toLowerCase()] || Meh;
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                  >
                    <div
                      className="p-2 rounded-full"
                      style={{
                        backgroundColor: `${moodColors[entry.mood?.toLowerCase()] || "#6b7280"}20`,
                      }}
                    >
                      <MoodIcon
                        className="h-5 w-5"
                        style={{ color: moodColors[entry.mood?.toLowerCase()] || "#6b7280" }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{entry.mood}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.created_at), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.topic}</p>
                      <p className="text-sm">{entry.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Stress: {entry.stress_level}/10
                        </span>
                        <div className="flex-1 h-1 bg-secondary rounded-full max-w-[100px]">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(entry.stress_level / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      {entry.advice && (
                        <p className="text-xs text-muted-foreground italic mt-2">
                          💡 {entry.advice}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No entries found. Start journaling to see your insights!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

