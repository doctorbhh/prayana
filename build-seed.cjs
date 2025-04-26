const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/seedDatabase.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs', // Output CommonJS instead of ESM
  outfile: 'dist/seedDatabase.cjs', // Use .cjs extension to indicate CommonJS
  tsconfig: 'tsconfig.script.json',
  alias: {
    '@': './src',
  },
}).then(() => {
  console.log('Build successful! Running the script...');
  require('./dist/seedDatabase.cjs');
  console.log('Seeding process completed.');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});