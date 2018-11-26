function Button(manager_,callBack_, options){
	PIXI.Container.call(this);
	
	this.manager = manager_;
	this.callBack = callBack_;		
	
	this.textStyle  = {
		fontSize:100,
		fontFamily:"Candice",
		fill:'#ffffff'
	};	
	
	if("textures" in options){
	    this.textures = options.textures;
	}else{
		this.textures = {
			normal: PIXI.Texture.fromFrame('btnNormal.png'),
			hover: PIXI.Texture.fromImage('btnHover.png')
		};		
	}
	
	//Create and add box
	this.box = new PIXI.Sprite(this.textures.normal);
	this.addChild(this.box);
	
	/**
	 *Create and add text
	 */
	this.text=null;
	
	//set max size of the text
	if("textMaxSize" in options){
		this.textMaxSize = options.textMaxSize;
	}else{
		this.textMaxSize = {
			w:250,
			h:75
		};
	}
	
	//set margins of the text
	this.textMargins = {
		top:-16,
		left:0
	};
	if("textMargins" in options){
		if("top" in options.textMargins){
			this.textMargins.top = options.textMargins.top;
		}
		if("left" in options.textMargins){
			this.textMargins.left = options.textMargins.left;
		}
	}
	
	//set text and insert into container
	if("text" in options){
		this.text = new PIXI.Text(options.text);	
		this.text.style = this.textStyle;
		this.addChild(this.text);
		
		this.resizeText();
	}
	
	
	/**
	 *Mouse/touch events
	 */
	this.interactive = true;
	this.isdown = false;
	this.isOver = false;	
    this.on('pointerdown', this.onButtonDown.bind(this));
    this.on('pointerup', this.onButtonUp.bind(this));
    this.on('pointerover', this.onButtonOver.bind(this));
    this.on('pointerout', this.onButtonOut.bind(this));
	
	this.resize();
}

Button.prototype = Object.create(PIXI.Container.prototype);

Button.prototype.resize = function(maxWidth, maxHeight){
	
	//Get bounds of this container, without scale
	var buttonBounds = this.getLocalBounds();
	var max = {
		width: maxWidth,
		height:maxHeight
	};
	
	//Give values if null
	if( maxWidth == null){
	   max.width = buttonBounds.width;
	}
	if(maxHeight == null){
	   max.height = buttonBounds.height;
	}
	
	var scale = {
		x:   max.width / buttonBounds.width,
		y:  max.height / buttonBounds.height,
		final:0
	};
	if(scale.x < scale.y){
		scale.final = scale.x;
	}else{
		scale.final = scale.y;
	}
	this.scale.x = this.scale.y = scale.final;
	
};

Button.prototype.resizeText = function(){
	
	if(this.text != null){
		/**
		 *Resize text
		 */
		var textBounds;
		var boxBounds = this.box.getLocalBounds();
		this.text.style.fontSize = 200;
		var sizeOK = false;
		//Loop til textBounds fit in the box
		while(!sizeOK){
			//Get the textBounds
			textBounds = this.text.getLocalBounds();
			if(
				textBounds.width < this.textMaxSize.w
				&& textBounds.height < this.textMaxSize.h
			){
				//If fit in the box stop the loop
				sizeOK=true;
			}else{
				//If not decrease the fontsize
			   this.text.style.fontSize -= 2;
			}
		}
		/**
		 *Reposition text
		 */
		this.text.x = (boxBounds.width - textBounds.width)/2 + this.textMargins.left;
		this.text.y = (boxBounds.height - textBounds.height)/2 + this.textMargins.top;
	}
}

Button.prototype.onButtonDown = function() {
    this.isdown = true;
    this.isOver = true;
    this.box.texture = this.textures.hover;
};

Button.prototype.onButtonUp = function() {
    this.isdown = false;
    if (this.isOver) {
		this.callBack.call(this.manager);
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
