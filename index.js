const express = require('express')
const coursesRouter = require('./router/courses')

const app = express()
const URL = 'localhost'
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use('/courses', coursesRouter)

app.listen(PORT, () => {
    console.log(`Server running on ${URL + ':' + PORT}`)
})