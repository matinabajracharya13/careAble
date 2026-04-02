import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityFeed } from "@/hooks/use-dashboard";

// Tiny date helper without importing date-fns if not installed
function timeAgo(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

export function ActivityFeed() {
  const { data: items, isLoading } = useActivityFeed();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="px-6 pb-4 space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              : items?.map((item) => {
                  const initials = item.user.name
                    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <div key={item.id} className="flex items-start gap-3 animate-fade-in">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug">
                          <span className="font-semibold">{item.user.name}</span>
                          {" "}<span className="text-muted-foreground">{item.action}</span>{" "}
                          <span className="font-medium">{item.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(item.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
