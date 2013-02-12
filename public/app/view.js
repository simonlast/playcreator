
var play = function(pjs) {

	var objects = {};
	var objectList = [];
	var shapes = {};
	var keyBindings = [];
	var variables = {};
	var images = {};
	var loadedImages = {};
	var breakpoints = [];

	//bind command names to their actions
	var actions = {};

	var bkg = pjs.color(250);

	pjs.setup = function(){
		pjs.size(pjs.screenWidth,pjs.screenHeight);
		pjs.noStroke();
		pjs.smooth();
		pjs.resetVars();
		pjs.imageMode(pjs.CENTER);
		if(!localStorage.getItem('images')){
			localStorage.setItem('images',JSON.stringify({}));
			images = {};
		}else{
			images = JSON.parse(localStorage.getItem('images'));	
		}
	};

	pjs.draw = function(){
		pjs.background(bkg);
		for(var i=0; i<objectList.length; i++){
			objectList[i].render();
		}
	};

	pjs.addExistingImage = function(name){

		//load image
		loadedImages[name] = pjs.loadImage(images[name].png);

		var newShape = new Actor(name);
		objects[name] = newShape;
		objectList.push(newShape);
	};

	pjs.getImages = function(){
		return images;
	}

	pjs.loadImages = function(imgs){
		images = imgs;
		localStorage.setItem('images',JSON.stringify(images));
		console.log(images);
	}

	pjs.addImage = function(name, png){

		images[name] = {
			'png': png
		};

		localStorage.setItem('images',JSON.stringify(images));

		//load image
		loadedImages[name] = pjs.loadImage(png);

		var newShape = new Actor(name);
		objects[name] = newShape;
		objectList.push(newShape);
		return '';
	};

	pjs.resetVars = function(){
		variables = {
			'huge' : 500,
			'tiny' : 10,
			'small': 50,
			'large': 400
		};
	};

	pjs.reset = function(){
		objects = {};
		objectList = [];
		keyBindings = [];
		variables = {};
		pjs.resetVars();
		pjs.setup();
	};

	pjs.resetState= function(){
		objects = {};
		objectList = [];
		keyBindings = [];
		variables = {};
		breakpoints = [];
		pjs.resetVars();
	};

	pjs.runCommand = function(obj){
		//reset narration
    		if(obj) //dont actually do this
		var ret = actions[obj.event](obj.match, obj);
	};

	// [ * is a character ] commands
	actions.isa = function(obj){
		var name = obj[2];

		//console.log(images[name]);

		if(objects[name]){
			return name + " is already here!";
		}else if(images[name]){
			pjs.addExistingImage(name);
		}else{
			Controller.startSketch(name);
		}
	};

	// [ remove * ] commands
	actions.remove = function(obj){
		var name = obj[4];
		if(objects[name]){
			delete objects[name];
			objectList = objectList.filter(function(elem){
				return !(elem.name === name);
			});
			keyBindings = keyBindings.filter(function(elem){
				return !(elem.name === name);
			});
			return '';
		}
		return name + " isn't here yet.";
	};

	// [ * is * ] variable commands
	actions.isvar = function(obj){
		var name = obj[1];
		var val = obj[2];
		if(variables[val]){
			variables[name] = variables[val];
		}else{
			var num = parseInt(val,10);
			if(num){
				variables[name] = num;
				return '';
			}
			return val + ' is not a number. Try \'' + name + ' is 200\'';
		}
	};

	// [ *'s is * ]  commands
	actions.isattr = function(obj){
		var name = obj[1];
		var attr = obj[3];
		var value = obj[4];
		var obj = objects[name]
		if(obj){
			var num = parseInt(value,10);
			if(variables[value]){
				num = variables[value];
			}
			if(!num && num != 0){
				return value + ' is not a number. Try \'' + name + '\'s ' + attr + ' is 200\'';
			}
			if(attr === 'right'){
				attr = 'x';
				num = pjs.width-num;
			}else if(attr === 'left'){
				attr = 'x';
			}else if(attr === 'top'){
				attr = 'y';
			}else if(attr === 'bottom'){
				attr = 'y';
				num = pjs.height - num;
			}else if(attr === 'size'){
					attr = 'radius';
					num /= 2;
				}
			if(pjs.editShapeAttr[attr]){
				return pjs.editShapeAttr[attr](obj,num);
			}
			return name + ' doesn\'t have a ' + attr + '. Try \'' + name + '\'s size is 400\'';
		}
		return name + ' isn\'t here yet. Try \'' + name + ' is an actor\'';
	};

	// [ * says * ]  commands
	actions.narrate = function(obj){
		var name = obj[2];
		var text = obj[3];

		if(objects[name]){
			Controller.setNarration(name + ": " + text);
			return '';
		}else if(name === "narrator"){
			Controller.setNarration(text);
		}else{
			return name + ' isn\'t here yet. Try \'' + name + ' is an actor\'';
		}
		
	};

	// [ move *'s * ] commands
	actions.moveattr = function(obj){
		var name = obj[1];
		var attr = obj[3];
		var value = obj[4];
		var obj = objects[name]
		if(obj){
			var num = parseInt(value,10);
			if(variables[value]){
				num = variables[value];
			}
			if(!num && num != 0){
				return value + ' is not a number. Try \'' + name + '\'s ' + attr + ' is 200\'';
			}
			if(attr === 'right'){
				attr = 'x';
			}else if(attr === 'left'){
				attr = 'x';
				num *= -1;
			}else if(attr === 'top'){
				attr = 'y';
			}else if(attr === 'bottom'){
				attr = 'y';
				num *= -1;
			}else if(attr === 'up'){
				attr = 'y';
				num *= -1;
			}else if(attr === 'down'){
				attr = 'y';
			}else if(attr === 'size'){
					attr = 'radius';
					num /= 2;
			}
			if(pjs.editShapeAttr[attr]){
				return pjs.incShapeAttr[attr](obj,num);
			}
			return name + ' doesn\'t have a ' + attr + '. Try \'' + name + '\'s size is 400\'';
		}
		return name + ' isn\'t here yet. Try \'' + name + ' is an actor\'';
	};

	pjs.editShapeAttr = {
		'radius': function(obj,value){
			obj.shape.rad = value;
			obj.shape.w = value*2*obj.shape.ratio;
			obj.shape.h = value*2;
			return '';
		},
		'x': function(obj,value){
			obj.shape.pos.x = value;
			return '';			
		},
		'y': function(obj,value){
			obj.shape.pos.y = value;
			return '';	
		},

		'red': function(obj,value){
			obj.shape.r = value;
			return '';	
		},

		'green': function(obj,value){
			obj.shape.g = value;
			return '';	
		},

		'blue': function(obj,value){
			obj.shape.b = value;
			return '';	
		},

		'width': function(obj,value){
			obj.shape.w = value;
			return '';	
		},

		'height': function(obj,value){
			obj.shape.h = value;
			return '';	
		}
	};

	pjs.incShapeAttr = {
		'radius': function(obj,value){
			obj.shape.rad += value;
			obj.shape.w += value*2*obj.shape.ratio;
			obj.shape.h += value*2;
		},
		'x': function(obj,value){
			obj.shape.pos.x += value;
		},
		'y': function(obj,value){
			obj.shape.pos.y += value;
		},

		'red': function(obj,value){
			obj.shape.r += value;
		},

		'green': function(obj,value){
			obj.shape.g += value;
		},

		'blue': function(obj,value){
			obj.shape.b += value;
		},
		'width': function(obj,value){
			obj.shape.w += value;
			return '';	
		},

		'height': function(obj,value){
			obj.shape.h += value;
			return '';	
		}
	};	

	var Shape = function(){
		this.rad = 150;
		this.pos = new pjs.PVector(pjs.width/2,pjs.height/2);
		this.r = 255;
		this.g = 255;
		this.b = 255;
		this.w = this.rad;
		this.h = this.rad;
		this.ratio = 1; //width to height ratio

		this.tweens = {
			rad: 0,
			pos: new pjs.PVector(pjs.width/2,pjs.height/2),
			r: 255,
			g: 255,
			b: 255,
			w: 0,
			h: 0
		};

		this.tween = function(){
			this.tweens.pos.x += (this.pos.x-this.tweens.pos.x)*.1;
			this.tweens.pos.y += (this.pos.y-this.tweens.pos.y)*.1;
			this.tweens.rad += (this.rad-this.tweens.rad)*.1;
			this.tweens.r += (this.r-this.tweens.r)*.1;
			this.tweens.g += (this.g-this.tweens.g)*.1;
			this.tweens.b += (this.b-this.tweens.b)*.1;
			this.tweens.w += (this.w-this.tweens.w)*.1;
			this.tweens.h += (this.h-this.tweens.h)*.1;
		}
	};

	var Actor = function(name){

		ACTOR = this;
		this.name = name;
		//this.data = images[name].data;
		this.image = loadedImages[name];
		this.shape = new Shape();
		this.shape.w = sketchDimen[0];
		this.shape.h = sketchDimen[1];
		this.shape.ratio = this.shape.w/this.shape.h;

		this.render = function(){
			this.shape.tween();
			
			//TINT = MEMORY LEAK x 1000
			//pjs.tint(this.shape.r, this.shape.g, this.shape.b);
			pjs.image(this.image, this.shape.tweens.pos.x, this.shape.tweens.pos.y, 
				this.shape.tweens.w, this.shape.tweens.h);
			
		};	
	};
};

//init
var canvas = document.getElementById("playcanvas");
var pjs = new Processing(canvas, play);
