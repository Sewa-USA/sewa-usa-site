import { defineConfig } from 'astro/config';

// Static output: fastest on weak connections, free to host.
export default defineConfig({
  site: 'https://sewa-usa.example',
  output: 'static',
  trailingSlash: 'never',
});
