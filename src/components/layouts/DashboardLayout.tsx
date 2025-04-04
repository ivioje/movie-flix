
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      <Sidebar className="w-full md:w-64 md:h-[calc(100vh-4rem)] border-r" />
      <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
        <div className="container py-6 md:py-8">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardLayout;
