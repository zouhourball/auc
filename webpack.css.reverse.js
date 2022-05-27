const Hook = require('tapable/lib/Hook')
class ReverseIt extends Hook {
  compile () {
    return (pluginArgs) => {
      const assets = Object.assign({}, pluginArgs.assets, {
        css: [...(pluginArgs.assets.css || [])].reverse(),
      })

      return Object.assign({}, pluginArgs, { assets })
    }
  }
}
class CssReversePlugin {
  apply (
    /** @type {import('webpack').Compiler} */
    compiler,
  ) {
    compiler.hooks.compilation.tap('HtmlWebpackPluginHooks', (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing = new ReverseIt()
    })
  }
}
module.exports = CssReversePlugin
