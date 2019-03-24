import packageJSON from './package.json';

export default [
    {
        input: 'src/main.js',
        output: {
            name: 'index',
            file: packageJSON.browser,
            format: 'umd',
        },
    },
    {
        input: 'src/main.js',
        output: [
            {
                file: packageJSON.main,
                format: 'cjs',
            },
            {
                file: packageJSON.module,
                format: 'es',
            },
        ],
    },
];
