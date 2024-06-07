import fs from 'fs'
import request from 'request'
import mime from 'mime-types'
import path from 'path'

import { uploadFileData, getFilePath, deleteFileData } from './DB.js'

async function handleFileUpload(sha256, uploadedFile) {
    uploadFileData(sha256, uploadedFile)
}

async function handleFileDelete(sha256) {
    try {
        const path = await getFilePath(sha256)
        if(path) { 
            fs.unlink(path, (err) => {
                if (err) throw err
            })
        }
        deleteFileData(sha256)

    } catch (err) {
        throw err
    }
}

async function filetoBase64(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath)
        const base64data =  fileBuffer.toString('base64')
        const extname = path.extname(filePath).slice(1)
        const mimeType = mime.lookup(filePath)
        const fileName = path.basename(filePath, `.${extname}`)

        const dataUrl = `data:${mimeType};name=${fileName};base64,${base64data}`

        return dataUrl
    } catch (err) {
        throw err
    }
}

export { handleFileUpload, handleFileDelete, filetoBase64 }