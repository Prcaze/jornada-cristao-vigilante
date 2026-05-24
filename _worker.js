export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Se for raiz, serve index.html
    if (pathname === '/') {
      pathname = '/index.html';
    }

    // Tenta servir o arquivo do namespace estático
    try {
      const response = await env.__STATIC_CONTENT.get(pathname);

      if (response === null) {
        // Se não encontrar, tenta servir index.html (fallback)
        const indexResponse = await env.__STATIC_CONTENT.get('/index.html');
        if (indexResponse !== null) {
          return new Response(indexResponse, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'max-age=3600',
            },
          });
        }
        return new Response('Not Found', { status: 404 });
      }

      // Determina o Content-Type baseado na extensão
      let contentType = 'text/plain';
      if (pathname.endsWith('.html')) contentType = 'text/html; charset=utf-8';
      if (pathname.endsWith('.png')) contentType = 'image/png';
      if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) contentType = 'image/jpeg';
      if (pathname.endsWith('.gif')) contentType = 'image/gif';
      if (pathname.endsWith('.svg')) contentType = 'image/svg+xml';
      if (pathname.endsWith('.css')) contentType = 'text/css';
      if (pathname.endsWith('.js')) contentType = 'application/javascript';
      if (pathname.endsWith('.json')) contentType = 'application/json';

      return new Response(response, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'max-age=3600',
        },
      });
    } catch (e) {
      console.error('Error:', e);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
