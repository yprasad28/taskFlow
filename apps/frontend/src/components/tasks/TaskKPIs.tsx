"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useTaskKPIs } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckCircle, Clock, ListTodo, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export function TaskKPIs() {
  const { data: kpis, isLoading } = useTaskKPIs();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Tasks",
      value: kpis?.total || 0,
      icon: ListTodo,
      change: "+12%",
      changeType: "up" as const,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed",
      value: kpis?.completed || 0,
      icon: CheckCircle,
      change: "+8%",
      changeType: "up" as const,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending",
      value: kpis?.pending || 0,
      icon: Clock,
      change: "+8%",
      changeType: "up" as const,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "In Progress",
      value: kpis?.inProgress || 0,
      icon: AlertTriangle,
      change: "-2%",
      changeType: "down" as const,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                {card.title}
              </span>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {card.changeType === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={
                  card.changeType === "up" ? "text-success" : "text-destructive"
                }
              >
                {card.change}
              </span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
