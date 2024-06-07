import crypto from 'crypto'
import fs from 'fs'

function generateHash(data) {
    const hash = crypto.createHash('sha256')
    const input = fs.createReadStream(data.path)
    console.log(data.path)

    let fileHash = ''
    input.on('readable', () => {
        const filedata = input.read()
        if (filedata)
            hash.update(filedata)
        else {
            fileHash = hash.digest('hex')
            return fileHash
        }
    })

}

export default generateHash