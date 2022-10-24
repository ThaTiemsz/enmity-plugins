const express = require("express")
const app = express()
const PORT = 3000

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use("/Plugins", express.static("dist"))
app.use("/Themes", express.static("Themes"))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nhttp://localhost:${PORT}`)
})