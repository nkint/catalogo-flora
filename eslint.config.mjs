import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Aggiunge le regole base consigliate da Astro
  ...eslintPluginAstro.configs.recommended,
];
