const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const crypto = require('crypto')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// https://gist.github.com/zfael/a1a6913944c55843ed3e999b16350b50
function generateChecksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
}

function getChecksum(file) {
    // generate unique hash for identifying files
    const doc = fs.readFileSync(path.join(__dirname, 'public/docs/' + file))
    return generateChecksum(doc)
}

function getLastPage(checksum) {
    const data = JSON.parse(fs.readFileSync("./data.json"))
    if (checksum in data) return data[checksum]
    return 0
}

function saveLastPage(checksum, currentPage) {
    let data = JSON.parse(fs.readFileSync("./data.json"))
    data[checksum]["lastPage"] = currentPage
    fs.writeFileSync(data[checksum]["path"], data)
}

// get all docs
app.get('/docs', (req, res) => {
    fs.readdir(path.join(__dirname, 'public/docs'), (err, files) => {
        if (err) res.send(500)
        let output = []
        files.forEach((file) => {
            const checksum = getChecksum(file)
            const lastPage = getLastPage(checksum)
            output.push({
                "path": '/docs/' + file,
                "title": file,
                "lastPage": lastPage,
                "checksum": checksum
            })
        })
        res.send(output)
    });
})

// save progress in document
app.post('/save', (req, res) => {
    const checksum = req.body.checksum
    const currentPage = req.body.currentPage
    saveLastPage(checksum, currentPage)
    res.send(200)
})