const express = require('express')
const gTTS = require('gtts')
const bodyparser = require('body-parser')
const mysql = require('mysql')
const speech = require('@google-cloud/speech')
const fs = require('fs')
var markdown = require( "markdown" ).markdown;

const translate = require('@vitalets/google-translate-api');
var navbar = fs.readFileSync('make/navbar.html','utf8')
const PORT = 5000
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('html/index', { navbar: navbar })
})

app.get('/textmp3', (req, res) => {
    var myCss = fs.readFileSync('views/css/textmp3.css','utf8')
    res.render('html/textmp3', { myCss: myCss, navbar: navbar})
})

app.post('/mp3', (req, res) => {
    const text = req.body.text

    const speech = new gTTS(text, req.body.lang)
    speech.save('texttomp3.mp3', function (err, result) {
  if(err) { throw new Error(err) }
  res.download('texttomp3.mp3')
  })
})

app.get('/translator', (req, res) => {
    res.render('html/translator', { navbar: navbar })
})

app.post('/translate', (req, res) => {
    text = req.body.text
    lang1 = req.body.lang1
    lang2 = req.body.lang2
    translate(text, {from: lang1, to: lang2}).then(result => {
    res.render('html/translate', {translated: result.text, navbar: navbar});
    console.log(result.from.text.value);
}).catch(err => {
    console.error(err);
});
})


app.get('/corrector', (req, res) => {
    res.render('html/corrector', { navbar: navbar })
})

app.post('/corrected', (req, res) => {
    text = req.body.text
    lang = req.body.lang
    translate(text, {from:lang, to: lang}).then(result => {
        value = result.from.text.value
    res.render('html/corrected', {corrected: value, navbar: navbar});
}).catch(err => {
    console.error(err);
});
})

app.get('/markdowner', (req, res) => {
    res.render('html/markdowner', { navbar: navbar })
})

app.post('/markdowned', (req, res) => {
    const text = req.body.text
    const markdowned = markdown.toHTML(text)
    res.render('html/markdowned', { markdowned: markdowned, navbar: navbar})
})

app.listen(PORT, function(){
    console.log(`Port : ${PORT}`)
})