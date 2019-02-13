const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const sanitizeHtml =require('sanitize-html');
const fs = require('fs');
const app = express();
app.use(bodyParser());
const upload = multer({
  dest: 'uploads/'
}); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/add', (req, res) => {
  if (req.body.addData) {
    const addData = sanitizeHtml(req.body.addData)
    const dataToWrite = new Date() + " :: " + addData +'\r\n'
    fs.writeFileSync(`./${new Date()}-log.txt`, dataToWrite)
    console.log("req", dataToWrite)
    res.status(200)
      .send(dataToWrite)
  } else {
    res.status(404)
    .send('No Input Detected')
  }
});


app.post('/append', (req, res) => {
  if (req.body.fileToAppend) {
    var found ="";
    //sanitize HTML
    const fileToAppend = sanitizeHtml(req.body.fileToAppend)
    const appendData = sanitizeHtml(req.body.appendFile);

    //check if file has extention
    var ext = fileToAppend.toString().split('.').pop();
    console.log('ext',ext)
    console.log('ext length', ext.length)
    
    if (ext.length > 0) {
      found = fileToAppend.toString().replace(/\.[^/.]+$/, "")
      console.log('ext less found', found)
    } else {
      found = fileToAppend.toString();
      console.log('No ext found', found)
    }

    //Append the new data with timestamp
    const dataToWrite = new Date() + " :: " + appendData + '\r\n'
   //check if file exist
    const fileFound = `./${found}.txt`;
    console.log('fileFound',fileFound)
    if (fs.existsSync(fileFound)) {
      fs.appendFile(fileFound, dataToWrite, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      res.status(200)
        .send(dataToWrite)
    } else {
      res.status(404)
      .send('File Not Found !!')
    }

  } else {
    res.status(404)
    .send('No Input Detected')
  }
});


app.post('/upload', upload.single('file-to-upload'), (req, res) => {
  res.redirect('/')
});

app.listen(3003, (err) => {
  if (!err) {
    console.log('Listening on port 3003')
  }
})
