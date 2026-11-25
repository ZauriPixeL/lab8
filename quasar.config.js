import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'

export default defineConfig((/* ctx */) => {
  return {
    boot: [
      'pinia',
      'axios',
      'auth'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      distDir: 'dist',
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },

      vueRouterMode: 'hash',

      extendViteConf (viteConf) {
        viteConf.envPrefix = ['QCLI_', 'VITE_']
        viteConf.resolve = viteConf.resolve || {}
        viteConf.resolve.alias = {
          ...(viteConf.resolve.alias || {}),
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      }
    },

    devServer: {
      open: true
    },

    framework: {
      config: {
        notify: {
          position: 'bottom'
        }
      },

      plugins: [
        'Meta', 'Notify',
        'Dialog',
        'Loading'
      ]
    },

    animations: []
  }
})
