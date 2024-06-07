import { getFilePath } from './DB.js'
import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import dotenv from 'dotenv'

dotenv.config()

async function handleAPIResponse(hash) {
    try {
        let response = await virustotalRequest(hash, process.env.VIRUSTOTAL_API_KEY)
        response = JSON.parse(response)

        if (response.error && response.error.code === "NotFoundError") {
            console.log("Calling handleFileResponse")
            return await handleFileResponse(await getFilePath(hash))
        }

        return response
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function handleFileResponse(filePath) {
    try {
        const fileData = fs.readFileSync(filePath)
        const form = new FormData()
        form.append('file', fileData, { filename: 'file' })

        const options = {
            method: 'POST',
            headers: {
                'x-apikey': process.env.VIRUSTOTAL_API_KEY,
                ...form.getHeaders()
            },
            body: form
        }

        const response = await fetch('https://www.virustotal.com/api/v3/files', options)
        const jsonResponse = await response.json()
        return analysisResponse(jsonResponse)
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function analysisResponse(response) {
    try {
        console.log("Calling analysisResponse")
        const analysisID = response.data.id

        const options = {
            method: 'GET',
            headers: {
                'x-apikey': process.env.VIRUSTOTAL_API_KEY
            }
        }

        const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisID}`, options)
        return await analysisResponse.json()
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function virustotalRequest(hash, apikey) {
    const options = {
        method: 'GET',
        headers: {
            'x-apikey': apikey
        }
    }

    const response = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, options)
    return await response.text()
}

export { handleAPIResponse, handleFileResponse, analysisResponse, virustotalRequest }
