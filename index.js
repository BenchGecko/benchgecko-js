"use strict";

/**
 * BenchGecko - AI Model Data Platform Client
 *
 * Compare LLM benchmarks, estimate inference costs, and explore
 * pricing across 55+ providers. Data sourced from benchgecko.ai.
 *
 * @module benchgecko
 * @see https://benchgecko.ai
 */

// ---------------------------------------------------------------------------
// Internal catalogue (snapshot — call the API for live data)
// ---------------------------------------------------------------------------

const MODELS = {
  "gpt-4o": {
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    inputPricePer1M: 2.50,
    outputPricePer1M: 10.00,
    benchmarks: { mmlu: 88.7, humaneval: 90.2, gpqa: 53.6, math: 76.6 },
  },
  "gpt-4o-mini": {
    name: "GPT-4o Mini",
    provider: "OpenAI",
    contextWindow: 128000,
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.60,
    benchmarks: { mmlu: 82.0, humaneval: 87.0, gpqa: 40.2, math: 70.2 },
  },
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    benchmarks: { mmlu: 88.7, humaneval: 92.0, gpqa: 59.4, math: 78.3 },
  },
  "claude-3-haiku": {
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 0.25,
    outputPricePer1M: 1.25,
    benchmarks: { mmlu: 75.2, humaneval: 75.9, gpqa: 33.3, math: 38.9 },
  },
  "gemini-1-5-pro": {
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: 2000000,
    inputPricePer1M: 1.25,
    outputPricePer1M: 5.00,
    benchmarks: { mmlu: 85.9, humaneval: 84.1, gpqa: 46.2, math: 67.7 },
  },
  "gemini-2-0-flash": {
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputPricePer1M: 0.10,
    outputPricePer1M: 0.40,
    benchmarks: { mmlu: 83.2, humaneval: 82.6, gpqa: 43.1, math: 64.2 },
  },
  "llama-3-1-405b": {
    name: "Llama 3.1 405B",
    provider: "Meta",
    contextWindow: 128000,
    inputPricePer1M: 3.00,
    outputPricePer1M: 3.00,
    benchmarks: { mmlu: 87.3, humaneval: 89.0, gpqa: 51.1, math: 73.8 },
  },
  "mistral-large": {
    name: "Mistral Large",
    provider: "Mistral",
    contextWindow: 128000,
    inputPricePer1M: 2.00,
    outputPricePer1M: 6.00,
    benchmarks: { mmlu: 84.0, humaneval: 82.7, gpqa: 45.3, math: 69.1 },
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    contextWindow: 128000,
    inputPricePer1M: 0.27,
    outputPricePer1M: 1.10,
    benchmarks: { mmlu: 87.1, humaneval: 82.6, gpqa: 59.1, math: 90.2 },
  },
  "command-r-plus": {
    name: "Command R+",
    provider: "Cohere",
    contextWindow: 128000,
    inputPricePer1M: 2.50,
    outputPricePer1M: 10.00,
    benchmarks: { mmlu: 75.7, humaneval: 70.1, gpqa: 33.8, math: 48.5 },
  },
};

const BENCHMARKS = {
  mmlu: {
    name: "MMLU",
    fullName: "Massive Multitask Language Understanding",
    description:
      "Tests knowledge across 57 subjects including STEM, humanities, and social sciences.",
    scale: { min: 0, max: 100 },
  },
  humaneval: {
    name: "HumanEval",
    fullName: "HumanEval Code Generation",
    description:
      "Measures functional correctness of code generated from docstrings (164 problems).",
    scale: { min: 0, max: 100 },
  },
  gpqa: {
    name: "GPQA",
    fullName: "Graduate-Level Google-Proof Q&A",
    description:
      "PhD-level questions in biology, physics, and chemistry designed to resist web search.",
    scale: { min: 0, max: 100 },
  },
  math: {
    name: "MATH",
    fullName: "Mathematics Problem Solving",
    description:
      "Competition-level mathematics problems spanning algebra through calculus.",
    scale: { min: 0, max: 100 },
  },
};

const PROVIDERS = {
  openai: {
    name: "OpenAI",
    website: "https://openai.com",
    models: ["gpt-4o", "gpt-4o-mini"],
  },
  anthropic: {
    name: "Anthropic",
    website: "https://anthropic.com",
    models: ["claude-3-5-sonnet", "claude-3-haiku"],
  },
  google: {
    name: "Google",
    website: "https://ai.google.dev",
    models: ["gemini-1-5-pro", "gemini-2-0-flash"],
  },
  meta: {
    name: "Meta",
    website: "https://llama.meta.com",
    models: ["llama-3-1-405b"],
  },
  mistral: {
    name: "Mistral",
    website: "https://mistral.ai",
    models: ["mistral-large"],
  },
  deepseek: {
    name: "DeepSeek",
    website: "https://deepseek.com",
    models: ["deepseek-v3"],
  },
  cohere: {
    name: "Cohere",
    website: "https://cohere.com",
    models: ["command-r-plus"],
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up a model by its slug.
 *
 * @param {string} slug - Model identifier (e.g. "gpt-4o", "claude-3-5-sonnet").
 * @returns {object|null} Model data object or null if not found.
 *
 * @example
 * const bg = require("benchgecko");
 * const model = bg.getModel("claude-3-5-sonnet");
 * console.log(model.name);              // "Claude 3.5 Sonnet"
 * console.log(model.benchmarks.mmlu);   // 88.7
 */
function getModel(slug) {
  const model = MODELS[slug];
  if (!model) return null;
  return { slug, ...model };
}

/**
 * Compare two models side-by-side across all tracked benchmarks.
 *
 * @param {string} slugA - First model slug.
 * @param {string} slugB - Second model slug.
 * @returns {object} Comparison object with per-benchmark deltas and a cost ratio.
 *
 * @example
 * const bg = require("benchgecko");
 * const cmp = bg.compareModels("gpt-4o", "claude-3-5-sonnet");
 * console.log(cmp.benchmarks.humaneval);
 * // { a: 90.2, b: 92.0, delta: -1.8, winner: "claude-3-5-sonnet" }
 */
function compareModels(slugA, slugB) {
  const a = MODELS[slugA];
  const b = MODELS[slugB];
  if (!a || !b) {
    throw new Error(
      `Model not found: ${!a ? slugA : slugB}. Use listModels() to see available slugs.`
    );
  }

  const benchmarkComparison = {};
  const allKeys = new Set([
    ...Object.keys(a.benchmarks),
    ...Object.keys(b.benchmarks),
  ]);

  for (const key of allKeys) {
    const va = a.benchmarks[key] ?? null;
    const vb = b.benchmarks[key] ?? null;
    let delta = null;
    let winner = null;
    if (va !== null && vb !== null) {
      delta = +(va - vb).toFixed(2);
      winner = delta > 0 ? slugA : delta < 0 ? slugB : "tie";
    }
    benchmarkComparison[key] = { a: va, b: vb, delta, winner };
  }

  const costA = a.inputPricePer1M + a.outputPricePer1M;
  const costB = b.inputPricePer1M + b.outputPricePer1M;
  const costRatio = +(costA / costB).toFixed(3);

  return {
    modelA: { slug: slugA, name: a.name, provider: a.provider },
    modelB: { slug: slugB, name: b.name, provider: b.provider },
    benchmarks: benchmarkComparison,
    pricing: {
      a: { input: a.inputPricePer1M, output: a.outputPricePer1M },
      b: { input: b.inputPricePer1M, output: b.outputPricePer1M },
      costRatio,
      cheaperModel: costRatio < 1 ? slugA : costRatio > 1 ? slugB : "equal",
    },
  };
}

/**
 * Get pricing details for all models from a given provider.
 *
 * @param {string} provider - Provider key (e.g. "openai", "anthropic").
 * @returns {object[]} Array of pricing objects.
 *
 * @example
 * const bg = require("benchgecko");
 * bg.getPricing("anthropic").forEach((m) => {
 *   console.log(`${m.name}: $${m.inputPricePer1M} in / $${m.outputPricePer1M} out`);
 * });
 */
function getPricing(provider) {
  const key = provider.toLowerCase();
  const p = PROVIDERS[key];
  if (!p) {
    throw new Error(
      `Provider not found: ${provider}. Available: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }
  return p.models.map((slug) => {
    const m = MODELS[slug];
    return {
      slug,
      name: m.name,
      inputPricePer1M: m.inputPricePer1M,
      outputPricePer1M: m.outputPricePer1M,
      contextWindow: m.contextWindow,
    };
  });
}

/**
 * List every tracked benchmark with its metadata.
 *
 * @returns {object[]} Array of benchmark descriptors.
 *
 * @example
 * const bg = require("benchgecko");
 * bg.listBenchmarks().forEach((b) => console.log(`${b.name}: ${b.description}`));
 */
function listBenchmarks() {
  return Object.entries(BENCHMARKS).map(([key, val]) => ({ key, ...val }));
}

/**
 * List all available model slugs.
 *
 * @returns {string[]} Sorted array of model slug strings.
 */
function listModels() {
  return Object.keys(MODELS).sort();
}

/**
 * List all available provider keys.
 *
 * @returns {string[]} Sorted array of provider key strings.
 */
function listProviders() {
  return Object.keys(PROVIDERS).sort();
}

/**
 * Estimate the cost of a single inference call.
 *
 * @param {object} options
 * @param {string} options.model - Model slug.
 * @param {number} options.inputTokens - Number of input (prompt) tokens.
 * @param {number} options.outputTokens - Number of output (completion) tokens.
 * @returns {object} Breakdown with inputCost, outputCost, and totalCost in USD.
 *
 * @example
 * const bg = require("benchgecko");
 * const cost = bg.estimateCost({
 *   model: "gpt-4o",
 *   inputTokens: 2000,
 *   outputTokens: 500,
 * });
 * console.log(`Total: $${cost.totalCost}`); // Total: $0.01
 */
function estimateCost({ model, inputTokens, outputTokens }) {
  const m = MODELS[model];
  if (!m) {
    throw new Error(
      `Model not found: ${model}. Use listModels() to see available slugs.`
    );
  }
  const inputCost = +((inputTokens / 1_000_000) * m.inputPricePer1M).toFixed(6);
  const outputCost = +(
    (outputTokens / 1_000_000) *
    m.outputPricePer1M
  ).toFixed(6);
  const totalCost = +(inputCost + outputCost).toFixed(6);

  return {
    model,
    provider: m.provider,
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost,
    currency: "USD",
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  getModel,
  compareModels,
  getPricing,
  listBenchmarks,
  listModels,
  listProviders,
  estimateCost,
};
