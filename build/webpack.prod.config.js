const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dirname = __dirname.replace('build', '')
module.exports = {
    entry: dirname + '/src/index.js',
    output: {
        filename:'markdown.js',
        // path: path.resolve('f://pro_website_gitee/Public/article/markdown'),
        clean: true,
        environment: {
            arrowFunction: false,
        },
    },
    resolve:{
        alias: {
            '@':'./src'
        },
    },
    module:{
        rules:[
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
        ],
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'markdown.css',
            chunkFilename:'markdown.css'
        })
    ]
};