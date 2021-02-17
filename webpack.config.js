const path = require('path');

module.exports = {
    entry: ['./packages/app/js/app.ts'],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.woff2$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        include: path.resolve(__dirname, './packages/app/font/'),
                        name: '[name].[ext]',
                        outputPath: './font/'
                    },
                },
            },
        ],
    },
    output: {
        filename: './js/app.js',
        path: path.resolve(__dirname, 'packages/app/public/assets/app'),
    },
};

