const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.js',
      builderOptions: {
        mac: {
          icon: './icon.icns'
        }
      }
    }
  }
})
