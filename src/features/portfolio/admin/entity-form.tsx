"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/primitives";
import {
  fromFormValues,
  missingRequired,
  toFormValues,
  type Field,
  type FormValues,
} from "./fields";

const inputClass =
  "border-line bg-bg text-fg placeholder:text-faint focus:border-accent w-full rounded-lg border px-3 py-2 text-sm outline-none transition";

/** Generic create/edit form driven by a field schema. */
export function EntityForm({
  fields,
  initial,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: {
  fields: Field[];
  initial: Record<string, unknown>;
  submitLabel?: string;
  onSubmit: (value: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(initial, fields));
  const [error, setError] = useState<string | null>(null);
  const baseId = useId();

  const set = (name: string, value: FormValues[string]) =>
    setValues((v) => ({ ...v, [name]: value }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const missing = missingRequired(values, fields);
        if (missing) {
          setError(`${missing} is required.`);
          return;
        }
        onSubmit({ ...initial, ...fromFormValues(values, fields) });
      }}
    >
      {fields.map((field) => {
        const id = `${baseId}-${field.name}`;
        const hint = "hint" in field && field.hint ? field.hint : null;
        const required = "required" in field && field.required;

        if (field.type === "checkbox") {
          return (
            <label
              key={field.name}
              htmlFor={id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                id={id}
                type="checkbox"
                className="accent-accent size-4"
                checked={values[field.name] as boolean}
                onChange={(e) => set(field.name, e.target.checked)}
              />
              {field.label}
            </label>
          );
        }

        return (
          <div key={field.name} className="space-y-1.5">
            <label htmlFor={id} className="text-fg block text-sm font-medium">
              {field.label}
              {required ? <span className="text-danger"> *</span> : null}
            </label>

            {field.type === "textarea" ||
            field.type === "list" ||
            field.type === "links" ? (
              <textarea
                id={id}
                rows={field.type === "textarea" ? 3 : 5}
                className={inputClass}
                value={values[field.name] as string}
                onChange={(e) => set(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                id={id}
                className={inputClass}
                value={values[field.name] as string}
                onChange={(e) => set(field.name, e.target.value)}
              >
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === "multiselect" ? (
              <div id={id} className="flex flex-wrap gap-2">
                {field.options.length === 0 ? (
                  <p className="text-faint text-sm">Nothing to link yet.</p>
                ) : null}
                {field.options.map((o) => {
                  const selected = (values[field.name] as string[]).includes(o.value);
                  return (
                    <label
                      key={o.value}
                      className="border-line has-checked:border-accent has-checked:bg-accent-soft flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="accent-accent"
                        checked={selected}
                        onChange={(e) => {
                          const current = values[field.name] as string[];
                          set(
                            field.name,
                            e.target.checked
                              ? [...current, o.value]
                              : current.filter((v) => v !== o.value),
                          );
                        }}
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            ) : (
              <input
                id={id}
                type={field.type}
                className={inputClass}
                placeholder={"placeholder" in field ? field.placeholder : undefined}
                value={values[field.name] as string}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}

            {hint ? <p className="text-faint text-xs">{hint}</p> : null}
          </div>
        );
      })}

      {error ? (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
