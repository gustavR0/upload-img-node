import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import util from 'util'

const unlinkFile = util.promisify(fs.unlink)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

function checkFileType (file, cb) {
  const filetypes = /jpeg|png|jpg|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(null, 'Please upload images only')
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).any()

const port = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// For setting template engine
app.set('view engine', 'ejs')

// For accessing public folder
app.use(express.static('public'))

app.get('/', (req, res) => {
  const images = []
  fs.readdir('./public/uploads/', (err, files) => {
    if (!err) {
      files.forEach(file => {
        images.push(file)
      })
      res.render('index', { images })
    } else {
      console.log(err)
    }
  })
})

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    // eslint-disable-next-line eqeqeq
    if (!err && req.files != undefined) {
      res.status(200).send()
    // eslint-disable-next-line eqeqeq
    } else if (!err && req.files == '') {
      res.statusMessage = 'Please select an image to upload'
      res.status(400).end()
    } else {
      res.statusMessage = (err === 'Please upload images only' ? err : 'Photo exceeds limit of 1MB')
      res.status(400).end()
    }
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
