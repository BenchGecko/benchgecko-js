/**
 * BenchGecko - Official JavaScript SDK for the BenchGecko API.
 *
 * Compare AI models, benchmarks, and pricing programmatically.
 *
 * @example
 * const { BenchGecko } = require('benchgecko');
 * const client = new BenchGecko();
 * const models = await client.models();
 */

class BenchGeckoError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'BenchGeckoError';
    this.statusCode = statusCode || null;
  }
}

class BenchGecko {
  /**
   * Create a BenchGecko API client.
   *
   * @param {Object} [options]
   * @param {string} [options.baseUrl='https://benchgecko.ai'] - API base URL.
   * @param {number} [options.timeout=30000] - Request timeout in milliseconds.
   */
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || 'https://benchgecko.ai').replace(/\/+$/, '');
    this.timeout = options.timeout || 30000;
  }

  /**
   * Send a request to the BenchGecko API.
   * @private
   */
  async _request(path, params = {}) {
    const url = new URL(path, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'benchgecko-js/1.0.0',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new BenchGeckoError(
          `API request failed with status ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof BenchGeckoError) throw error;
      if (error.name === 'AbortError') {
        throw new BenchGeckoError(`Request timed out after ${this.timeout}ms`);
      }
      throw new BenchGeckoError(`Request failed: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * List all AI models tracked by BenchGecko.
   *
   * @returns {Promise<Array<Object>>} Array of model objects with metadata,
   *   benchmark scores, and pricing information.
   *
   * @example
   * const models = await client.models();
   * console.log(`Tracking ${models.length} models`);
   */
  async models() {
    return this._request('/api/v1/models');
  }

  /**
   * List all benchmarks tracked by BenchGecko.
   *
   * @returns {Promise<Array<Object>>} Array of benchmark objects with name,
   *   category, and description.
   *
   * @example
   * const benchmarks = await client.benchmarks();
   * benchmarks.forEach(b => console.log(b.name));
   */
  async benchmarks() {
    return this._request('/api/v1/benchmarks');
  }

  /**
   * Compare two or more AI models side by side.
   *
   * @param {string[]} models - Array of model slugs to compare.
   * @returns {Promise<Object>} Comparison result with per-model scores and pricing.
   * @throws {Error} If fewer than 2 models are provided.
   *
   * @example
   * const result = await client.compare(['gpt-4o', 'claude-opus-4']);
   * result.models.forEach(m => console.log(m.name, m.scores));
   */
  async compare(models) {
    if (!Array.isArray(models) || models.length < 2) {
      throw new Error('At least 2 models are required for comparison.');
    }
    return this._request('/api/v1/compare', {
      models: models.join(','),
    });
  }
}

module.exports = { BenchGecko, BenchGeckoError };
