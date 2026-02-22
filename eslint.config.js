import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      parser: vueParser,
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off'
    }
  }
]