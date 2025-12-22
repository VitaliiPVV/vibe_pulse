import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Brain, Calendar, TrendingUp } from "lucide-react";
import { JournalEntry } from "../../types";

interface StatsProps {
  filteredEntries: JournalEntry[];
  avgStressLevel: string;
  moodData: {
    mood: string;
    count: number;
    fill: string;
  }[];
}

const Stats = ({ filteredEntries, avgStressLevel, moodData }: StatsProps) => {
  return (
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
  );
};

export default Stats;
