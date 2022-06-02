const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve('./public')))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// Get all files
app.get('/files', (req, res) => {
    fs.readdir(path.join(__dirname, 'public'), (err, files) => {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach((file) => {
            // Do whatever you want to do with the file
            console.log(file); 
        });
    });
})