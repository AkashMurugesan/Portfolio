"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button, IconButton } from "@/components/ui/primitives";
import type { CollectionItem, CollectionKey } from "../model/types";
import { newId } from "../state/reducer";
import { usePortfolio } from "../state/portfolio-context";
import { EntityForm } from "./entity-form";
import { blankItem, collectionFields, collectionLabels } from "./schemas";

type Target = { item: Record<string, unknown>; isNew: boolean } | null;

/**
 * Admin CRUD for one collection: returns controls to place in the UI plus the
 * edit dialog. In viewer mode every control renders nothing.
 */
export function useCollectionEditor<K extends CollectionKey>(collection: K) {
  const { portfolio, isAdmin, dispatch } = usePortfolio();
  const [target, setTarget] = useState<Target>(null);
  const label = collectionLabels[collection];
  const fields = collectionFields(collection, portfolio);

  const openNew = () =>
    setTarget({
      item: blankItem(collection, newId(collection.slice(0, 4))),
      isNew: true,
    });
  const openEdit = (item: CollectionItem<K>) =>
    setTarget({ item: item as Record<string, unknown>, isNew: false });

  const remove = (item: CollectionItem<K>) => {
    const name = item as {
      name?: string;
      title?: string;
      company?: string;
      category?: string;
    };
    const display = name.name ?? name.title ?? name.company ?? name.category ?? label;
    if (window.confirm(`Delete “${display}”? This cannot be undone.`)) {
      dispatch({ type: "collection/remove", collection, id: item.id });
    }
  };

  const addButton = (text?: string) =>
    isAdmin ? (
      <Button size="sm" onClick={openNew}>
        <Plus className="size-3.5" /> {text ?? `Add ${label}`}
      </Button>
    ) : null;

  const itemActions = (item: CollectionItem<K>, index: number, count: number) =>
    isAdmin ? (
      <div
        className="border-line bg-panel flex items-center rounded-lg border"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          label="Move up"
          disabled={index === 0}
          onClick={() =>
            dispatch({ type: "collection/move", collection, id: item.id, offset: -1 })
          }
        >
          <ArrowUp className="size-3.5" />
        </IconButton>
        <IconButton
          label="Move down"
          disabled={index === count - 1}
          onClick={() =>
            dispatch({ type: "collection/move", collection, id: item.id, offset: 1 })
          }
        >
          <ArrowDown className="size-3.5" />
        </IconButton>
        <IconButton label={`Edit ${label}`} onClick={() => openEdit(item)}>
          <Pencil className="size-3.5" />
        </IconButton>
        <IconButton
          label={`Delete ${label}`}
          className="hover:text-danger"
          onClick={() => remove(item)}
        >
          <Trash2 className="size-3.5" />
        </IconButton>
      </div>
    ) : null;

  const editor = isAdmin ? (
    <Dialog
      open={target !== null}
      onClose={() => setTarget(null)}
      title={target?.isNew ? `Add ${label}` : `Edit ${label}`}
    >
      {target ? (
        <EntityForm
          fields={fields}
          initial={target.item}
          submitLabel={target.isNew ? `Add ${label}` : "Save changes"}
          onCancel={() => setTarget(null)}
          onSubmit={(value) => {
            dispatch({
              type: "collection/upsert",
              collection,
              item: value as CollectionItem<K>,
            });
            setTarget(null);
          }}
        />
      ) : null}
    </Dialog>
  ) : null;

  return { addButton, itemActions, editor, openEdit };
}
