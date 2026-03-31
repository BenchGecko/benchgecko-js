# BenchGecko JavaScript SDK

Official JavaScript/TypeScript client for the [BenchGecko](https://benchgecko.ai) API. Query AI model data, benchmark scores, and run side-by-side comparisons from Node.js or any JavaScript runtime.

BenchGecko tracks every major AI model, benchmark, and provider. This SDK wraps the public REST API so you can integrate AI model intelligence into your applications, dashboards, and developer tools.

## Installation

```bash
npm install benchgecko
```

Works with Node.js 14+ and any runtime that supports the Fetch API.

## Quick Start

```javascript
const { BenchGecko } = require('benchgecko');

const client = new BenchGecko();

// List all tracked AI models
const models = await client.models();
console.log(`Tracking ${models.length} models`);

// List all benchmarks
const benchmarks = await client.benchmarks();
benchmarks.forEach(b => console.log(b.name));

// Compare two models head-to-head
const comparison = await client.compare(['gpt-4o', 'claude-opus-4']);
comparison.models.forEach(m => {
  console.log(m.name, m.scores);
});
```

## TypeScript Support

Full TypeScript definitions are included out of the box:

```typescript
import { BenchGecko, Model, Benchmark, ComparisonResult } from 'benchgecko';

const client = new BenchGecko();
const models: Model[] = await client.models();
const result: ComparisonResult = await client.compare(['gpt-4o', 'claude-opus-4']);
```

## API Reference

### `new BenchGecko(options?)`

Create a client instance.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | string | `https://benchgecko.ai` | API base URL |
| `timeout` | number | `30000` | Request timeout in ms |

### `client.models()`

Fetch all AI models tracked by BenchGecko. Returns an array of model objects containing name, provider, parameter count, pricing tiers, and benchmark scores.

### `client.benchmarks()`

Fetch all benchmarks tracked by BenchGecko. Returns an array of benchmark objects with name, category, and description.

### `client.compare(models)`

Compare two or more models side by side. Pass an array of model slugs. Returns a structured comparison with per-model scores, pricing, and capability breakdowns.

## Error Handling

```javascript
const { BenchGecko, BenchGeckoError } = require('benchgecko');

const client = new BenchGecko();
try {
  const models = await client.models();
} catch (error) {
  if (error instanceof BenchGeckoError) {
    console.error(`API error: ${error.message} (status: ${error.statusCode})`);
  }
}
```

## Data Attribution

Data provided by [BenchGecko](https://benchgecko.ai). Benchmark scores sourced from official evaluation suites. Pricing data updated daily from provider APIs.

## Links

- [BenchGecko](https://benchgecko.ai) - AI model benchmarks, pricing, and rankings
- [API Documentation](https://benchgecko.ai/api-docs)
- [GitHub Repository](https://github.com/BenchGecko/benchgecko-js)

## License

MIT
