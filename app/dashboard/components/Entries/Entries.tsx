import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { format } from "date-fns";
import { moodColors, moodIcons } from "../../consts";
import { Meh } from "lucide-react";
import { JournalEntry } from "../../types";

interface EntriesProps {
  filteredEntries: JournalEntry[];
}

const Entries = ({ filteredEntries }: EntriesProps) => {
  return (
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
  );
};

export default Entries;
