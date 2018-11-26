function Jelly(type_,id_){
    PIXI.Container.call(this);
    
    this.id = id_;
    this.type = type_;
    this.idName = "jelly"+type_+"-"+id_;
    this.newPosition = [];

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

    /**
     * Draw background to make the button area
     */
    this.background = new PIXI.Graphics();
    this.background.lineStyle(0, 0x000000, 0);
    this.background.beginFill(0x000000, 0);
    this.background.drawRect(0,0,184,184);

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
        }else if(this.x > this.newPosition[0].x){
            this.y = Math.max(this.y - 30, this.newPosition[0].y);
        }
        if(this.y == this.newPosition[0].y && this.x == this.newPosition[0].x){
            return this.newPosition.shift();
        }

    }
};
Jelly.prototype.addMovement = function(x_,y_){
    this.newPosition.push({
        x: x_,
        y: y_
    });
};