const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    publicPath: "/",
  },
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true,
    setupMiddlewares: (middlewares, devServer) => {
      // CORS proxy for stellar.toml requests that external servers don't serve
      // with Access-Control-Allow-Origin headers (e.g. circle.com)
      devServer.app.get("/cors-proxy", async (req, res) => {
        const targetUrl = req.query.url;
        if (!targetUrl) {
          return res.status(400).send("Missing url parameter");
        }
        try {
          const response = await fetch(targetUrl);
          const text = await response.text();
          res.set("Content-Type", response.headers.get("content-type") || "text/plain");
          res.send(text);
        } catch (err) {
          res.status(502).send(`Proxy error: ${err.message}`);
        }
      });
      return middlewares;
    },
  },
});
