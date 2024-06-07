import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

import generateHash from '../../utils/generateHash.js'
import {handleFileUpload, handleFileDelete} from '../../utils/fileHandling.js'
import { handleAPIResponse } from '../../utils/apiRequest.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 100000000 } })

router.get('/:hash', async (req, res) => {
    const hash = req.params.hash;
    try {
        const response = await handleAPIResponse(hash);
        res.json(response);
        handleFileDelete(hash);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/fileUpload', upload.single("fileUpload"), (req, res) => {
    const uploadedFile = req.file

    const hash = crypto.createHash('sha256')
    const input = fs.createReadStream(uploadedFile.path)

    input.on('readable', () => {
        const data = input.read();
        if (data) {
            hash.update(data);
        } else {
            const sha256 = hash.digest('hex')
            handleFileUpload(sha256, uploadedFile)
            res.json({ sha256 })
        }
    })
})

export default router;