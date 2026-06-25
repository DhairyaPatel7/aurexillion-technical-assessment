interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  tone?: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  disabled?: boolean;
}

export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  disabled,
}: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`segmented__item${active ? ` is-active is-${option.tone ?? "neutral"}` : ""}`}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
