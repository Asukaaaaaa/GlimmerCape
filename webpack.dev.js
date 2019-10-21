const path = require('path')
const common = require('./webpack.common')

module.exports = Object.assign(common, {
    entry: {
        main: './dev/index.js',
        // test: './dev/test.js'
    },
    output: {
        path: path.join(__dirname, '/docs'),
        filename: '[name].bundle.js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './static',
        port: 3000
    }
})
