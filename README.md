# benchgecko

JavaScript/TypeScript client for [BenchGecko](https://benchgecko.ai), the AI model data platform. Look up benchmarks, compare models head-to-head, explore provider pricing, and estimate inference costs -- all from a single import with zero dependencies.

BenchGecko tracks 414 models across 55 providers and 40 benchmarks, giving developers and teams the data they need to pick the right model for every task.

## Installation

```bash
npm install benchgecko
```

## Quick Start

```js
const bg = require("benchgecko");

// Look up a model
const model = bg.getModel("claude-3-5-sonnet");
console.log(model.name);            // "Claude 3.5 Sonnet"
console.log(model.provider);        // "Anthropic"
console.log(model.benchmarks.mmlu); // 88.7

// Estimate cost for a single call
const cost = bg.estimateCost({
  model: "gpt-4o",
  inputTokens: 4000,
  outputTokens: 1000,
});
console.log(`Total: $${cost.totalCost}`); // Total: $0.02
```

## API Reference

### getModel(slug)

Returns the full data object for a model, including benchmark scores and pricing. Returns `null` if the slug is not found.

```js
const gpt4o = bg.getModel("gpt-4o");
// { slug, name, provider, contextWindow, inputPricePer1M, outputPricePer1M, benchmarks }
```

### compareModels(slugA, slugB)

Side-by-side comparison across every tracked benchmark, plus a pricing cost ratio. Useful for building comparison tables or making procurement decisions.

```js
const cmp = bg.compareModels("gpt-4o", "claude-3-5-sonnet");

// Per-benchmark delta
console.log(cmp.benchmarks.humaneval);
// { a: 90.2, b: 92.0, delta: -1.8, winner: "claude-3-5-sonnet" }

// Which model is cheaper overall?
console.log(cmp.pricing.cheaperModel); // "gpt-4o"
console.log(cmp.pricing.costRatio);    // 0.694
```

### getPricing(provider)

Lists every model from a provider with input/output pricing per million tokens and context window size.

```js
bg.getPricing("anthropic").forEach((m) => {
  console.log(`${m.name}: $${m.inputPricePer1M}/M in, $${m.outputPricePer1M}/M out`);
});
// Claude 3.5 Sonnet: $3/M in, $15/M out
// Claude 3 Haiku: $0.25/M in, $1.25/M out
```

### listBenchmarks()

Returns metadata for all tracked benchmarks (name, full name, description, scale).

```js
bg.listBenchmarks().forEach((b) => {
  console.log(`${b.name} (${b.fullName}): ${b.description}`);
});
```

### estimateCost({ model, inputTokens, outputTokens })

Calculates the USD cost for a single inference call broken down by input and output.

```js
const estimate = bg.estimateCost({
  model: "deepseek-v3",
  inputTokens: 10000,
  outputTokens: 2000,
});
console.log(estimate);
// { model: "deepseek-v3", inputCost: 0.0027, outputCost: 0.0022, totalCost: 0.0049, ... }
```

### listModels() / listProviders()

Convenience helpers that return sorted arrays of all available model slugs and provider keys.

```js
console.log(bg.listModels());
// ["claude-3-5-sonnet", "claude-3-haiku", "command-r-plus", "deepseek-v3", ...]

console.log(bg.listProviders());
// ["anthropic", "cohere", "deepseek", "google", "meta", "mistral", "openai"]
```

## TypeScript

Full type declarations are included (`index.d.ts`). Import and use directly in TypeScript projects -- no `@types` package needed.

```ts
import { getModel, estimateCost, type ModelData, type CostEstimate } from "benchgecko";

const model: ModelData | null = getModel("gemini-2-0-flash");
const cost: CostEstimate = estimateCost({ model: "gemini-2-0-flash", inputTokens: 5000, outputTokens: 1000 });
```

## Data Coverage

The bundled snapshot covers the most-used models from OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, and Cohere. For the full catalogue of 414 models, 55 providers, and 40 benchmarks, visit [benchgecko.ai](https://benchgecko.ai).

Pricing data and benchmark scores are updated with each package release. For real-time pricing, check the [pricing page](https://benchgecko.ai/pricing).

## License

MIT
