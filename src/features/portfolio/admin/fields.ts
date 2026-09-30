/** Declarative form fields: one generic form edits every entity type. */
export type Field =
  | {
      name: string;
      label: string;
      type: "text" | "email" | "url" | "month" | "textarea";
      required?: boolean;
      placeholder?: string;
      hint?: string;
    }
  /** string[] edited one item per line. */
  | { name: string; label: string; type: "list"; hint?: string; required?: boolean }
  /** string[] edited as comma-separated values. */
  | { name: string; label: string; type: "tags"; hint?: string; required?: boolean }
  | { name: string; label: string; type: "checkbox"; hint?: string }
  | {
      name: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      hint?: string;
    }
  /** string[] of option values. */
  | {
      name: string;
      label: string;
      type: "multiselect";
      options: { value: string; label: string }[];
      hint?: string;
    }
  /** Link[] edited as "Label | https://url" per line. */
  | { name: string; label: string; type: "links"; hint?: string };

export type FormValues = Record<string, string | boolean | string[]>;

type Obj = Record<string, unknown>;

export function toFormValues(value: Obj, fields: Field[]): FormValues {
  const out: FormValues = {};
  for (const f of fields) {
    const v = value[f.name];
    switch (f.type) {
      case "list":
        out[f.name] = ((v as string[] | undefined) ?? []).join("\n");
        break;
      case "tags":
        out[f.name] = ((v as string[] | undefined) ?? []).join(", ");
        break;
      case "links":
        out[f.name] = ((v as { label: string; url: string }[] | undefined) ?? [])
          .map((l) => `${l.label} | ${l.url}`)
          .join("\n");
        break;
      case "checkbox":
        out[f.name] = Boolean(v);
        break;
      case "multiselect":
        out[f.name] = (v as string[] | undefined) ?? [];
        break;
      default:
        out[f.name] = (v as string | undefined) ?? "";
    }
  }
  return out;
}

const splitLines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

export function fromFormValues(values: FormValues, fields: Field[]): Obj {
  const out: Obj = {};
  for (const f of fields) {
    const v = values[f.name];
    switch (f.type) {
      case "list":
        out[f.name] = splitLines(v as string);
        break;
      case "tags":
        out[f.name] = (v as string)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
        break;
      case "links":
        out[f.name] = splitLines(v as string).map((line) => {
          const [label, ...rest] = line.split("|");
          const url = rest.join("|").trim();
          return url
            ? { label: label.trim(), url }
            : { label: label.trim(), url: label.trim() };
        });
        break;
      case "checkbox":
      case "multiselect":
        out[f.name] = v;
        break;
      default: {
        const text = (v as string).trim();
        // Empty optional text becomes undefined (e.g. "end" = present).
        out[f.name] = text === "" ? undefined : text;
      }
    }
  }
  return out;
}

/** Returns the label of the first required field left empty, if any. */
export function missingRequired(values: FormValues, fields: Field[]): string | null {
  for (const f of fields) {
    if (!("required" in f) || !f.required) continue;
    const v = values[f.name];
    if (typeof v === "string" && v.trim() === "") return f.label;
  }
  return null;
}
