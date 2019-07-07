const path = require('path')

module.exports = {
    entry: './dev/index.js',
    output: {
        path: path.join(__dirname, '/static'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[path]'
                            }
                        }
                    },
                    'stylus-loader'
                ]
            }
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './static',
        port: 3000
    }

}