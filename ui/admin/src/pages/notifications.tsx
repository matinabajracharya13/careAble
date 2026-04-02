import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

const INITIAL: Notification[] = [
  { id: "1", title: "New user registered", message: "Jordan Lee joined the Marketing team.", type: "success", read: false, createdAt: new Date(Date.now() - 5 * 60_000).toISOString() },
  { id: "2", title: "Security alert", message: "Unusual login attempt detected from 192.168.1.1.", type: "warning", read: false, createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: "3", title: "Report ready", message: "Your Q2 analytics report has been generated.", type: "info", read: false, createdAt: new Date(Date.now() - 2 * 3600_000).toISOString() },
  { id: "4", title: "Server error", message: "API endpoint /v1/orders returned 500 errors.", type: "error", read: true, createdAt: new Date(Date.now() - 24 * 3600_000).toISOString() },
  { id: "5", title: "Backup completed", message: "Daily database backup completed successfully.", type: "success", read: true, createdAt: new Date(Date.now() - 48 * 3600_000).toISOString() },
];

const TYPE_STYLES: Record<Notification["type"], string> = {
  info: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const remove = (id: string) =>
    setNotifications((ns) => ns.filter((n) => n.id !== id));

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Bell className="h-12 w-12 opacity-20" />
          <p className="font-medium">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn("transition-all duration-200", !n.read && "border-primary/30 bg-primary/[0.02]")}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn("mt-0.5 flex-shrink-0 w-2 h-2 rounded-full mt-2", !n.read ? "bg-primary" : "bg-transparent")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{n.title}</p>
                        <Badge className={cn("text-xs border", TYPE_STYLES[n.type])} variant="outline">
                          {n.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => markRead(n.id)}
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => remove(n.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1.5">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
