function ButtonHome(manager_,callback_){

	var options = {
		textures: {
			normal: PIXI.Texture.fromFrame('homeNormal.png'),
			hover: PIXI.Texture.fromImage('homeHover.png')
		}
	};

	Button.call(this, manager_, callback_, options);	
	this.resize();
}

ButtonHome.prototype = Object.create(Button.prototype);

ButtonHome.prototype.resize = function(){
	

	if(window.innerWidth > window.innerHeight){
		//landscape		
		var maxSize = {
			width: window.innerWidth * 0.10,
			height: window.innerHeight*0.2
		};
	}else{
		//portrait
		var maxSize = {
			width: window.innerWidth * 0.50,
			height: window.innerHeight * 0.1
		};
	}
	
	Button.prototype.resize.call(this,maxSize.width,maxSize.height);
	
	//Reposition
	var bounds = this.getBounds();
	this.x = 10;
	if(window.innerWidth > window.innerHeight){
		this.y = 10;
	}else{
		this.y = window.innerHeight - 10 - bounds.height;
	}
	
};