
var sketchDimen = [350,500];
var toggle = false;
var terminalWidth = 500;
var sketch;
var editor;
var lastLine, lastLineContent;

var Controller = {};

Controller.getProg = function(){
	return editor.getValue();
};

//only gets lines up to user's hover
Controller.getLines = function(){
    var prog = editor.getValue();
    var lines = prog.split('\n');
    return lines;
};

Controller.getUserLine = function(){
    return editor.selection.getCursor().row + 1;
};

Controller.setUserLine = function(line){
    editor.gotoLine(line);
};

Controller.persistState = function(){
    state = editor.getValue();
    localStorage.setItem('prog',state);
};

Controller.dialog = function(html){
	Controller.removeDialog();
	$('body').append('<div class="popup"></div>');
	var popup = $('.popup');
	popup.dialog({
      minWidth: 550,
      position: [500,100]
    });
    if(html){
    	popup.append('<div class="dialog_text">' + html + '</div>');
    }
    return popup;
}

Controller.removeDialog = function(){
	$('.popup').remove();
}

Controller.uploadComplete = function(id){
	var url = 'playcreator.jit.su/?' + id;
	var complete = 'Saved! Access your play at<br /><a class="upload_link" href="http://' + url + '">' + url + '</a>'
	Controller.dialog(complete);
}

Controller.startSketch = function(name){
	
	Controller.dialog();

	pjs.noLoop();
	pjs.redraw();
	
	$('.sketch_name').remove();
	
	sketch = SketchTool.create('sketchcanvas',{
        width: sketchDimen[0],
        height: sketchDimen[1],
        radius: 20
    });

    $('body').append('<div class="sketch_name">draw ' + name + '!</div>');

    sketch.createColors($('.sketch_holder'), sketch, colorArr)

	$('.sketch_holder').append('<div class="button cmd_decsize"><i class="icon-minus-sign"></i></div>');
	$('.sketch_holder').append('<div class="button cmd_incsize"><i class="icon-plus-sign"></i></div>');

	$('.cmd_incsize').click(function(ev){
        sketch.incRadius(5);
    });

    $('.cmd_decsize').click(function(ev){
        sketch.incRadius(-5);
    });

    $('.cmd_undo').click(function(ev){
        sketch.undoStroke();
    });

    //runs after sketch is finished
    $('.cmd_finish_sketch').click(function(ev){
		ev.preventDefault();
        //var data = sketch.getData();
        var png = sketch.getPNG();
        pjs.addImage(name, png);
        pjs.loop();
        Controller.run();
        $('.sketch_name').remove();
        Controller.removeDialog();
    });
};

Controller.toggleEditor = function(){
	toggle = !toggle;
	var offset = 0;
	if(toggle){
		offset = -1*(terminalWidth - 30); 
	}
	$("#editor").animate({ left: offset + 'px'},200);
}

Controller.setNarration = function(narration){
	var div = $('.narrate');
	div.html(narration);
}

Controller.attachListeners = function(){

	//disable double click
	$(document).bind('dblclick',function(e){
	    e.preventDefault();
	})

	//start running program
	$('.cmd_verify').click(function(ev){
	    ev.preventDefault();
	    $('.welcome').remove();
	    var lines = Controller.getLines();
		var currLine = Controller.getUserLine();
	    Parser.runSubset(lines, currLine);
	});

	$('.cmd_left').click(function(ev){
	    ev.preventDefault();
	     $('.welcome').remove();
	    Controller.setUserLine(Controller.getUserLine()-1);
	});

	//only run next command
	$('.cmd_right').click(function(ev){
	    ev.preventDefault();
	     $('.welcome').remove();
	    Controller.setUserLine(Controller.getUserLine()+1);

	});

	$('.cmd_minimize').click(function(ev){
	    ev.preventDefault();
	     $('.welcome').remove();
	    Controller.toggleEditor();
	});

	$('.cmd_upload').click(function(ev){
	    ev.preventDefault();
	    if(Comm)
	    	Comm.submitPlay();
	});

};

Controller.popUp = function(){
	var about = 'Welcome! PlayCreator is a simple, visually-oriented programming language for young children.<br />';
	var action = 'To jump right in, just press &nbsp; <div class="button menubutton cmd_verify"><i class="icon-play"></i></div>'
	var more = '<br />Or, you can read more about the project <a href="http://github.com/simonlast/playcreator">here.</a>'
	$('body').append('<div class="welcome">' + about + action + more + '</div>')
	localStorage.setItem('welcome', true);
}

Controller.run = function(e){
	var currLine = Controller.getUserLine();
	var lines = Controller.getLines();
	var currLineContent = lines[currLine-1];
	
	if(lastLine != currLine || lastLineContent !== currLineContent){	
	    Parser.runSubset(lines, currLine);
	}
	lastLine = currLine;
	lastLineContent = currLineContent;	
}

Controller.init = function(){

	editor = ace.edit("editor");
	//editor.renderer.setShowGutter(false); 
	editor.getSession().setUseWrapMode(true);
	if(localStorage){
		var state = localStorage.getItem('prog');

		if(!localStorage.getItem('welcome')){
			Controller.popUp();
		}
		
		if(state){
			editor.setValue(state);
		}else{
			editor.setValue(example);
		}
	}
	Controller.setUserLine(1);

	editor.getSession().on('change', function(e) {
	    Controller.persistState();
	});

	Controller.attachListeners();

	//setTimeout(Controller.toggleEditor, 1000);
	
	Controller.toggleEditor();

};

//this is called by comm.js
Controller.startListener = function(){
	editor.getSession().selection.on('changeCursor', Controller.run);	
};

Controller.init();
