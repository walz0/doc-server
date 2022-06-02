const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// get all docs
app.get('/docs', (req, res) => {
    fs.readdir(path.join(__dirname, 'public/docs'), (err, files) => {
        if (err) {
            res.send(500)
        } 
        let output = []
        files.forEach((file) => output.push(file));
        res.send(output)
    });
})