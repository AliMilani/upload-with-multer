const express = require('express');
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
    console.log(file)
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|)$/)) {
      return cb(new Error('فقط عکس اپلود کنید'))
    }
    cb(undefined, true)
  },
  storage: storage
})

const app = express();
// app.use(express.static("public"))
//enable directory listing
app.use(express.static(__dirname + '/public'));

// get /public/uploads list all files
app.get('/uploads', (req, res) => {
  const files = fs.readdirSync('./public/uploads')

  res.send(files.map(file => req.protocol + '://' + req.get('host') + '/uploads/' + file))
});

app.post('/upload', upload.single('myImage'), (req, res) => {
  // res.send(req.file)
  //send file
  res.sendFile(path.join(__dirname, 'public', 'uploads', req.file.filename))
})



let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running on port ' + port));