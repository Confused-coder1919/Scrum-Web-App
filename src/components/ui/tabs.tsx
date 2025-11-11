import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return ctx;
}

type TabsProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function Tabs({
  defaultValue,
  children,
  value,
  onValueChange,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  React.useEffect(() => {
    if (value === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);
  const currentValue = value ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-2 rounded-lg bg-slate-100 p-1 text-sm",
        className
      )}
      {...props}
    />
  );
}

type TabsTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string;
  };

export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const { value: active, setValue } = useTabsContext();
  const isActive = active === value;
  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        "rounded-md px-3 py-1 font-medium transition",
        isActive ? "bg-white text-slate-900 shadow" : "text-slate-600",
        className
      )}
      {...props}
    />
  );
}

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({ className, value, ...props }: TabsContentProps) {
  const { value: active } = useTabsContext();
  if (active !== value) return null;
  return <div className={className} {...props} />;
}
