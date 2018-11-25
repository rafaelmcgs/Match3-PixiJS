function Background(){
	this.texture = null;
	
}
Background.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

Background.prototype.create = function(){
	//Load default texture
	this.texture = PIXI.Texture.fromImage("img-bg01.png");
	
	//create tiling sprite
	PIXI.extras.TilingSprite.call(this, this.texture, window.innerWidth, window.innerHeight);
	
	this.resize();
};
Background.prototype.resize = function(){
	if(this.texture == null){
		//if this.texture = null, this object is not initialized
		return;
	}
	//resize element
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	
	
	/**
	 *resize texture
	 */
	var scale = {
		x:0,
		y:0,
		final:0
	};
	scale.x = window.innerWidth/this.texture.width;
	scale.y = window.innerHeight/this.texture.height;
	if(scale.x > scale.y){
	   scale.final = scale.x;
	}else{
	   scale.final = scale.y;
	}
	
	this.tileScale.x = scale.final;
	this.tileScale.y = scale.final;
	
	
	/**
	 *reposition texture
	 */
	var tileSize = {
		width:this.texture.width * scale.final,
		height:this.texture.height * scale.final
	};
	
	this.tilePosition.x = (window.innerWidth - tileSize.width) / 2;
	this.tilePosition.y = (window.innerHeight - tileSize.height) / 2;
};