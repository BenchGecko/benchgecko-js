export interface ModelData {
  slug: string;
  name: string;
  provider: string;
  contextWindow: number;
  inputPricePer1M: number;
  outputPricePer1M: number;
  benchmarks: Record<string, number>;
}

export interface BenchmarkComparison {
  a: number | null;
  b: number | null;
  delta: number | null;
  winner: string | null;
}

export interface ModelRef {
  slug: string;
  name: string;
  provider: string;
}

export interface PricingInfo {
  a: { input: number; output: number };
  b: { input: number; output: number };
  costRatio: number;
  cheaperModel: string;
}

export interface ComparisonResult {
  modelA: ModelRef;
  modelB: ModelRef;
  benchmarks: Record<string, BenchmarkComparison>;
  pricing: PricingInfo;
}

export interface ProviderPricing {
  slug: string;
  name: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
  contextWindow: number;
}

export interface BenchmarkInfo {
  key: string;
  name: string;
  fullName: string;
  description: string;
  scale: { min: number; max: number };
}

export interface CostEstimate {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
}

export function getModel(slug: string): ModelData | null;
export function compareModels(slugA: string, slugB: string): ComparisonResult;
export function getPricing(provider: string): ProviderPricing[];
export function listBenchmarks(): BenchmarkInfo[];
export function listModels(): string[];
export function listProviders(): string[];
export function estimateCost(options: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): CostEstimate;
