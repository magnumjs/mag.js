module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: "> 0.25%, not dead",
        modules: false
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import'
  ],
  env: {
    test: {
      plugins: ['dynamic-import-node'],
      presets: ['@babel/preset-env']
    }
  }
};
