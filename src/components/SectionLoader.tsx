import { LoaderCircle } from "lucide-react";

export function SectionLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="w-full min-h-[220px] flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center">
        <span className="absolute w-11 h-11 rounded-full border border-primary/20 animate-ping" />
        <LoaderCircle className="w-7 h-7 text-primary animate-spin" aria-hidden="true" />
      </div>
      <span className="text-xs font-medium text-muted-foreground tracking-wide">{label}...</span>
    </div>
  );
}

export function SectionError({ message = "This section could not be loaded." }: { message?: string }) {
  return (
    <div className="w-full min-h-[180px] flex items-center justify-center px-6 py-12 text-center" role="alert">
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
