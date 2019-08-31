const path = require('path')

module.exports = {
    entry: './dev/index.js',
    output: {
        path: path.join(__dirname, '/docs'),
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
                include: /node_modules/,
                use: ['style-loader', "css-loader"]
            },
            {
                test: /\.css$/,
                include: /dev/,
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
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
}