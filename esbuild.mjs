import { context } from 'esbuild';
import { esbuildPluginTailwindcss } from 'esbuild-plugin-tailwindcss';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(
          `    ${location.file}:${location.line}:${location.column}:`
        );
      });
      console.log('[watch] build finished');
    });
  },
};

async function main() {
  const ctx = await context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    plugins: [esbuildProblemMatcherPlugin],
  });

  const webviewCtx = await context({
    entryPoints: ['src/view/webview/index.tsx'],
    bundle: true,
    format: 'iife',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'browser',
    external: [],
    outfile: 'dist/webview.js',
    logLevel: 'silent',
    plugins: [esbuildPluginTailwindcss, esbuildProblemMatcherPlugin],
  });

  if (watch) {
    await ctx.watch();
    await webviewCtx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();

    await webviewCtx.rebuild();
    await webviewCtx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
