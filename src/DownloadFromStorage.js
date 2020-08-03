import { Client } from 'minio'
import isDocker from 'is-docker'

export default class DownloadFromStorage {
  constructor(target) {
    this.target = target
    this.minioConnectionParam = this._getClientConfig()
  }

  download(file1, file2, bucket) {
    return this._fileDownload(file1, bucket).then(() => {
      return this._fileDownload(file2, bucket)
    })
  }

  _getClientConfig() {
    if (isDocker()) {
      return require(`/config/client.json`)
    }
    return require('../config/client.json')
  }

  _fileDownload(file, bucket) {
    const minioClient = this._createMinioClient()

    return minioClient.fGetObject(bucket, file, this.target + file)
  }

  _createMinioClient() {
    return new Client({
      endPoint: this.minioConnectionParam.MINIO_ENDPOINT,
      port: this.minioConnectionParam.MINIO_PORT,
      useSSL: this.minioConnectionParam.MINIO_USE_SSL,
      accessKey: this.minioConnectionParam.MINIO_ACCESSKEY,
      secretKey: this.minioConnectionParam.MINIO_SECRETKEY,
    })
  }
}
