import React from "react";
import { cn } from "@/lib/utils"; // optional

type BudgetCardProps = {
  title: string;
  value?: string | number | React.ReactNode;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export function BudgetCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  children,
  onClick,
}: BudgetCardProps) {
  return (
    <div className="bg-card p-4 rounded-lg hover:bg-card/80 transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {/* Clickable value area */}
          <div onClick={onClick} className="mt-1">
            {children || value}
          </div>
        </div>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
      <p
        className={cn(
          "text-sm mt-1",
          changeType === "positive"
            ? "text-green-500"
            : changeType === "negative"
            ? "text-red-500"
            : "text-gray-500"
        )}
      >
        {change}
      </p>
    </div>
  );
}



