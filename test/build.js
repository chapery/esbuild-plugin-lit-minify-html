import * as esbuild from 'esbuild'
import minifyHtml from '../main.js'
import { rm } from 'fs/promises'

await rm('./dist', { recursive: true, force: true })

await esbuild.build({
  entryPoints: ['src/a.js', 'src/aa.ts'],
  bundle: true,
  minify: false,
  outdir: 'dist',
  format: 'esm',
  target: ['esnext'],
  packages: 'external',
  plugins: [
    minifyHtml()
  ],
})