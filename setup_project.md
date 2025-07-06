Setting up a web project with Webpack, ESLint, Babel, Jest, and an HTTPS server involves several steps. Below, I’ll outline the console commands you need to run and provide the necessary configuration files for each tool.

### Step 1: Initialize Your Project

First, create a new directory for your project and initialize it with npm:

```bash
mkdir my-web-project
cd my-web-project
npm init -y
```

### Step 2: Install Dependencies

Run the following commands to install the required packages:

```bash
# Install Webpack and Webpack CLI
npm install --save-dev webpack webpack-cli

# Install Babel
npm install --save-dev @babel/core @babel/preset-env babel-loader

# Install ESLint
npm install --save-dev eslint eslint-loader

# Install Jest
npm install --save-dev jest babel-jest

# Install HTTPS server
npm install --save-dev http-server
```

You can install everything with just one command: 
```bash
# Install all packages
npm install --save-dev webpack webpack-cli @babel/core @babel/preset-env babel-loader eslint eslint-loader jest babel-jest http-server
```

### Step 3: Configure Webpack

Create a file named `webpack.config.js` in the root of your project:

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Your entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devtool: 'source-map', // For easier debugging
  devServer: {
    static: './dist',
    https: true, // Enable HTTPS
  },
};
```

### Step 4: Configure Babel

Create a file named `.babelrc` in the root of your project:

```json
{
  "presets": ["@babel/preset-env"]
}
```

### Step 5: Configure ESLint

Create a file named `.eslintrc.json` in the root of your project:

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    // Add your custom rules here
  }
}
```

### Step 6: Configure Jest

Create a file named `jest.config.js` in the root of your project:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
```

### Step 7: Set Up Scripts in `package.json`

Modify the `scripts` section of your `package.json` to include commands for building, testing, and starting the server:

```json
"scripts": {
  "build": "webpack",
  "start": "http-server ./dist -S -C cert.pem -K key.pem", // Replace with your SSL cert and key
  "lint": "eslint .",
  "test": "jest"
}
```

### Step 8: Create Your Project Structure

You should create the following folder structure:

```
my-web-project/
│
├── dist/               # Output directory for Webpack
├── src/                # Source files
│   └── index.js        # Your main JavaScript file
├── .babelrc            # Babel configuration
├── .eslintrc.json      # ESLint configuration
├── jest.config.js      # Jest configuration
├── package.json        # npm configuration
└── webpack.config.js   # Webpack configuration
```

### Step 9: Create a Sample `index.js`

Create a simple JavaScript file in `src/index.js`:

```javascript
// src/index.js
console.log('Hello, Webpack!');
```

### Step 10: Run Commands

Now you can run the following commands:

1. **Lint your code**: 
   ```bash
   npm run lint
   ```

2. **Build your project**:
   ```bash
   npm run build
   ```

3. **Run tests**:
   ```bash
   npm run test
   ```

4. **Start the HTTPS server**:
   ```bash
   npm start
   ```

### Note on HTTPS

For the HTTPS server to work, you need to have SSL certificate files (`cert.pem` and `key.pem`). You can generate self-signed certificates for local development using tools like OpenSSL.

### Conclusion

This setup will give you a basic web project structure with Webpack for bundling, ESLint for linting, Babel for transpiling, Jest for testing, and an HTTPS server for serving your files. You can expand on this setup as needed for your specific project requirements!