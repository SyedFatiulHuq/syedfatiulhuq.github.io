import { defineConfig } from 'astro/config';
import { resolve } from 'node:path';

// The text files in content/ are read with fs, so Vite doesn't know about them.
// Watch them and reload the browser when one changes.
const reloadOnContentChange = {
  name: 'reload-on-content-change',
  configureServer(server) {
    const dir = resolve('content');
    server.watcher.add(dir);
    server.watcher.on('change', (file) => {
      if (file.startsWith(dir)) server.ws.send({ type: 'full-reload' });
    });
  },
};

export default defineConfig({
  site: 'https://syedfatiulhuq.github.io',
  vite: { plugins: [reloadOnContentChange] },
});
