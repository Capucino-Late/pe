export default {
  async fetch(request, env) {
    return await (await import('./_handler.mjs')).default(request, env, 'balance');
  }
}
