const path = require('path');

const output = process.env.TARGET === 'web' ?
      { filename: 'select-unique.min.js', libraryTarget: 'var', libraryExport: 'default' } :
      { filename: 'select-unique.js', libraryTarget: 'umd' };

const config = {
    mode: process.env.PRODUCTION ? 'production' : 'development',
    entry: './index.js',
    output: Object.assign(output, {
        path: path.resolve(__dirname, 'dist'),
        library: 'SelectUnique',
    }),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    }
};

module.exports = config;
