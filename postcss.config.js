export default {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16, // 基础字体大小，主要用于 PC 端固定值计算
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 1,
      exclude: /(\/|\\)(node_modules)(\/|\\)/,
    },
  },
};
