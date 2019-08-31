const common = require('./webpack.common')

module.exports = Object.assign(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './static',
        port: 3000
    }
})
