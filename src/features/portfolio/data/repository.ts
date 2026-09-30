import type { Portfolio } from "../model/types";
import { portfolioData } from "./portfolio.constants";

/**
 * The only place the UI gets portfolio data from.
 *
 * Current:  constants → getPortfolio() → UI
 * Future:   database/API → getPortfolio() → UI   (swap the implementation here)
 */
export interface PortfolioRepository {
  get(): Promise<Portfolio>;
}

export const constantsRepository: PortfolioRepository = {
  async get() {
    // Clone so callers can never mutate the module-level constants.
    return structuredClone(portfolioData);
  },
};

const repository: PortfolioRepository = constantsRepository;

export function getPortfolio(): Promise<Portfolio> {
  return repository.get();
}
