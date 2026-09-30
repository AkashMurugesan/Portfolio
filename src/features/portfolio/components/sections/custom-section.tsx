"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button, EmptyState, IconButton } from "@/components/ui/primitives";
import { useCollectionEditor } from "../../admin/collection-editor";
import { EntityForm } from "../../admin/entity-form";
import type { Field } from "../../admin/fields";
import type { CustomSection } from "../../model/types";
import { newId } from "../../state/reducer";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader } from "../section-header";

type Item = CustomSection["items"][number];

const itemFields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle", label: "Subtitle", type: "text" },
  { name: "body", label: "Details", type: "textarea" },
];

/** Renders an admin-defined section (title + list of simple cards). */
export function CustomSectionView({ sectionId }: { sectionId: string }) {
  const { portfolio, isAdmin, dispatch } = usePortfolio();
  const sections = useCollectionEditor("customSections");
  const [editing, setEditing] = useState<Item | null>(null);
  const index = portfolio.customSections.findIndex((s) => s.id === sectionId);
  const section = portfolio.customSections[index];

  if (!section) return <EmptyState title="This section no longer exists." />;

  const saveItems = (items: Item[]) =>
    dispatch({
      type: "collection/upsert",
      collection: "customSections",
      item: { ...section, items },
    });

  return (
    <div>
      <SectionHeader
        title={section.title}
        actions={
          isAdmin ? (
            <>
              {sections.itemActions(section, index, portfolio.customSections.length)}
              <Button
                size="sm"
                onClick={() =>
                  setEditing({ id: newId("item"), title: "", subtitle: "", body: "" })
                }
              >
                <Plus className="size-3.5" /> Add item
              </Button>
            </>
          ) : null
        }
      />
      {section.items.length === 0 ? (
        <EmptyState title="Nothing here yet.">
          {isAdmin ? "Add items to publish this section." : null}
        </EmptyState>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {section.items.map((item) => (
          <div key={item.id} className="border-line bg-card rounded-xl border p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{item.title}</p>
                {item.subtitle ? (
                  <p className="text-faint font-mono text-xs">{item.subtitle}</p>
                ) : null}
              </div>
              {isAdmin ? (
                <div className="flex">
                  <IconButton label="Edit item" onClick={() => setEditing(item)}>
                    <Pencil className="size-3.5" />
                  </IconButton>
                  <IconButton
                    label="Delete item"
                    className="hover:text-danger"
                    onClick={() => {
                      if (window.confirm(`Delete “${item.title}”?`)) {
                        saveItems(section.items.filter((i) => i.id !== item.id));
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </IconButton>
                </div>
              ) : null}
            </div>
            {item.body ? (
              <p className="text-muted mt-2 text-sm whitespace-pre-line">{item.body}</p>
            ) : null}
          </div>
        ))}
      </div>

      {isAdmin ? (
        <Dialog
          open={editing !== null}
          onClose={() => setEditing(null)}
          title="Section item"
        >
          {editing ? (
            <EntityForm
              fields={itemFields}
              initial={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(value) => {
                const item = {
                  ...editing,
                  ...value,
                  subtitle: value.subtitle ?? "",
                  body: value.body ?? "",
                } as Item;
                const exists = section.items.some((i) => i.id === item.id);
                saveItems(
                  exists
                    ? section.items.map((i) => (i.id === item.id ? item : i))
                    : [...section.items, item],
                );
                setEditing(null);
              }}
            />
          ) : null}
        </Dialog>
      ) : null}
      {sections.editor}
    </div>
  );
}
