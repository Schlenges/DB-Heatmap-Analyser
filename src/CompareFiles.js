import fs from 'fs'
import path from 'path'
import { diff } from 'deep-diff'

export default class CompareFiles {
  constructor(target, folder1, folder2, fileName) {
    this.resultLog = {}
    this.target = target
    this.file1 = path.parse(folder1).name + '/' + fileName
    this.file2 = path.parse(folder2).name + '/' + fileName
  }

  compare() {
    const data1 = this._readFile(this.file1)
    const data2 = this._readFile(this.file2)

    const differences = diff(data1, data2)

    this._getResult(differences)
    this._logDetails(differences)
    this._logExtraInfo(data1, data2)

    this._printResult()
  }

  _readFile(file) {
    const data = fs.readFileSync(this.target + file)
    return JSON.parse(data)
  }

  _getResult(differences) {
    if (differences === undefined) {
      this.resultLog.result = 'There are no differences between the files'
      return this._printResult()
    }

    for (const diffEdit of differences) {
      if (diffEdit.path.includes('failed')) {
        if (diffEdit.lhs < diffEdit.rhs) {
          this.resultLog.result = `"${this.file2}" is worse than "${this.file1}"`
          break
        }
        this.resultLog.result = `"${this.file2}" is better than "${this.file1}"`
      }
    }
  }

  _logDetails(differences) {
    this.resultLog.detailsLog = {}
    const worse = []
    const better = []

    for (const diffEdit of differences) {
      if (diffEdit.path.includes('failed')) {
        const details = {
          path: diffEdit.path.slice(0, -1).join('.'),
          failedOld: diffEdit.lhs,
          failedNew: diffEdit.rhs,
        }

        if (diffEdit.lhs < diffEdit.rhs) {
          worse.push(details)
        } else {
          better.push(details)
        }
      }
    }

    this.resultLog.detailsLog.worse = worse
    this.resultLog.detailsLog.better = better
  }

  _logExtraInfo(data1, data2) {
    this.resultLog.extraInfo = {}

    // get totalErrors
    this.resultLog.extraInfo.totalErrors = {}
    this.resultLog.extraInfo.totalErrors.old = this._getTotalErrors(data1)
    this.resultLog.extraInfo.totalErrors.new = this._getTotalErrors(data2)

    // get paths that still contain fails
    this.resultLog.extraInfo.allFailingPaths = this._getFailing(data2)
  }

  _getFailing(data) {
    const result = []
    const failPath = []

    function search(object) {
      for (const key in object) {
        failPath.push(key)

        if (key === 'failed' && object[key] > 0) {
          result.push({
            path: failPath.slice().join('.'),
            fails: object[key],
          })
        }

        if (typeof object[key] === 'object') {
          search(object[key])
        }

        failPath.pop()
      }
    }

    search(data)
    return result
  }

  _getTotalErrors(data) {
    let totalErrors = 0

    function search(object) {
      for (const key in object) {
        if (key === 'errorCount') {
          totalErrors += object[key]
        }

        if (typeof object[key] === 'object') {
          search(object[key])
        }
      }
    }

    search(data)
    return totalErrors
  }

  _printResult() {
    // adapt to print the log in a desired form/layout
    console.log(this.resultLog)
  }
}
