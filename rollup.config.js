import typescript from '@rollup/plugin-typescript';
import {builtinModules} from 'module';
import packageJson from './package.json';

export default [
	{
		preserveModules: true,
		input: 'src/index.ts',
		external: [
			// Modules provided by Node
			...builtinModules,
			// Dependencies from npm
			...Object.keys(packageJson.dependencies),
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
			typescript({
				tsconfig: './tsconfig.json',
				rootDir: 'src',
			}),
		],
	},
];
