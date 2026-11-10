/**
 * The Flowscape — Cloudflare Edge Worker
 * Serves static multi-sanctuary assets directly from the Cloudflare global edge cache.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
