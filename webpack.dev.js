const path = require('path')
//
const webpack = require('webpack')

module.exports = {
	mode: 'development',
	entry: './dev/app.jsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'docs'),
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-react'],
					plugins: [
						'@babel/plugin-proposal-class-properties',
						['import', {
							libraryName: 'antd',
							style: 'css'
						}]
					]
				}
			}],
			exclude: /node_modules/,
		}, {
			test: /\.less$/,
			use: [{
				loader: "style-loader" // creates style nodes from JS strings
			}, {
				loader: "css-loader"   // translates CSS into CommonJS
			}, {
				loader: "less-loader"  // compiles Less to CSS
			}]
		}, {
			test: /\.css$/,
			include: /node_modules/,
			use: ['style-loader', 'css-loader']
		}, {
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
		}, {
			test: /\.(png|svg|jpg|gif)$/,
			use: ['file-loader']
		}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
}