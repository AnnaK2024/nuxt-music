// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt([
  {
    rules: {
      'vue/html-self-closing': 'off'  // Или 'never', если хотите запретить слэш
    }
  },
  prettier
])
