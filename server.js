const express = require('express')
const path = require('path')

const app = express()
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'build')))

app.post('/callback', (req, res) => {
    res.redirect(`/callback?${new URLSearchParams({
        ...req.body,
        reponse_method: 'form_post'
    }).toString()}`)
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.listen(3000, () => {
    console.log("OAuth Fiddler is running on port http://localhost:3000 !");
})