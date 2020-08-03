import extract from 'extract-zip'

export default class Unzip {
  constructor(target) {
    this.target = target
  }

  unzip(file1, file2) {
    return this._extract(file1).then(() => this._extract(file2))
  }

  _extract(file) {
    return new Promise((resolve, reject) => {
      extract(this.target + file, { dir: this.target }, err => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }
}
