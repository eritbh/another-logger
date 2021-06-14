import typescript from '@rollup/plugin-typescript';

export default [
	{
		preserveModules: true,
		input: 'src/index.ts',
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
