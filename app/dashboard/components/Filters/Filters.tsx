"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface FiltersProps {
  dateFilter: string;
  setDateFilter: Dispatch<SetStateAction<string>>;
  moodFilter: string;
  setMoodFilter: Dispatch<SetStateAction<string>>;
  uniqueMoods: string[];
  topicFilter: string;
  setTopicFilter: Dispatch<SetStateAction<string>>;
  uniqueTopics: string[];
}

const Filters = ({
  dateFilter,
  setDateFilter,
  moodFilter,
  setMoodFilter,
  uniqueMoods,
  topicFilter,
  setTopicFilter,
  uniqueTopics,
}: FiltersProps) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="all" className="cursor-pointer">All Time</SelectItem>
              <SelectItem value="today" className="cursor-pointer">Today</SelectItem>
              <SelectItem value="week" className="cursor-pointer">This Week</SelectItem>
              <SelectItem value="month" className="cursor-pointer">Last 30 Days</SelectItem>
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
                <SelectItem key={mood} value={mood} className="cursor-pointer">
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Topic</label>
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {uniqueTopics.map((topic) => (
                <SelectItem key={topic} value={topic.toLowerCase()} className="cursor-pointer">
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;
