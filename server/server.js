
var express = require('express')
  , http = require('http')
  , connect = require('connect');

var storage = require('./persist');

storage.init({
    dir:'persist',
    logging: true
});

var saticServer = connect()
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser());

var app = express();

app.configure( function(){
  app.use(saticServer);
  app.use(express.errorHandler());
  app.use(express.bodyParser());
});

app.post("/submit" ,function(req,res){

	var url = 'test'
	var obj = req.body;
	var token = randomString();

	while(storage.getItem('token')){
		token = randomString();
	}

	console.log(token);

	//console.log(obj);

	if(obj.images && obj.program){
		storage.setItem(token, obj);
		res.json({'token' : token});
	}else{
		res.json({error: "invalid play"})
	}

	
});

app.get("/play/:id" ,function(req,res){

	var id = req.params.id;
	var data = storage.getItem(id);
	if(data){
		res.json(data);
		console.log("get play: " + id)
	}else{
		res.json({error: "play expired or missing"})
	}
});

var server = http.createServer(app);

server.listen(process.argv[2] || 80);


var randomString = function() {
	var len = 12;
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
};
	
