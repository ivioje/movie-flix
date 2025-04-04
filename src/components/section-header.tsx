
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  viewAllLink,
  viewAllLabel = "View all",
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", className)}>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex items-center">
        {children}
        {viewAllLink && (
          <Link to={viewAllLink}>
            <Button variant="ghost" size="sm">
              {viewAllLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
