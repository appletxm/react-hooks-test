const fs = require('fs')
const path = require('path')
const { checkDirIsOk, copyFolder } = require('./sync-copy-files.js')

function copyAssetsFile() {
  checkDirIsOk('./dist/assets')
  copyFolder('./src/assets', './dist/assets')
}

copyAssetsFile()
