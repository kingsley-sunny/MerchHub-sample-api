import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'
import drive from '@adonisjs/drive/services/main'

export class FileService {
  async upload(file: MultipartFile) {
    const key = `uploads/${cuid()}.${file.extname}`
    await file.moveToDisk(key)

    const url = await drive.use('fs').getUrl(key)

    return { url, key }
  }
}
