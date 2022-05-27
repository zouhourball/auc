module.exports = function (api) {
  api.cache(true)

  const isProd = process.env.NODE_ENV === 'production'

  const presets = [
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ]
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'react-hot-loader/babel',
    // 'module:react-hot-loader/babel',
    [
      '@babel/plugin-transform-runtime',
      {
        // corejs: 3,
        regenerator: false,
        useESModules: true,
      },
    ],
  ]

  if (isProd) {
    presets.push([
      '@babel/preset-env',
      {
        targets: 'last 2 versions, ie >= 11, safari >= 7',
        modules: false,
        loose: true,
        corejs: 3,
        useBuiltIns: 'usage',
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
      },
    ])
    plugins.push(
      [
        'module:fast-async',
        {
          compiler: {
            promises: true,
            generators: false,
          },
          runtimePattern: null,
          useRuntimeModule: false,
        },
      ],
      'transform-react-remove-prop-types',
      'lodash',
    )
  } else {
    presets.push([
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
        },
        useBuiltIns: 'entry',
        corejs: '3.0.0',
      },
    ])
    plugins.push('@babel/plugin-syntax-object-rest-spread')
  }

  return {
    sourceType: 'unambiguous',
    presets,
    plugins,
  }
}
