"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Portfolio } from "../model/types";
import { portfolioReducer, type PortfolioAction } from "./reducer";

export type Mode = "viewer" | "admin";

type PortfolioContextValue = {
  portfolio: Portfolio;
  mode: Mode;
  isAdmin: boolean;
  /** No-op in viewer mode. */
  dispatch: (action: PortfolioAction) => void;
  /** True when admin edits differ from the published data. */
  isDirty: boolean;
  resetDraft: () => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

// Until server persistence exists, admin edits are a per-browser draft.
const DRAFT_KEY = "portfolio:admin-draft:v1";

function readDraft(): Portfolio | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Portfolio;
    return parsed?.profile && Array.isArray(parsed.projects) ? parsed : null;
  } catch {
    return null;
  }
}

function writeDraft(portfolio: Portfolio | null) {
  try {
    if (portfolio) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(portfolio));
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Storage unavailable (private mode): edits live for this session only.
  }
}

export function PortfolioProvider({
  initial,
  mode,
  children,
}: {
  initial: Portfolio;
  mode: Mode;
  children: React.ReactNode;
}) {
  // `initial` is the published data; any other state object is a draft.
  const [portfolio, rawDispatch] = useReducer(portfolioReducer, initial);

  // Admin: restore the saved draft after hydration (server renders published data).
  useEffect(() => {
    if (mode !== "admin") return;
    const draft = readDraft();
    if (draft) rawDispatch({ type: "replace", portfolio: draft });
  }, [mode]);

  // Admin: persist edits. Only an explicit reset clears the draft, so the
  // first render (still showing published data) can never erase it.
  useEffect(() => {
    if (mode === "admin" && portfolio !== initial) writeDraft(portfolio);
  }, [mode, portfolio, initial]);

  const dispatch = useCallback(
    (action: PortfolioAction) => {
      if (mode === "admin") rawDispatch(action);
    },
    [mode],
  );

  const resetDraft = useCallback(() => {
    writeDraft(null);
    rawDispatch({ type: "replace", portfolio: initial });
  }, [initial]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      portfolio,
      mode,
      isAdmin: mode === "admin",
      dispatch,
      isDirty: portfolio !== initial,
      resetDraft,
    }),
    [portfolio, mode, dispatch, initial, resetDraft],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return ctx;
}
