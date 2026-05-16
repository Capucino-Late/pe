export default {
  async fetch(request, env) {
    // Cloudflare Pages Functions compatibility wrapper
    return await (await import('./_handler.mjs')).default(request, env, 'packages');
  }
}
