module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '68',
          firefox: '62',
          edge: '16',
          safari: '11',
          ie: '11'
        },
        useBuiltIns: 'entry',
        modules: false
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
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
