"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-[380px] flex-col gap-2 p-4",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

type ToastVariant = "default" | "success" | "destructive" | "info";

const toastVariantStyles: Record<ToastVariant, string> = {
  default: "bg-card border-border text-foreground",
  success: "bg-success/10 border-success/30 text-success",
  destructive: "bg-destructive/10 border-destructive/30 text-destructive",
  info: "bg-primary/10 border-primary/30 text-primary",
};

const ToastIcon: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4" />,
  destructive: <AlertCircle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
}

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = "default", title, description, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all animate-slide-in-right",
        toastVariantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="mt-0.5 shrink-0">{ToastIcon[variant]}</div>
      <div className="flex-1 space-y-1">
        {title && <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>}
        {description && <ToastPrimitive.Description className="text-xs opacity-80">{description}</ToastPrimitive.Description>}
      </div>
      <ToastPrimitive.Close className="shrink-0 rounded-md p-1 opacity-50 hover:opacity-100 transition-opacity">
        <X className="h-3 w-3" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
);
Toast.displayName = "Toast";

// ── Toast Hook ────────────────────────────────────────────────────────────────

type ToastMessage = {
  id: string;
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
};

const toastState: { toasts: ToastMessage[]; listeners: Set<() => void> } = {
  toasts: [],
  listeners: new Set(),
};

function notify(listeners: Set<() => void>) {
  listeners.forEach((l) => l());
}

export function toast(msg: Omit<ToastMessage, "id">) {
  const id = Math.random().toString(36).slice(2);
  toastState.toasts.push({ id, ...msg });
  notify(toastState.listeners);
  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
    notify(toastState.listeners);
  }, msg.duration ?? 4000);
}

export function useToastState() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    const listener = () => setToasts([...toastState.toasts]);
    toastState.listeners.add(listener);
    return () => { toastState.listeners.delete(listener); };
  }, []);

  return toasts;
}

// ── Toaster ───────────────────────────────────────────────────────────────────

export function Toaster() {
  const toasts = useToastState();
  return (
    <ToastProvider>
      {toasts.map(({ id, ...props }) => (
        <Toast key={id} open {...props} />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export { ToastProvider, ToastViewport, Toast };
