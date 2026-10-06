import { cn } from "@/lib/utils";

type SegmentedControlOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SegmentedControlProps<TValue extends string> = {
  ariaLabel: string;
  options: SegmentedControlOption<TValue>[];
  value: TValue;
  onValueChange: (value: TValue) => void;
  className?: string;
};

export function SegmentedControl<TValue extends string>({
  ariaLabel,
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "ui-control-pill inline-flex min-h-9 items-center bg-panel-muted p-0.5 shadow-none ring-1 ring-inset ring-border-control",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className="ui-control-interactive ui-control-pill ui-pressable ui-type-caption inline-flex h-8 min-w-20 cursor-pointer items-center justify-center px-4 leading-none text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-checked:bg-control-fill aria-checked:text-foreground aria-checked:shadow-none"
          onClick={() => {
            onValueChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
