import DownloadFromStorage from './DownloadFromStorage'
import Unzip from './Unzip'
import CompareFiles from './CompareFiles'
import os from 'os'
import isDocker from 'is-docker'

const args = process.argv.slice(2) // args without node and index.js path
const archive1 = args[0]
const archive2 = args[1]
const fileName = args[2]
const bucket = args[3]
const target = getTargetDir()

validateArgs()

try {
  run()
} catch (err) {
  if (err) {
    console.log(err.message)
    process.exit()
  }
}

function getTargetDir() {
  if (isDocker()) {
    return '/data/'
  }
  return os.homedir() + '/Downloads/'
}

function validateArgs() {
  checkArchiveName(archive1)
  checkArchiveName(archive2)
  checkFileName(fileName)
  checkBucketName()
}

function run() {
  const downloader = new DownloadFromStorage(target)
  const unzipper = new Unzip(target)
  const fileComparer = new CompareFiles(target, archive1, archive2, fileName)

  downloader
    .download(archive1, archive2, bucket)
    .catch(err => {
      if (err.code === 'NotFound') {
        console.log('Archive not found')
      } else {
        console.log(err.message)
      }
      process.exit()
    })
    .then(() => unzipper.unzip(archive1, archive2))
    .catch(err => {
      console.log(err.message)
      process.exit()
    })
    .then(() => fileComparer.compare())
    .catch(err => {
      console.log(err.message)
      process.exit()
    })
}

function checkArchiveName(archive) {
  // check if ArchiveName exists, is of type string, not empty and ends in .zip
  if (
    typeof archive !== 'string' ||
    !archive ||
    archive.length <= 0 ||
    archive.slice(-4) !== '.zip'
  ) {
    console.log(
      'Please enter two valid names of the archives you want to download'
    )
    process.exit()
  }
}

function checkFileName() {
  if (
    typeof fileName !== 'string' ||
    !fileName ||
    fileName.length <= 0 ||
    fileName.slice(-5) !== '.json'
  ) {
    console.log('Please enter a valid file name')
    process.exit()
  }
}

function checkBucketName() {
  if (typeof bucket !== 'string' || !bucket || bucket.length <= 0) {
    console.log('Please enter a valid bucket name')
    process.exit()
  }
}
