
var Parser = {};
var linesRun = 0;

Parser.match = function(str, regex){
    return str.match(regex);
}

Parser.parseS = function(command){
    //console.log("ParseS: " + command);

    if(!command || command === ''){
        return [];
    }

    var and_stmt = Parser.match(command, Expressions.S.regex);

    if(and_stmt && and_stmt.length == Expressions.S.length + 1){
        var first_s = Parser.parseS(and_stmt[1]);
        var rest = Parser.parseP(and_stmt[2]);
        return first_s.concat(rest);
    }else{
        return [Parser.parseP(command)];
    }

};

Parser.parseP = function(command){
    //console.log("ParseP: " + command);
    var regexArr = Object.keys(Expressions.P);
    for(var i=0; i<regexArr.length; i++){
        var curr = Expressions.P[regexArr[i]];
        var match = command.match(curr.regex);
        if(match && match.length == curr.length + 1){ //first index is full string
            return {
                'match':match,
                'event':regexArr[i]
            };
        }
    }
};

//input must be validated
Parser.parse = function(command){
    return Parser.parseS(command);
};

Parser.validate = function(command){
    var parsed = Parser.parse(command);
    //iterate through array - if any are null, parsing failed
    for(var i=0; i<parsed.length; i++){
        if(!parsed[i]){
            return false;
        }
    }
    return true;
};

//validate already parsed array
Parser.validateParsed = function(parsed){
    for(var i=0; i<parsed.length; i++){
        if(!parsed[i]){
            return false;
        }
    }
    return true;
}

Parser.parseLines = function(lines){
    for(var i=0; i<lines.length; i++){
        var validated = Parser.validate(lines[i]);
        if(!validated){
            return false;
        }
    }
    return true;
}

Parser.runLines = function(lines){

    for(var i=0; i<lines.length; i++){

        //reset narration after each line
       Controller.setNarration('');

        var curr = lines[i];
        var arr = Parser.parse(curr);

        if(Parser.validateParsed(arr)){
            for(var x=0; x<arr.length; x++){
                var currX = arr[x];
                var ret = pjs.runCommand(currX);
            }
        }else{
            console.log("Error: " + curr);
        }
    }
};

Parser.runSubset = function(lines, userLine){
    lines.splice(userLine,lines.length-(userLine-1));
    if(Parser.parseLines(lines)){
        if(lines.length > linesRun && linesRun > 0){
            lines.splice(0,linesRun);
        }else { //selected a previous line
            pjs.resetState();
        }
        linesRun = userLine;
        Parser.runLines(lines);
    }
};
