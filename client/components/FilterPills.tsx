interface PillOption<T extends string> {
  value: T;
  label: string;
  tone: string;
}

interface FilterPillsProps<T extends string> {
  options: PillOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
  ariaLabel: string;
}

export default function FilterPills<T extends string>({
  options,
  selected,
  onToggle,
  ariaLabel,
}: FilterPillsProps<T>) {
  return (
    <div className="pills" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            className={`pill${active ? ` is-active is-${option.tone}` : ""}`}
            aria-pressed={active}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
