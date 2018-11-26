function Jelly(type_,id_,board_){
    PIXI.Container.call(this);
    
    this.id = id_;
    this.type = type_;
    this.board = board_;

    this.idName = "jelly"+type_+"-"+id_;
    this.newPosition = [];
    this.myAddress = {
        line:0,
        col:0
    };

    /**
     * DragonBones
     */
    var factory = dragonBones.PixiFactory.factory;
	factory.parseDragonBonesData(
        PIXI.loader.resources["dB-jelly"+this.type+"-bonesData"].data,
        this.idName
    );

	factory.parseTextureAtlasData(
		PIXI.loader.resources["dB-jelly"+this.type+"-textureData"].data, 
		PIXI.loader.resources["dB-jelly"+this.type+"-textureImg"].texture,
        this.idName
    );        
	
	//Build and set the jelly
	this.jellyArmature = factory.buildArmatureDisplay(
        "Armature",
        this.idName,
        null,
        this.idName
    );
	this.jellyObj = this.jellyArmature.display;	
    this.jellyObj.animation.play("idle",1);
    this.jellyObj.x = 184/2;
    this.jellyObj.y = 184/2;

    this.jellyArmature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.dragonBonesFrameEvent.bind(this)	);

    /**
     * Draw background to make the button area
     */
    this.background = new PIXI.Graphics();
    this.background.lineStyle(3, 0xFFFFFF, 1,0);
    this.background.beginFill(0x000000, 0.4);
    this.background.drawRect(0,0,184,184);
    this.background.alpha = 0;

    this.addChild(this.background);
    this.addChild(this.jellyObj);

}
Jelly.prototype = Object.create(PIXI.Container.prototype);

Jelly.prototype.update = function(){
    //Make the movement
    if(this.newPosition.length > 0){
        if(this.x < this.newPosition[0].x){
            this.x = Math.min(this.x + 30, this.newPosition[0].x);
        }else if(this.x > this.newPosition[0].x){
            this.x = Math.max(this.x - 30, this.newPosition[0].x);
        }
        if(this.y < this.newPosition[0].y){
            this.y = Math.min(this.y + 30, this.newPosition[0].y);
        }else if(this.y > this.newPosition[0].y){
            this.y = Math.max(this.y - 30, this.newPosition[0].y);
        }
        if(this.y == this.newPosition[0].y && this.x == this.newPosition[0].x){
            return this.newPosition.shift();
        }
        return true;
    }else{
        return false;
    }
};
Jelly.prototype.addMovement = function(x_,y_){
    this.newPosition.push({
        x: x_,
        y: y_
    });
};

Jelly.prototype.insertExplosion = function(myAddress_){    
    this.setAddress(myAddress_);
    this.jellyObj.animation.play("explode",1);
};

Jelly.prototype.dragonBonesFrameEvent = function(e){
    switch(e.name){
        case "explosionFinished":
            this.board.endAnimation();
            this.board.removeJelly(this.myAddress);
        break;
    }
};  

Jelly.prototype.setAddress = function(newAddress){
    this.myAddress = newAddress;

};

Jelly.prototype.refresh = function(){
    this.jellyObj.animation.play("idle",1);
};