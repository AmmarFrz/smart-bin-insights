import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, WifiOff, Bell, Check, CheckCheck, Loader2 } from "lucide-react";

export default function AlertsPage() {
  const { alerts, loading, markRead, markAllRead, unreadCount } = useAlerts();
  const { isOperator } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alert Notifications</h1>
          <p className="text-sm text-muted-foreground">System alerts and bin capacity warnings</p>
        </div>
        {isOperator && unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all read ({unreadCount})
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bell className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">No alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const Icon = alert.type === "critical" ? AlertCircle : alert.type === "warning" ? AlertTriangle : WifiOff;
            return (
              <div key={alert.id} className={`glass-card rounded-xl p-4 flex items-start gap-4 ${!alert.read ? "border-l-4" : ""} ${
                alert.type === "critical" ? "border-l-red-500" :
                alert.type === "warning" ? "border-l-amber-500" :
                "border-l-muted-foreground"
              }`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                  alert.type === "critical" ? "bg-red-100" :
                  alert.type === "warning" ? "bg-amber-100" : "bg-muted"
                }`}>
                  <Icon className={`h-4 w-4 ${
                    alert.type === "critical" ? "text-red-600" :
                    alert.type === "warning" ? "text-amber-600" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px]">{alert.type.toUpperCase()}</Badge>
                    {!alert.read && <Badge className="bg-primary text-primary-foreground text-[10px]">NEW</Badge>}
                  </div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
                {isOperator && !alert.read && (
                  <Button size="sm" variant="ghost" onClick={() => markRead(alert.id)} className="gap-1">
                    <Check className="h-3 w-3" /> Mark read
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
