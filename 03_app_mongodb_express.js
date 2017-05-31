// Chargement des modules

const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient // le pilote MongoDB

// Configuration
const ObjectID = require('mongodb').ObjectID;
const app = express();
app.set('view engine', 'ejs'); // générateur de template 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public')) // pour utiliser le dossier public

/////////////////////////////////////////////////////////
// Connexion à la base de données et lancement de Express

var db // variable qui contiendra le lien sur la BD
MongoClient.connect('mongodb://127.0.0.1:27017/ma_bd', (err, database) => {
 if (err) return console.log(err)
 db = database
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})
//////////////////////////////////////////////////////
// Début des routes


app.get('/', (req, res) => {
 console.log('la route route get / = ' + req.url)
 // permet d'extraire l'ensemble ddes documents de la collection «adresse»
 var cursor = db.collection('adresse').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 // renders index.ejs
 // affiche le contenu de la BD
 res.render('index_2.ejs', {adresse: resultat})

}) 
})
//////////////////////////////////////////////
// Route formulaire
app.get('/formulaire', (req, res) => {
 console.log('la route get / = ' + req.url)
 res.sendFile(__dirname + "/public/html/forme.htm")
})

/////////////////////////////////////////////////////
// ajouter un nouveau document
app.post('/adresse', (req, res) => {
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/')
 })
})

/////////////////////////////////////////////////////
// Détruire un document
app.get('/detruire/:id', (req, res) => {
 var id = req.params.id 
// var critere = 'ObjectId("58bae3feaf5a674b240cfe53")'
// 58bae3feaf5a674b240cfe53
// var critere = ObjectID.createFromHexString(id)
var critere = ObjectID(req.params.id)
console.log(critere)

console.log(id)
 db.collection('adresse')
 .findOneAndDelete({"_id": critere}, (err, resultat) => {
 if (err) return res.send(500, err)
 var cursor = db.collection('adresse').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 res.redirect('/')
 })

}) 
})