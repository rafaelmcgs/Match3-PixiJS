function Button(manager_,callBack_, text_){
	
	this.textStyle  = {
		fontSize:100,
		fontFamily:"Candice",
		fill:'#ffffff'
	};
	
	PIXI.Container.call(this);
	
	this.manager = manager_;
	this.callBack = callBack_;	
	
	this.textures = {
		normal: PIXI.Texture.fromFrame('btnNormal.png'),
		hover: PIXI.Texture.fromImage('btnHover.png')
	};
	
	//Create and add box
	this.box = new PIXI.Sprite(this.textures.normal);
	this.addChild(this.box);
	
	//Create and add text
	this.text=null;
	if(text_ != null){
		this.text = new PIXI.Text(text_);	
		this.text.style = this.textStyle;
		this.addChild(this.text);
		
		/**
		 *Resize text
		 */
		var textBounds;
		var boxBounds = this.box.getLocalBounds();
		this.text.style.fontSize = 100;
		var sizeOK = false;
		var maxSize = {
			w:250,
			h:75
		};
		//Loop til textBounds fit in the box
		while(!sizeOK){
			//Get the textBounds
			textBounds = this.text.getLocalBounds();
			if(
				textBounds.width < maxSize.w
				&& textBounds.height < maxSize.h
			){
				//If fit in the box stop the loop
				sizeOK=true;
			}else{
				//If not decrease the fontsize
			   this.text.style.fontSize -= 1;
			}
		}
		/**
		 *Reposition text
		 */
		this.text.x = (boxBounds.width - textBounds.width)/2;
		this.text.y = (boxBounds.height - textBounds.height)/2 -16;
	}
	
	
	//Mouse/touch events	
	this.interactive = true;
	this.isdown = false;
	this.isOver = false;	
    this.on('pointerdown', this.onButtonDown.bind(this));
    this.on('pointerup', this.onButtonUp.bind(this));
    this.on('pointerupoutside', this.onButtonUp.bind(this));
    this.on('pointerover', this.onButtonOver.bind(this));
    this.on('pointerout', this.onButtonOut.bind(this));
	
	this.resize();
}

Button.prototype = Object.create(PIXI.Container.prototype);
Button.prototype.resize = function(maxWidth, maxHeight){
	
	//Get bounds of this container, without scale
	var buttonBounds = this.getLocalBounds();
	
	var scale = {
		x:  maxWidth / buttonBounds.width,
		y:  maxHeight / buttonBounds.height,
		final:0
	};
	if(scale.x > scale.y){
		scale.final = scale.x;
	}else{
		scale.final = scale.y;
	}
	this.scale.x = this.scale.y = scale.final;
	
};

Button.prototype.onButtonDown = function() {
    this.isdown = true;
    this.box.texture = this.textures.hover;
};

Button.prototype.onButtonUp = function() {
    this.isdown = false;
    if (this.isOver) {
		this.callBack();
        this.box.texture = this.textures.hover;
    }
    else {
        this.box.texture = this.textures.normal;
    }
};

Button.prototype.onButtonOver = function() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    this.box.texture = this.textures.hover;
};

Button.prototype.onButtonOut = function() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    this.box.texture = this.textures.normal;
};