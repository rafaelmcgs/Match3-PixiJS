function ButtonMain(manager_,callback_){
	Button.call(this, manager_, callback_,{text:"Start"});
}
ButtonMain.prototype = Object.create(Button.prototype);

ButtonMain.prototype.resize = function(){
	
	
	var maxSize = {
		width: window.innerWidth * 0.40,
		height: Math.max(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.3) , 40)
 	};
	
	//Call original button resize
	Button.prototype.resize.call(this,maxSize.width,maxSize.height);
	
	
	//Reposition button	
	var buttonBounds = this.getBounds();
	this.x = (window.innerWidth - buttonBounds.width)/2;
	this.y = (window.innerHeight*0.60);
};