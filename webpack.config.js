const autoprefixer = require('autoprefixer');

module.exports = {
    // entry: ['.packages/ui/scss/site.scss', './app.js'],
    entry: ['./packages/ui/scss/ui.scss'],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './packages/ui/assets/css/site.css',
                            path: __dirname,
                        },
                    },
                    { loader: 'extract-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer Dart Sass
                            implementation: require('sass'),

                            sassOptions: {
                                includePaths: ['./node_modules'],
                            },

                            // See https://github.com/webpack-contrib/sass-loader/issues/804
                            webpackImporter: false,
                        },
                    },
                ],
            },
            {
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                },
                test: /\.js$/,
            },
        ],
    },
    output: {
        filename: './packages/ui/assets/js/ui.js',
        path: __dirname,
    },
};
