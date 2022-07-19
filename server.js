const express = require('express')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, 'build')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.listen(4433, () => {
    console.log("OAuth Fiddler is running on port http://localhost:4433 !");
})