module.exports = {
  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova',
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    electronBuilder: {
      nodeModulesPath: [
        '../../node_modules',
        './node_modules'
      ],
      builderOptions: {
        productName: 'SmartHoldem',
        appId: 'io.smartholdem.2fa',
        compression: 'store',
        artifactName: '${name}-${os}-${arch}-${version}.${ext}',
        directories: {
          output: 'build/target'
        },
        win: {
          target: 'nsis',
          icon: 'build/icons/icon.ico'
        },
        nsis: {
          perMachine: true,
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        mac: {
          category: 'public.app-category.tools',
          icon: 'build/icons/icon.icns'
        },
        dmg: {
          background: 'build/background.tif',
          icon: 'build/icons/icon.icns',
          contents: [
            {
              x: 130,
              y: 220
            },
            {
              x: 410,
              y: 220,
              type: 'link',
              path: '/Applications'
            }
          ]
        },
        linux: {
          "category": "Tools",
          "target": [
            "deb",
            "AppImage",
            "snap"
          ],
          "synopsis": "SmartHoldem 2FA APP",
          icon: 'build/icons/icon.icns'
        },
      }
    },
  },

  css: {
    sourceMap: true
  }
}
