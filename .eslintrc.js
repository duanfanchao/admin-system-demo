module.exports = {
    root: true,
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'prettier', // 或者 'prettier/vue' 以禁用 Vue 相关规则
    'plugin:prettier/recommended', // 启用 eslint-plugin-prettier 插件并使用 Prettier 配置
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // 你可以根据实际需要设置 ECMAScript 版本
    sourceType: 'module',
  },
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off', // 关闭组件名多词规则
    'vue/no-unused-reactive-declarations': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
  },
};