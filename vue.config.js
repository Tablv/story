const common = {
    templatePath: "src/view/template.html",
    serverSidePath: "/admin/story/editor"
  },
  publicPath =
    process.env.NODE_ENV === "production" ? common.serverSidePath : "./",
  staticPath =
    process.env.NODE_ENV === "production" ? common.serverSidePath : "/";

module.exports = {
  publicPath,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== "production",
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "@/assets/common.scss";
        $basePath: "${staticPath}";
        `
      }
    }
  },
  pages: {
    editor: {
      entry: "src/view/storyboard/storyboard.ts",
      template: common.templatePath,
      title: "故事板"
    }
    // preview: {
    //   entry: "src/view/preview/preview.ts",
    //   template: common.templatePath,
    //   title: "预览图表"
    // },
    // share: {
    //   entry: "src/view/share/share.ts",
    //   template: common.templatePath,
    //   title: "图表分享"
    // },
    // validate: {
    //   entry: "src/view/share/validate.ts",
    //   template: common.templatePath,
    //   title: "图表分享验证"
    // }
  },
  devServer: {
    port: 3100,
    proxy: {
      "/admin": {
        target: "http://192.168.111.63:8080/admin",
        changeOrigin: true,
        pathRewrite: {
          "^/admin": ""
        }
      }
    }
  }
};
