'use strict';
var webpack = require('webpack');
var path = require('path');

var _ = require('lodash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// var ManifestPlugin = require('webpack-manifest-plugin');
console.log('building');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'client/js');
var APP_ENTRY = path.join(__dirname, 'client/js', 'app.js');

var sourceAliases = require('./dll/aliases.json');

var nodeAliases = {
	// 'modernizr$': path.resolve(__dirname,'.modernizrrc')
};

var aliases = _.merge(sourceAliases, nodeAliases);

var config = {
	target: 'web',
	devtool: 'eval-source-map',
	cache: true,
	entry: {
		app: APP_ENTRY
	},
	output: {
		path: BUILD_DIR,
		// publicPath: '/js/',
		filename: 'js/[name].bundle.js',
		chunkFilename: 'js/[name].chunk.js'
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 3 }),
		// new webpack.DllReferencePlugin({
  //           context: path.join(__dirname, 'client/js'),
  //           manifest: require('./dll/libs-manifest.json')
  //       }),
		new webpack.ProvidePlugin({
            '_': 'lodash',
			// Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
			// fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
		//new webpack.optimize.CommonsChunkPlugin({
		//	names: ['vendor', 'manifest']
		//}),
		new webpack.DefinePlugin({
			'process.env': {
                NODE_ENV: JSON.stringify('development')
            },
			PRODUCTION: JSON.stringify(false)
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'client/index.ejs'
		}),
		new CopyWebpackPlugin([
	        {
	          from: './client/css',
	          to: './css',
	        }
	      ]),
		// new AddAssetHtmlPlugin({
		// 	filepath: require.resolve('./dll/jam.dll.libs.js')
		// }),
		// new ManifestPlugin({
  //         fileName: 'dist.json'
  //       })
	],
	module: {
		rules: [
			{
		        exclude: [
		          /\.html$/,
		          /\.(js|jsx)$/,
		          /\.(ts|tsx)$/,
		          /\.css$/,
		          /\.json$/,
		          /\.bmp$/,
		          /\.gif$/,
		          /\.jpe?g$/,
		          /\.png$/,
		          /\.ejs$/,
		        ],
		        loader: 'file-loader',
		        options: {
		          name: 'static/media/[name].[hash:8].[ext]',
		        },
		    },
			// {
			// 	test: /\.modernizrrc.js$/,
			// 	loader: 'modernizr-loader'
			// },
			// {
			// 	test: /\.modernizrrc(\.json)?$/,
			// 	loaders: ['modernizr-loader', 'json-loader']
			// },
			{
				test: /\.html$/,
				loader: 'file?name=[name].[ext]'
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			// {
			// 	test : /\.jsx?$/,
			// 	include : APP_DIR,
			// 	loaders : 'babel-loader',
			// 	query: {
			// 		cacheDirectory: true
			// 	}
			// }
		]
	},
	resolve: {
        extensions: ['.js', '.json', '.jsx', '.css'],
        modules: [
        	'node_modules',
        	path.resolve(__dirname)
        ],
        alias: aliases
    },
	profile: true,
	stats: {
        colors: true,
        modules: false,
        reasons: true,
        hash: false,
        version: true,
        timings: false,
        assets: true,
        chunks: true,
        children: true,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: true
    }
};

module.exports = config;