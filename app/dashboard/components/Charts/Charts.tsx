import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ChartsProps {
  moodData: {
    mood: string;
    count: number;
    fill: string;
  }[];
  stressData: {
    date: string;
    stress: number;
  }[];
}

const Charts = ({ moodData, stressData }: ChartsProps) => {
  return (
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
                  <ChartTooltip />
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
                  <ChartTooltip />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="#5374a8"
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
  );
};

export default Charts;
