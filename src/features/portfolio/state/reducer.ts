import type { CollectionItem, CollectionKey, Portfolio, Profile } from "../model/types";

export type PortfolioAction =
  | { type: "profile/update"; patch: Partial<Profile> }
  | {
      type: "collection/upsert";
      collection: CollectionKey;
      item: CollectionItem<CollectionKey>;
    }
  | { type: "collection/remove"; collection: CollectionKey; id: string }
  | { type: "collection/move"; collection: CollectionKey; id: string; offset: -1 | 1 }
  | { type: "replace"; portfolio: Portfolio };

type WithId = { id: string };

/** Pure state transitions for admin CRUD. Persistence is handled elsewhere. */
export function portfolioReducer(state: Portfolio, action: PortfolioAction): Portfolio {
  switch (action.type) {
    case "profile/update":
      return { ...state, profile: { ...state.profile, ...action.patch } };

    case "collection/upsert": {
      const list = state[action.collection] as WithId[];
      const exists = list.some((i) => i.id === action.item.id);
      const next = exists
        ? list.map((i) => (i.id === action.item.id ? action.item : i))
        : [...list, action.item];
      return { ...state, [action.collection]: next };
    }

    case "collection/remove": {
      const list = state[action.collection] as WithId[];
      const next = {
        ...state,
        [action.collection]: list.filter((i) => i.id !== action.id),
      };
      // Keep references consistent.
      if (action.collection === "projects") {
        next.experience = next.experience.map((e) => ({
          ...e,
          projectIds: e.projectIds.filter((id) => id !== action.id),
        }));
      }
      if (action.collection === "experience") {
        next.projects = next.projects.map((p) =>
          p.experienceId === action.id ? { ...p, experienceId: undefined } : p,
        );
      }
      return next;
    }

    case "collection/move": {
      const list = [...(state[action.collection] as WithId[])];
      const from = list.findIndex((i) => i.id === action.id);
      const to = from + action.offset;
      if (from < 0 || to < 0 || to >= list.length) return state;
      [list[from], list[to]] = [list[to], list[from]];
      return { ...state, [action.collection]: list };
    }

    case "replace":
      return action.portfolio;
  }
}

/** Short, URL-safe unique id for new items. */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
