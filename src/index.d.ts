/**
 * BenchGecko - Official TypeScript SDK for the BenchGecko API.
 */

export interface BenchGeckoOptions {
  /** API base URL. Defaults to https://benchgecko.ai */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  provider: string;
  parameters?: number;
  context_window?: number;
  pricing?: {
    input_per_million?: number;
    output_per_million?: number;
  };
  scores?: Record<string, number>;
  [key: string]: unknown;
}

export interface Benchmark {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  [key: string]: unknown;
}

export interface ComparisonResult {
  models: Array<{
    name: string;
    slug: string;
    provider: string;
    scores: Record<string, number>;
    pricing?: {
      input_per_million?: number;
      output_per_million?: number;
    };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export class BenchGeckoError extends Error {
  statusCode: number | null;
  constructor(message: string, statusCode?: number);
}

export class BenchGecko {
  constructor(options?: BenchGeckoOptions);

  /** List all AI models tracked by BenchGecko. */
  models(): Promise<Model[]>;

  /** List all benchmarks tracked by BenchGecko. */
  benchmarks(): Promise<Benchmark[]>;

  /** Compare two or more AI models side by side. */
  compare(models: string[]): Promise<ComparisonResult>;
}
