function Board(manager_){
    PIXI.Container.call(this);

    this.manager = manager_;
    this.activated = false;
    this.comboCount = 0;
    /**
     * map variables
     */
    this.jellysToInsert = []; //important to insert new jellys in order on the top
    this.jellysMap = []; //important to update elements (like movements)

    /**
     * events variables
     */
    this.eventIsDown = false;
    this.eventStartPoint = {
		x:0,
		y:0
    };
    this.jellysAreMoving = false;
    this.jellysSwapping = [];
    this.jellySelected = null;
    this.hasAnimation = false;

    
    //background
    this.background = new PIXI.Graphics();
    
    /**
     * create jellys
     */
    this.jellyPool = new JellyPool(this);
    this.jellyContainer = new PIXI.Container();
    this.jellyContainerMask = new PIXI.Graphics();
    this.jellyContainer.mask = this.jellyContainerMask;

    /**
     * add elements to stage
     */
    this.addChild(this.background);
    this.addChild(this.jellyContainer);
    this.addChild(this.jellyContainerMask);

    /**
     * create events
     */
	this.interactive = true;
	this.on("pointerdown",this.pointerdown.bind(this));
	this.on("pointermove",this.pointermove.bind(this));
	this.on("pointerup",this.pointerup.bind(this));


}
Board.prototype = Object.create(PIXI.Container.prototype);

Board.prototype.resize = function(){
    var bounds = this.background.getLocalBounds();

    if(window.innerWidth > window.innerHeight){
		//landscape		
		var max = {
			width: window.innerWidth * 0.9,
			height: window.innerHeight*0.75
		};
	}else{
		//portrait
		var max = {
			width: window.innerWidth * 0.9,
			height: window.innerHeight * 0.65
		};
	}
	
	//Set scale
	var scale = {
		x:   max.width / bounds.width,
		y:  max.height / bounds.height,
		final:0
	};
	if(scale.x < scale.y){
		scale.final = scale.x;
	}else{
		scale.final = scale.y;
	}
	this.scale.x = this.scale.y = scale.final;
	
	//Reposition
    this.x = (window.innerWidth - bounds.width*scale.final)/2;
	if(window.innerWidth > window.innerHeight){
		//landscape		
        this.y = window.innerHeight*0.95 - bounds.height*scale.final;	
	}else{
		//portrait
        this.y = (window.innerHeight - bounds.height*scale.final)/2;
	}
};
Board.prototype.update = function(){
    if(!this.activated){
        return;
    }
    var jellymap = this.jellysMap;
    var hasJellyMovement = false;
	for(var line = jellymap.length-1; line >= 0;line--){
        for(var col = jellymap[line].length-1; col >=0;col--){
            if(jellymap[line][col] != -1){
                hasJellyMovement = jellymap[line][col].update();
            }
        }
    }
    if(hasJellyMovement == false && this.jellysAreMoving){
        this.jellysAreMoving = false;
        if(!this.checkAndInsertMatch3()){
            this.reverseJellysSwap();
        }else{
            this.finishJellysSwap();
        }
    }

};
Board.prototype.reDraw = function(map){
    

    this.background.clear();
    this.background.lineStyle(3, 0xFFFFFF, 1,0);
    this.background.beginFill(0x000000, 0.4);


	for(var line = 0; line < map.length;line++){
        for(var col = 0; col < map[line].length;col++){
            if(map[line][col] == 0){
                this.background.drawRect(
                    col*184,
                    line*184,
                    184,
                    184
                );
            }
        }
    }

    //Clone map
    this.jellysMap = JSON.parse(JSON.stringify(map));

    //Set columns arrays into jellysToInsert
    this.jellysToInsert = [];
    for(var col = 0; col < map[0].length;col++){
        this.jellysToInsert.push([]);
    }

    //Set jellyContainerMask
    this.jellyContainerMask.clear();
    this.jellyContainerMask.lineStyle(3, 0x000000, 1,1);
    this.jellyContainerMask.beginFill(0x000000, 1);
    this.jellyContainerMask.drawRect(
        0,
        0,
        this.jellysMap[0].length*184,
        this.jellysMap.length*184
    );

    this.resize();
};
Board.prototype.populate = function(){
    var map = this.jellysMap;
	for(var line = map.length-1; line >= 0;line--){
        for(var col = map[line].length-1; col >=0;col--){
            if(map[line][col] == 0){
                //choose a jelly by random
                var jellyType = Math.floor(Math.random()*(5)+1);

                /**
                 * check if the new type will create a match
                 */                
                var maxloops = 100;
                if(map[line].length - col > 2  && map.length - line > 2){
                    //check down and right matchs
                    while(
                        (
                            (
                                this.jellysMap[line][col+1].type == this.jellysMap[line][col+2].type
                                && this.jellysMap[line][col+1].type == jellyType
                            )
                            ||(
                                this.jellysMap[line+1][col].type == this.jellysMap[line+2][col].type
                                && this.jellysMap[line+1][col].type == jellyType
                            )
                        )
                        && maxloops > 0
                    ){
                        jellyType = Math.floor(Math.random()*(5)+1);
                        maxloops--;
                    }
                }else if(map[line].length - col > 2  && map.length - line <= 2){
                    //check down match                    
                    while(
                        (
                            (
                                this.jellysMap[line][col+1].type == this.jellysMap[line][col+2].type
                                && this.jellysMap[line][col+1].type == jellyType
                            )
                        )
                        && maxloops > 0
                    ){
                        jellyType = Math.floor(Math.random()*(5)+1);
                        maxloops--;
                    }
                }else if(map[line].length - col <= 2  && map.length - line > 2){
                    //check right match
                    while(
                        (
                            (
                                this.jellysMap[line+1][col].type == this.jellysMap[line+2][col].type
                                && this.jellysMap[line+1][col].type == jellyType
                            )
                        )
                        && maxloops > 0
                    ){
                        jellyType = Math.floor(Math.random()*(5)+1);
                        maxloops--;
                    }
                }


                /**
                 * Insert jelly!
                 */
                //get the jelly type from pool
                var jelly = this.jellyPool.borrow(jellyType);
                //insert jelly to jelly map
                this.jellysMap[line][col] = jelly;
                jelly.setAddress({line:line,col:col});
                //inform the board about this new jelly
                this.jellysToInsert[col].push(jelly);
                //insert movement to jelly fall
                jelly.addMovement(col*184,line*184);
                this.jellysAreMoving = true;
            }else{
                this.jellysMap[line][col] = -1;
            }
        }
    }

    this.addJellysToBoard();
};

Board.prototype.reset = function(){
    
    this.eventIsDown = false;
    this.jellysAreMoving = false;
    this.jellysSwapping = [];
    this.jellySelected = null;
    this.hasAnimation = false;
    
	for(var line = this.jellysMap.length-1; line >= 0;line--){
        for(var col = this.jellysMap[line].length-1; col >=0;col--){
            var jelly = this.jellysMap[line][col];

            if(jelly != -1){
                this.jellyContainer.removeChild(jelly);
                this.jellyPool.return(jelly);
                this.jellysMap[line][col] = -1;
            }
        }

    }
};

Board.prototype.addJellysToBoard = function(){
    for(var col = 0; col < this.jellysToInsert.length;col++){
        for(var i = 0; i < this.jellysToInsert[col].length;i++){
            var jelly = this.jellysToInsert[col][i];
            this.jellyContainer.addChild(jelly);
            jelly.x = 184* col;
            jelly.y = -184*i - 184;
        }
        this.jellysToInsert[col] = [];
    }
};
Board.prototype.removeJelly = function(address){
    var jelly = this.jellysMap[address.line][address.col];

    this.jellyContainer.removeChild(jelly);
    this.jellyPool.return(jelly);

    //all jellys above must fall
    var map = this.jellysMap;
    var lastLineRemoved = address.line;
	for(var line = address.line; line > 0;line--){
        if(this.jellysMap[line][address.col] != -1){

            var ok = false;
            var count = line-1;
            while(!ok && count>=0){
                if(this.jellysMap[count][address.col] != -1){
                    this.jellysMap[line][address.col] = this.jellysMap[count][address.col];
                    this.jellysMap[line][address.col].setAddress({line:line,col:address.col});
                    this.jellysMap[line][address.col].addMovement(address.col*184,line*184);
                    ok = true;
                    lastLineRemoved = count;
                }
                count--;
            }
        }
    }

    /**
     * Insert new jelly!
     */
    
    var jellyType = Math.floor(Math.random()*(5)+1);
    //get the jelly type from pool
    var newJelly = this.jellyPool.borrow(jellyType);

    //insert jelly to jelly map
    this.jellysMap[lastLineRemoved][address.col] = newJelly;
    newJelly.setAddress({line:lastLineRemoved,col:address.col});


    //inform the board about this new jelly
    this.jellysToInsert[address.col].push(newJelly);
    //insert movement to jelly fall
    newJelly.addMovement(address.col*184,lastLineRemoved*184);
    this.jellysAreMoving = true;

    this.addJellysToBoard();

};

/**
 * events functions
 */
Board.prototype.pointerdown = function(event){
    if(this.jellysAreMoving || this.hasAnimation || this.manager.lockEvents){
        return;
    }
    this.eventIsDown = true;
    this.eventStartPoint = event.data.getLocalPosition(this);

    //reset Combo
    this.comboCount = 0;
};
Board.prototype.pointerup = function(event){
    if(!this.eventIsDown || this.manager.lockEvents){
        return;
    }
    this.eventIsDown = false;

    if(this.jellySelected==null){
        var firstAddress = {
            line: Math.floor(this.eventStartPoint.y / 184),
            col: Math.floor(this.eventStartPoint.x / 184)
        };
        var pointNow = event.data.getLocalPosition(this);
        var nowAddress = {
            line: Math.floor(pointNow.y / 184),
            col: Math.floor(pointNow.x / 184)
        };
        if(firstAddress.line == nowAddress.line && firstAddress.col == nowAddress.col){
            //select the jelly
            this.jellySelected = firstAddress;
            this.jellysMap[this.jellySelected.line][this.jellySelected.col].setSelection(true);
        }
    }else{
        var pointNow = event.data.getLocalPosition(this);
        var nowAddress = {
            line: Math.floor(pointNow.y / 184),
            col: Math.floor(pointNow.x / 184)
        };
        
        if(this.jellySelected.line == nowAddress.line && this.jellySelected.col == nowAddress.col){
            //unselect the jelly
            this.jellysMap[this.jellySelected.line][this.jellySelected.col].setSelection(false);
            this.jellySelected = null;
        }else{
            //check if is adjacent object
            if(nowAddress.line == this.jellySelected.line && this.jellySelected.col-1 == nowAddress.col){
                //left                
                this.insertJellySwap(this.jellySelected,{line:0,col:-1});
            }else if(nowAddress.line == this.jellySelected.line && this.jellySelected.col+1 == nowAddress.col){
                //right
                this.insertJellySwap(this.jellySelected,{line:0,col:1});
            }else if(nowAddress.line == this.jellySelected.line-1 && this.jellySelected.col == nowAddress.col){
                //top
                this.insertJellySwap(this.jellySelected,{line:-1,col:0});
            }else if(nowAddress.line == this.jellySelected.line+1 && this.jellySelected.col == nowAddress.col){
                //bottom
                this.insertJellySwap(this.jellySelected,{line:1,col:0});
            }
        }

    }

    

};
Board.prototype.pointermove = function(event){
    if(!this.eventIsDown || this.jellySelected != null || this.manager.lockEvents){
        return;
    }
    var pointNow = event.data.getLocalPosition(this);

    //get jellyAddress in array map
    var jellyAddress = {
        line: Math.floor(this.eventStartPoint.y / 184),
        col: Math.floor(this.eventStartPoint.x / 184)
    }

    var movement = {line:0,col:0};
    if(pointNow.x < this.eventStartPoint.x-184/2 ){
        //left
        movement.col = -1;
    }else if(pointNow.x > this.eventStartPoint.x+184/2){
        //rigth
        movement.col = 1;
    }else if(pointNow.y < this.eventStartPoint.y-184/2){
        //up
        movement.line = -1;
    }else if(pointNow.y > this.eventStartPoint.y+184/2){
        //down
        movement.line = 1;
    }
    if(movement.line != 0 || movement.col != 0){
        this.eventIsDown = false;
        this.insertJellySwap(jellyAddress,movement);
    }
};


/**
 * Swap Functions
 */
Board.prototype.insertJellySwap = function(address,movement){
    if(this.jellySelected != null){
        //reset selection
        this.jellysMap[this.jellySelected.line][this.jellySelected.col].setSelection(false);
        this.jellySelected = null;
    }

    var newAdress = {
        line: address.line + movement.line,
        col: address.col + movement.col,
    }

    //Check if movement is going out of board
    if(
        newAdress.col < 0
        || newAdress.col >= this.jellysMap[0].length
        || newAdress.line < 0
        || newAdress.line >= this.jellysMap.length
    ){
        console.log("movement fail");
        return;
    }

    /**
     * Insert jelly´s swap
     */
    //check the target position and check it if exist
    var tempJelly = this.jellysMap[newAdress.line][newAdress.col];
    if(tempJelly == -1){
        console.log("movement fail");
        return;
    }
    this.manager.decreaseMoves();
    //change jellys positions
    this.jellysMap[newAdress.line][newAdress.col] = this.jellysMap[address.line][address.col];
    this.jellysMap[address.line][address.col] = tempJelly;

    //insert movements to the jellys
    this.jellysAreMoving = true;
    this.jellysMap[address.line][address.col].addMovement(address.col*184,address.line*184);
    this.jellysMap[newAdress.line][newAdress.col].addMovement(newAdress.col*184,newAdress.line*184);
    

    //inform to the board about this swap
    this.jellysSwapping.push(newAdress);
    this.jellysSwapping.push(address);
    

};
Board.prototype.reverseJellysSwap = function(){
    if(this.jellysSwapping.length == 0){
        return;
    }
    
    this.manager.increaseMoves();
    var jellys = this.jellysSwapping;

    var tempJelly = this.jellysMap[jellys[0].line][jellys[0].col];

    //reverse positions
    this.jellysMap[jellys[0].line][jellys[0].col] = this.jellysMap[jellys[1].line][jellys[1].col];
    this.jellysMap[jellys[1].line][jellys[1].col] = tempJelly;

    //insert movements
    this.jellysAreMoving = true;
    this.jellysMap[jellys[0].line][jellys[0].col].addMovement(jellys[0].col*184, jellys[0].line*184);
    this.jellysMap[jellys[1].line][jellys[1].col].addMovement(jellys[1].col*184, jellys[1].line*184);

    //reset jellysSwapping to prevent reverse again
    this.jellysSwapping = [];

};
Board.prototype.finishJellysSwap = function(){
    this.jellysSwapping = [];
};


//This is the most important function of this game
Board.prototype.checkAndInsertMatch3 = function(){

    var lastType = 0;
    var lastSameJellysType = [];
    var jellysToExplode = []; //address listed here will explode jellys at the end of this operation
    
    var map = this.jellysMap;
    /**
     * Check horizontally
     */  
	for(var line = 0; line < map.length;line++){
        for(var col = 0; col < map[line].length;col++){
            if(map[line][col] != -1){
                //check if this jelly type is the same as the previous one
                if(lastType != map[line][col].type){
                    //before delete the sequence saved, we will check if match 3
                    if(lastSameJellysType.length > 2){
                        //if match, save into jellysToExplode
                        for(var i = 0; i< lastSameJellysType.length;i++){
                            jellysToExplode.push(lastSameJellysType[i]);
                        }
                    }
                    //reset variables
                    lastType = map[line][col].type;
                    lastSameJellysType = [];
                    lastSameJellysType.push({line:line,col:col});
                }else{
                    lastSameJellysType.push({line:line,col:col});
                }
            }else{
                if(lastSameJellysType.length > 2){
                    //if match, save into jellysToExplode
                    for(var i = 0; i< lastSameJellysType.length;i++){
                        jellysToExplode.push(lastSameJellysType[i]);
                    }
                }
                //reset variables
                lastType = 0;
                lastSameJellysType = [];
            }
        }
        //after finish the line, we must check if match again
        if(lastSameJellysType.length > 2){
            if(lastSameJellysType.length > 2){
                //if match, save into jellysToExplode
                for(var i = 0; i< lastSameJellysType.length;i++){
                    jellysToExplode.push(lastSameJellysType[i]);
                }
            }
        }
        //and reset too        
        lastType = 0;
        lastSameJellysType = [];
    }

    /**
     * Check vertically
     */    
    lastType = 0;
    lastSameJellysType = [];
	for(var col = 0; col < map[0].length;col++){
        for(var line = 0; line < map.length;line++){
            if(map[line][col] != -1){
                //check if this jelly type is the same as the previous one
                if(lastType != map[line][col].type){
                    //before delete the sequence saved, we will check if match 3
                    if(lastSameJellysType.length > 2){
                        //if match, save into jellysToExplode
                        for(var i = 0; i< lastSameJellysType.length;i++){
                            jellysToExplode.push(lastSameJellysType[i]);
                        }
                    }
                    //reset variables
                    lastType = map[line][col].type;
                    lastSameJellysType = [];
                    lastSameJellysType.push({line:line,col:col});
                }else{
                    lastSameJellysType.push({line:line,col:col});
                }
            }else{
                if(lastSameJellysType.length > 2){
                    //if match, save into jellysToExplode
                    for(var i = 0; i< lastSameJellysType.length;i++){
                        jellysToExplode.push(lastSameJellysType[i]);
                    }
                }
                //reset variables
                lastType = 0;
                lastSameJellysType = [];
            }
        }
        //after finish the column, we must check if match again
        if(lastSameJellysType.length > 2){
            if(lastSameJellysType.length > 2){
                //if match, save into jellysToExplode
                for(var i = 0; i< lastSameJellysType.length;i++){
                    jellysToExplode.push(lastSameJellysType[i]);
                }
            }
        }
        //and reset too        
        lastType = 0;
        lastSameJellysType = [];
    }

    /**
     * explode the jellys listed
     */
    
    for(var i = 0; i< jellysToExplode.length;i++){
        var jellyAddress = jellysToExplode[i];
        this.hasAnimation = true;
        map[jellyAddress.line][jellyAddress.col].insertExplosion(jellyAddress);
    }

    if(jellysToExplode.length > 0){
        this.comboCount++;
        this.manager.increaseScore(jellysToExplode.length * this.comboCount * 15);
        return true;
    }else{
        return false; 

    }
     
};

//
Board.prototype.endAnimation= function(){
    this.hasAnimation = false;
};
