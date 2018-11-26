function Board(){
	PIXI.Container.call(this);
    

    this.background = new PIXI.Graphics();
    
    this.jellyPool = new JellyPool();
    this.jellyContainer = new PIXI.Container();
    this.jellyContainerMask = new PIXI.Graphics();
    this.jellyContainer.mask = this.jellyContainerMask;

    this.addChild(this.background);
    this.addChild(this.jellyContainer);
    this.addChild(this.jellyContainerMask);

    this.map = [];
    this.jellysToInsert = [];
    this.jellysMap = [];

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
    var jellymap = this.jellysMap;
	for(var line = jellymap.length-1; line >= 0;line--){
        for(var col = jellymap[line].length-1; col >=0;col--){
            if(jellymap[line][col] != -1){
                jellymap[line][col].update();
            }
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
                    line*184,
                    col*184,
                    184,
                    184
                );
            }
        }
    }

    //Clone map
    this.map = JSON.parse(JSON.stringify(map));
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
    var map = this.map;
	for(var line = map.length-1; line >= 0;line--){
        for(var col = map[line].length-1; col >=0;col--){
            if(map[line][col] == 0){
                var jellyType = Math.floor(Math.random()*(5)+1);
                var jelly = this.jellyPool.borrow(jellyType);

                this.jellysToInsert[col].push(jelly);
                this.jellysMap[line][col] = jelly;

                jelly.addMovement(col*184,line*184);
            }else{
                this.jellysMap[line][col] = -1;
            }
        }
    }

    this.addJellysToBoard();
};
Board.prototype.addJellysToBoard = function(){
    for(var col = 0; col < this.jellysToInsert.length;col++){
        for(var i = 0; i < this.jellysToInsert[col].length;i++){
            var jelly = this.jellysToInsert[col][i];
            this.jellyContainer.addChild(jelly);
            jelly.x = 184* col;
            jelly.y = -184*i - 184;
        }
    }
};