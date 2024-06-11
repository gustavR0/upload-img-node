import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import util from 'util'

const unlinkFile = util.promisify(fs.unlink)

const port = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// For setting template engine
app.set('view engine', 'ejs')

// For accessing public folder
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
