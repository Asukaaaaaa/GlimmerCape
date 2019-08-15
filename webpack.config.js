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
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[name]_[hash:base64:4]'
                            }
                        }
                    }
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