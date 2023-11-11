// Notas importanes
// El archivo de configuración debe usar ES5
// Importar un administrador de rutas de archivos
const path = require("path");
//Importing Mini CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Exportamos un objeto de configuración
// que sera usado por webpack
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
  // 3. Configuring the development server
  // The development server serves the packaged files
  // to avoid having to repack on each code change.
  devServer: {
    // 3.1 Static files folder
    static: path.join(__dirname, "public"),
    // 3.2 Development server port
    port: 8080,
    // 3.3 Defining the host
    host: "0.0.0.0"
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
                    'targets': {"chrome": "80"},
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