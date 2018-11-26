function ButtonLevel(manager_,callback_,levelIndex_){
	
	
	this.levelIndex = levelIndex_;
	
	var options = {
		text: (levelIndex_+1),		
		//Must be same texture because this button doesn´t have hover
		textures: {
			normal: PIXI.Texture.fromFrame('panelCircle.png'),
			hover: PIXI.Texture.fromImage('panelCircle.png')
		},
		textMaxSize: {
			w:137,
			h:137
		},
		textMargins:{
			top:-27,
			left:0
		}
	};
	
	Button.call(this, manager_, callback_, options);	
	this.resize();
	
}
ButtonLevel.prototype = Object.create(Button.prototype);

//The original function must be overwrited because we need to send paramater to callback function
ButtonLevel.prototype.onButtonUp = function() {
    this.isdown = false;
    if (this.isOver) {
		this.callBack.call(this.manager,this.levelIndex);
        this.box.texture = this.textures.hover;
    }
    else {
        this.box.texture = this.textures.normal;
    }
};

ButtonLevel.prototype.resize = function(){
	
	
	Button.prototype.resize.call(this,145,170);
};

