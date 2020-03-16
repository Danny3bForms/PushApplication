const express = require('express');

const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
const https = require('https');
//const server = https.createServer({key: key, cert: cert }, app);

MongoClient.connect(url, function(err, db) {
	if(err) throw er;
	var dbo = db.db("mydb");
	app.listen(4000, function() {
 		console.log('listening on 3000')
	});


	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

  	app.get('/', (req, res) => {
  		dbo.collection('customers').find().toArray((err, result) => {
	    	if (err) return console.log(err)
	    // renders index.ejs
	    	res.render('index.ejs', {customers: result})
  		})
	});

	 app.post('/multiplePushNotifications', (req, res) => {

	 	console.log('Hello')

	 	console.log(req.body)

	 	function _getMsg(st, callback) {
		    dbo.collection(st).find().toArray(function (err, docs) {
		        callback(docs);
		    });
		}
		
		_getMsg('customers', function (res) {
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
			var xmlhttp = new XMLHttpRequest();
	        let url = "https://fcm.googleapis.com/fcm/send";
	        xmlhttp.open("POST", url);
	        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	        xmlhttp.setRequestHeader("Authorization", "key=AAAAsVnKTQI:APA91bFud2Ylwc-cC-wTkjn8hjXds-3LQw9JYD94ZxwUy3w2cLY0yg8BO7jOwUZXTQ0ynw2E5alX3M6KwZ4Y4WihGxaKVF2pVs9XjYtyh0y7scO93WnxQV4qzewYEOJjidx6-yWz-h0m");
	        xmlhttp.send(JSON.stringify(
	        	{
				    "notification": {
				        "title": "Firebase",
				        "body": "Firebase is awesome",
				        "click_action": "http://localhost:8080/",
				        "icon": "http://localhost:8080/icon.jpg"
				    },
				    "to": res[0].token
				}

	        ));
		     // --> res contain data and printed ok
		    var nodeArr = res;
		      // just moved the nodeArr declaration to function scope
		});

		res.redirect('/');
	});
		/*
	 	dbo.collection('customers').find().toArray((err, result) => {
	 		res.send('GoGo');
  		}); */

	app.post('/customers', (req, res) => {



		console.log(req.body)
	  dbo.collection('customers').insertOne(req.body, (err, result) => {
	    if (err) return console.log(err)

	    console.log('saved to database')
	    res.redirect('/');
  	});

	


})
});