/**
 * @file eslint 配置文件
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    // 最大长度
    'max-len': ['error', { code: 150 }],
    // ts 中不允许存在影子变量，下面关闭了 no-shadow，这里启用了 ts 的 no-shadow
    '@typescript-eslint/no-shadow': ['error'],
    // 允许不使用文件扩展名
    // 'import/extensions': ['error', { js: 'never', ts: 'never' }],
    // 关闭 ts 不建议添加非必要注释
    '@typescript-eslint/ban-ts-comment': 'off',
    // 只导出一个模块时，使用 default。
    // 备注：不开启此模块的原因在于，有时候不用 default 导出是为了方便以后方便扩展
    'import/prefer-default-export': 'off',
    // 关闭箭头函数必须指明一个返回值
    'consistent-return': 'off',
    // 关闭限制 typeof 检测的对象类型
    'valid-typeof': 'off',
    // 关闭影子变量，对ts 的 enum 有影响。上面开启了 ts 的 no-shadow
    'no-shadow': 'off',
    semi: 'off',
    'prettier/prettier': 'error',
  },
  settings: {
    // 修复 eslint 报 ts 模块无法解析的问题
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['out', 'dist', '**/*.d.ts'],
}
