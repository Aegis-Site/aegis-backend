import dotenv from 'dotenv'

dotenv.config()

const validateKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    if (!apiKey || apiKey !== process.env.API_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    next()
}

export default validateKey