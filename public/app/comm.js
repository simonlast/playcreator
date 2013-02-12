
var Comm = {};

Comm.queryString = '';

Comm.submitPlay = function(){
	var images = pjs.getImages();
	var program = Controller.getProg();
	var obj = {
		'images': images,
		'program': program
	};
	$.ajax({
    	type: 'POST',
    	url: 'submit',
    	data: obj,
    	dataType: "json",
    	timeout: 2000,
    	success: function(result){
       		//console.log(result);
       		Controller.uploadComplete(result.token);
    	},
    	error: function (xhr, ajaxOptions, thrownError){
        	console.log(xhr.responseText);
    	}
	});
}

Comm.getPlay = function(){
	$.get('play/' + Comm.queryString, function(data) {
		if(!data.error && data.program && data.images){
			//console.log(data.program);
			editor.setValue(data.program);
			pjs.loadImages(data.images);
			Controller.setUserLine(1);
			Controller.startListener();
		}else{
			console.log(data.error);
			Controller.startListener();
			Controller.dialog(data.error);
		}
	});
}

Comm.getQueryString = function(){
	var href = window.location.href;
	var index = href.indexOf('?');
	if(index > 0){
		Comm.queryString = href.slice(index + 1);
		//console.log(Comm.queryString);
		if(!Comm.queryString || Comm === ''){
			Comm.queryString = '';
			Controller.startListener();
			return;
		}else{
			//console.log("valid: " + Comm.queryString);
			Comm.getPlay();
		}
	}else{
		Comm.queryString = '';
		Controller.startListener();
	}
	
}

Comm.getQueryString();
