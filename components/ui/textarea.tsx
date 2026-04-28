import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-blue-400",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
