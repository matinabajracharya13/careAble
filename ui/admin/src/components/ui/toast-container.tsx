import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const ICONS = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  destructive: <AlertCircle className="h-4 w-4" />,
};

const STYLES = {
  default: "bg-card border-border text-foreground",
  success: "bg-success/10 border-success/30 text-success",
  destructive: "bg-destructive/10 border-destructive/30 text-destructive",
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 pointer-events-auto",
            "min-w-[300px] max-w-[420px] rounded-lg border px-4 py-3 shadow-lg",
            "animate-fade-in",
            STYLES[toast.variant ?? "default"]
          )}
        >
          <span className="mt-0.5 shrink-0">{ICONS[toast.variant ?? "default"]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="text-xs mt-0.5 opacity-80">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
