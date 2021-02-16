const autoprefixer = require('autoprefixer');

module.exports = {
    // entry: ['.packages/ui/scss/site.scss', './app.js'],
    entry: ['./packages/app/scss/app.scss'],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './packages/app/public/assets/app/css/app.css',
                            path: __dirname,
                        },
                    },
                    { loader: 'extract-loader' },
                    { loader: 'css-loader' },
                    /* TODO: fix
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                        },
                    },*/
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                includePaths: ['./node_modules'],
                            },

                            // see https://github.com/webpack-contrib/sass-loader/issues/804
                            webpackImporter: false,
                        },
                    },
                ],
            },
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
                test: /\.js$/,
            },
        ],
    },
    output: {
        filename: './packages/app/public/assets/app/js/app.js',
        path: __dirname,
    },
};
