// Important notes
// 🚨 Configuration file must use ES5 not ES6
// that's why you will see "requires" not "imports"

// Importing an file routing manager
const path = require('path');
// Importing plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// We export a configuration object
// that will be used by webpack
module.exports = {
  // 1. The entry file from which
  // it will contain all the definitions to package
  entry: "./client/index.js",
  // 2. Specify the output file
  // Here it is detailed where the file will be
  // final packaged.
  output: {
    // 2.1 Absolute output path
    // Note that it is being placed in the directory
    // of the project's static files
    path: path.resolve(__dirname, "public"),
    // 2.2 Output file name
    filename: "bundle.js"
  },
  // Adding a module to webpack
  module: {
    rules: [
      {
				// This section stablishes 
				// what rules to apply to ".js" files
        test: /\.js$/,
				// We Dont want to transpile any kind of modules
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    'modules': false,
                    'useBuiltIns': 'usage',
                    'targets': '> 0.25%, not dead',
                    'corejs': 3
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({
    // Archivo css de salida
    filename: 'styles/app.css'
  })]
}
    
    /*
    //3. servidor de desarollo
    devServer: {
        //3.1 Folder de estaticos
        static: path.join(__dirname,'public'),
        //3.2 puerto de servidor de desarollo
        port: 8080,
        //3.3 definiendo el host
        host: '0.0.0.0'
    }
}
*/