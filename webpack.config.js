const path = require('path');

module.exports = {
        // Here the application starts executing and webpack starts bundling
    entry: './src/main/js/buck_converter_react.js',
        // enhance debugging by adding meta info for the browser devtools
    devtool: 'sourcemaps',
    cache: true,
        // Chosen mode tells webpack to use its built-in optimizations accordingly.
        // 'development: enabled useful tools for development
    mode: 'development',
         // options related to how webpack emits results
    output: {
        path: __dirname,
             // the filename template for entry chunks
        filename: './src/main/resources/static/built/webpack_bundle.js'
    },
        // configuration regarding modules
    module: {
            // rules for modules (configure loaders, parser options, etc.)
        rules: [
            {
                test: path.join(__dirname, '.'),
               // exclude: /(node_modules)/,
                    // use: apply multiple loaders and options
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }
        ]
    }
};

//QUESTIONS: dirname path.resolve???