import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  title: string;
  value: React.ReactNode;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor: string;
  onClick?: () => void; // <-- add this
}

export function BudgetCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  onClick,
}: BudgetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }} // small hover effect only if clickable
      transition={{ duration: 0.3 }}
      className="bg-card/50 backdrop-blur-sm border-border rounded-lg cursor-pointer"
      onClick={onClick} // <-- use the onClick here
    >
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <p
            className={cn(
              "text-sm mt-2",
              changeType === "positive"
                ? "text-green-500"
                : changeType === "negative"
                ? "text-red-500"
                : "text-muted-foreground"
            )}
          >
            {change}
          </p>
        </div>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}




