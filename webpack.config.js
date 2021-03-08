const VueLoaderPlugin  = require('vue-loader/lib/plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const TerserPlugin = require('terser-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development';


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.js',
    // path: path.resolve(__dirname, '../public_html/dist'),
    path: path.resolve(__dirname, './firebase/public'),
  },
  mode: env,
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: "babel-loader"
              }
          },
          {
              test: /\.vue$/, // ファイルが.vueで終われば...
              loader: 'vue-loader',
          },
          {
            test: /\.(sc|c|sa)ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              // 'vue-style-loader',
              'css-loader',
              'sass-loader',
            ]
          },
          {
            // test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?.+)?$/,
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/, 
            // test: /\.(eot|otf|ttf|woff2?|svg)(\?.+)?$/,
            // include: /node_modules/,
            include: [
              path.resolve('src'),
              path.resolve('node_modules/element-ui/'),
            ],
            use: [
              {
                loader: 'url-loader',
                // loader: 'file-loader',
                options: {
                  limit: 100000,
                  outputPath: 'fonts/',
                  publicPath : function(path){
                     return '/assets/fonts/' + path;
                  },
                  name: '[name].[ext]',
                },
              },
            ],
          },
      ]
  },
  resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
  },
  optimization: {
    // minimizer: [new OptimizeCSSAssetsPlugin({})],
    // minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  devServer: {
    // contentBase: '../public_html/dist',
    // host: '0.0.0.0',
    contentBase: './firebase/public',
    // port: 4005,
    // headers: {
    //     'X-Frame-Options': "allow-from *"
    // },
    proxy: {
      '/api': {
          target: "http://localhost:4242",
          // target: "https://script.google.com/macros/s/AKfycbzZ033TdCyxhAQJ7nss3K9skvrhKvb8KTmw2kqJK5OwbdQmyaIX/exec",
          changeOrigin: true,
          'pathRewrite': {'^/api/': ''}
      },
      '/stripe': {
          target: "https://dashboard.stripe.com",
          // target: "https://script.google.com/macros/s/AKfycbzZ033TdCyxhAQJ7nss3K9skvrhKvb8KTmw2kqJK5OwbdQmyaIX/exec",
          changeOrigin: true,
          'pathRewrite': {'^/stripe/': ''}
      },
      // '/google': {
      //     target: "https://script.google.com/macros/s/AKfycbzZ033TdCyxhAQJ7nss3K9skvrhKvb8KTmw2kqJK5OwbdQmyaIX/exec",
      //     // target: 'https://script.googleapis.com',
      //     changeOrigin: true,
      //     'pathRewrite': {'^/google/': ''}
      // },
      '/schedule': {
          target: "https://www.supersaas.com",
          changeOrigin: true,
          'pathRewrite': {'^/schedule/': ''}
      },
      // '/schedule': {
      //     target: "http://localhost:5000",
      //     changeOrigin: true,
      //     'pathRewrite': {'^/schedule/': ''}
      // },
      // '/cloud': {
      //     target: "https://us-central1-vue-authentification-b7a7a.cloudfunctions.net/api",
      //     changeOrigin: true,
      //     'pathRewrite': {'^/cloud/': ''}
      // },
      // '/schedule': {
      //     target: "https://schedule.kdev.page",
      //     changeOrigin: true,
      //     'pathRewrite': {'^/schedule/': ''}
      // },
      '/supersass': {
          target: "https://asia-northeast2-quickstart-1604473380297.cloudfunctions.net",
          changeOrigin: true,
          'pathRewrite': {'^/supersass/': ''}
      },
      '/gcf': {
          target: "https://us-central1-vue-authentification-b7a7a.cloudfunctions.net",
          // target: "https://gcf.kdev.page",
          changeOrigin: true,
          'pathRewrite': {'^/gcf': ''}
      },
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
        // filename: '../public_html/dist/css/[name].css',
        // chunkFilename: "[id].css"
        filename: "css/[name].css"
    }),
    // new CleanWebpackPlugin({ verbose: true }),
  ]
}
