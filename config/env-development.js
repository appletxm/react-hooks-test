module.exports = {
  port: 8019, // 本地服务端口号
  api: '', // 应用侧服务端接口前缀
  proxy: {
    needOpen: true, // 需不需要开启本地代理
    url: 'http://111.230.28.173:8081' // 代理应用侧服务端接口host, needOpen配置项为true时生效
  },
  get publicPath() {
    return 'dist/'
  },
  distPath: './dist',
  sourcePath: './src',
  outputCfg: { // 应用侧可配置项，可自行扩展，打包后里边所有配置项将作为window.appInfo下面的内容输出，可方便应用读取使用
    apiHost: 'http://111.230.28.173:8081', // 应用侧服务端接口host
    // apiHost: 'http://127.0.0.1:8081', // 本地服务端接口host
    withCredentials: false,
    uploadImagePrefix: '/attachments/ad'
  }
}
