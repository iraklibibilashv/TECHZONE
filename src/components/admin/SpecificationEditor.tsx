
type SpecificationEditorProps = {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
};

export default function SpecificationEditor({
  value,
  onChange,
}: SpecificationEditorProps) {
  const entries = Object.entries(value);

  function update(index: number, key: string, text: string) {
    const next = [...entries];
    next[index] =
      key === "name"
        ? [text, next[index][1]]
        : [next[index][0], text];

    onChange(Object.fromEntries(next));
  }

  function add() {
    let index = entries.length + 1;
    let name = `Specification ${index}`;

    while (name in value) {
      index++;
      name = `Specification ${index}`;
    }

    onChange({ ...value, [name]: "" });
  }

  function remove(index: number) {
    onChange(
      Object.fromEntries(
        entries.filter((_, i) => i !== index)
      )
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-blue-400">
          Specifications
        </h3>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
        >
          + Add Specification
        </button>
      </div>

      {entries.map(([name, detail], index) => (
        <div
          key={index}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={name}
            onChange={(e) =>
              update(index, "name", e.target.value)
            }
            placeholder="Name (e.g. RAM)"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <input
            value={detail}
            onChange={(e) =>
              update(index, "value", e.target.value)
            }
            placeholder="Value (e.g. 32GB)"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-xl bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
