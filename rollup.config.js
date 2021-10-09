import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json';

export default [
	{
		preserveModules: true,
		input: [
			'src/index.browser.ts',
			'src/index.node.ts',
		],
		output: [
			{
				dir: 'dist',
				format: 'es',
				entryFileNames: '[name].mjs',
				sourcemap: true,
			},
			{
				dir: 'dist',
				format: 'cjs',
				entryFileNames: '[name].cjs',
				sourcemap: true,
			},
		],
		plugins: [
			// Build Typescript files to Javascript so they can be processed
			typescript({
				tsconfig: './tsconfig.json',
				rootDir: 'src',
			}),
		],
		external: [
			// Dependencies from npm
			...Object.keys(packageJson.dependencies),
			// Built-in Node packages that are only referenced when running in a
			// Node.js environment and don't need to be polyfilled for browsers
			'console',
			'stream',
			'_polyfill-node_process',
		],
	},
];
