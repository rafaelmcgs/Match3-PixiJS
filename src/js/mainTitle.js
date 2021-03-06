function MainTitle(){
	PIXI.Text.call(this);
	
	this.text = "Jelly Crush";
	this.style  = {
		fontSize:26,
		fontFamily:"Candice",
		fill:'#ee3875',
		dropShadow: true,
		dropShadowColor: "#009fc5"
	}; 	
	this.resize();
}
MainTitle.prototype = Object.create(PIXI.Text.prototype);

MainTitle.prototype.resize = function(){
	var elementBounds;
	var maxSize = {
		width: window.innerWidth * 0.9,
		height: window.innerHeight * 0.4
 	};
	
	//Define text fontsize
	this.style.fontSize = 300;	
	var sizeOK = false;
	
	//Loop til textBounds fit in maxSize
	while(!sizeOK){
		elementBounds = this.getLocalBounds();
		if(
			elementBounds.width < maxSize.width
			&& elementBounds.height < maxSize.height
		){
			sizeOK=true;
		}else{
		   this.style.fontSize -= 3;
		}
	}
	
	//Reposition element
	this.x = (window.innerWidth - elementBounds.width)/2;
	this.y = (window.innerHeight/2) - elementBounds.height;
	
};