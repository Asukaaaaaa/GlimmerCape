const _path = require('path')

const express = require('express')
const app = express()


app.use('/static', express.static(_path.resolve(__dirname, '../static')))


app.use('/', async (req, res) => {
    res.send('Hello World')
})

app.listen(8080)
