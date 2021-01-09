module.exports = {
  lintOnSave: true,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false
    }
  },
  // devServer: {
  //   host: '0.0.0.0',
  //   port: 80,
  //   proxy: {
  //     [`/${process.env.VUE_APP_API}`]: {
  //       target: `${process.env.VUE_APP_PROXY}`
  //     }
  //   }
  // },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ]
}
