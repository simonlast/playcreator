
var SketchTool = {};

SketchTool.play = function(pjs) {

	var bkg, strokes, defaultCol, currColor, currRadius;

	pjs.setup = function(){
		pjs.size(SketchTool.options.width,SketchTool.options.height);
		pjs.noStroke();
		pjs.smooth();
		pjs.noLoop();
		pjs.resetVars();
		
	};

	pjs.resetVars = function(){
		bkg = pjs.color(255);
		strokes = [];
		defaultCol = SketchTool.options.color;
		currColor = pjs.color(defaultCol.r, defaultCol.g, defaultCol.b);
		currRadius = SketchTool.options.radius;
		pjs.redraw();
	}

	pjs.draw = function(){
		pjs.background(0,0);
		for(var i=0; i<strokes.length; i++){
			strokes[i].render();
		}
	};

	pjs.mousePressed = function(){
	   	var stroke = new pjs.Stroke(
	  		[new pjs.PVector(pjs.mouseX,pjs.mouseY)],
	    	currColor,
	    	currRadius);
	    strokes.push(stroke);
	    pjs.loop();
	};

	pjs.mouseDragged = function(){
		var currStroke = strokes[strokes.length-1];
  		currStroke.addPoint(new pjs.PVector(pjs.mouseX,pjs.mouseY));
	};

	pjs.mouseReleased = function(){
  		pjs.noLoop();
	};

	pjs.changeColor = function(r,g,b){
		currColor = pjs.color(r,g,b);
	};

	pjs.undoStroke = function(){
		if(strokes.length > 0){
			strokes.splice(strokes.length-1,1);
			pjs.redraw();
		}
	};

	pjs.changeRadius = function(radius){
		currRadius = radius;
	};

	pjs.incRadius = function(radius){
		currRadius += radius;
	};

	pjs.getData = function(){
		var data = [];
		for(var i=0; i<strokes.length; i++){
			var curr = strokes[i];
			var currPoints = [];
			for(var x=0; x<curr.points.length; x++){
				currPoints.push({
					x: curr.points[x].x,
					y: curr.points[x].y
				});
			}
			data.push({
				points: currPoints,
				color: {
					r: pjs.red(curr.color),
					g: pjs.green(curr.color),
					b: pjs.blue(curr.color)
				},
				radius: curr.radius
			});
		}
		return data;
	};

	pjs.Stroke = function(points, color, radius){
		this.points = points;
		this.color = color;
		this.radius = radius;

		this.render = function(){
			pjs.beginShape();
  			pjs.stroke(this.color);
  			pjs.strokeWeight(this.radius);
  			pjs.noFill();
  			for(var i=0; i<this.points.length; i++){
  				var curr = this.points[i];
    			pjs.curveVertex(curr.x, curr.y);
  			}
  			pjs.endShape();
		};

		this.addPoint = function(point){
			this.points.push(point);
		};
	};

};

SketchTool.defaults = {
	width: 800,
	height: 600,
	radius: 20,
	color: {
		r: 60,
		g: 60,
		b: 60
	}
};

SketchTool.options = {};

SketchTool.setOptions = function(userOptions){
	if(!userOptions){
		SketchTool.options = SketchTool.defaults;
	}else{
		for(var key in SketchTool.defaults){
			if(userOptions[key] != undefined){
				SketchTool.options[key] = userOptions[key];
			}else{
				SketchTool.options[key] = SketchTool.defaults[key];
			}
		}
	}
};

/* Call this function on sketch (sketch.getPNG) */
SketchTool.getPNG = function(){
	return this.canvas.toDataURL("image/png");
}

SketchTool.createDOM = function(canvasId){
	SketchTool.removeDOM();
	$('.popup').append('<div class="sketch_holder"></div>');
	$('.sketch_holder').append('<div class="button cmd_finish_sketch"><i class="icon-ok-sign"></i></div>');
	$('.sketch_holder').append('<div class="button cmd_undo"><i class="icon-undo"></i></div>');
	$('.popup').append('<canvas id="' + canvasId + '"></canvas>');
};

//NOT USED
SketchTool.removeDOM = function(canvasId){
	$('#' + canvasId).remove();
	$('.sketch_holder').remove();
};

SketchTool.color = function(sketch,r,g,b){

	this.r = r;
	this.g = g;
	this.b = b;
	this.sketch = sketch;
	this.className = '' + r + g + b;
	this.domEl;

	//parent is jquery selector
	this.createDOM = function(parent){
		parent.append('<div class="color_option ' + this.className + '"></div>');
		this.domEl = $('.' + this.className);
		this.domEl.css({
			'background-color': 'rgb(' + r + ',' + g + ',' + b + ')'
		});
		//'this' gets clobbered in callback
		var currObj = this;
		this.domEl.click(function(){
			currObj.sketch.changeColor(currObj.r, currObj.g, currObj.b);
		});
	}

}

SketchTool.createColors = function(parent, sketch, colors){
	for(var i=0; i<colors.length; i++){
		var curr = colors[i];
		var newCol = new SketchTool.color(sketch, curr.r, curr.g, curr.b);
		newCol.createDOM(parent);
	}
}

SketchTool.create = function(canvasId, options){
	SketchTool.createDOM(canvasId);
	var sketch = {};
	SketchTool.setOptions(options);
	sketch.canvas = document.getElementById(canvasId);
	sketch.processingInstance = new Processing(sketch.canvas, SketchTool.play);
	sketch.reset = sketch.processingInstance.resetVars;
	sketch.changeColor = sketch.processingInstance.changeColor;
	sketch.changeRadius = sketch.processingInstance.changeRadius;
	sketch.incRadius = sketch.processingInstance.incRadius;
	sketch.getData = sketch.processingInstance.getData;
	sketch.undoStroke = sketch.processingInstance.undoStroke;
	sketch.getPNG = SketchTool.getPNG;
	sketch.removeDOM = SketchTool.removeDOM;
	sketch.createColors = SketchTool.createColors;
	return sketch;
};
