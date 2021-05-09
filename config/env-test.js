module.exports = {
  api: '', // 应用侧服务端接口前缀
  publicPath: '',
  distPath: './dist',
  sourcePath: './src',
  outputCfg: { // 应用侧可配置项，可自行扩展，打包后里边所有配置项将作为window.appInfo下面的内容输出，可方便应用读取使用
    apiHost: 'http://111.230.28.173:8081', // 应用侧服务端接口host
    withCredentials: false,
    uploadImagePrefix: '/attachments/ad'
  }
}
