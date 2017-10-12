const webpack = require('webpack'),
  path = require('path'),
  fs = require('fs')

const SRC = path.resolve(__dirname, "src"),
  NODE_MODULES = path.resolve(__dirname, "node_modules")

/* babel */
const babelSettings = JSON.parse(fs.readFileSync(".babelrc"))

const config = {
  entry: [
    './src/index.jsx'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true
      }
    })
  );
  babelSettings.plugins.push("transform-react-inline-elements");
  babelSettings.plugins.push("transform-react-constant-elements");
} else {
  config.devtool = "#cheap-module-source-map"
  config.devServer = {
    contentBase: './public',
    hot: true,
    inline: true,
    host: "0.0.0.0",
    port: 2708
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;
