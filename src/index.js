import path from 'path'
import fs from 'fs'

class TempPath {
  constructor (plugin, str) {
    this.plugin = plugin
    this.str = str
  }

  free () {
    this.plugin.free(this.str)
  }
}

export default class TempPlugin {
  tempPaths = {}

  constructor (henta) {
    this.henta = henta
  }

  init (henta) {
    if (!fs.existsSync(`${henta.botdir}/temp/`)) {
      fs.mkdirSync(`${henta.botdir}/temp/`)
    }

    fs.readdir(`${henta.botdir}/temp/`, (err, paths) =>
      paths.map(file => fs.unlinkSync(`${henta.botdir}/temp/${file}`))
    )
  }

  get (format) {
    for(let i = 0; true; i++) {
      const filePath = path.resolve(`${this.henta.botdir}/temp/${i}.${format}`)
      if(this.tempPaths[filePath]) {
        continue
      }

      this.tempPaths[filePath] = true
      return new TempPath(this, filePath)
    }
  }

  free (filePath) {
    delete this.tempPaths[filePath]
  }
}
