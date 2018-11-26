function PanelManager(gameManager_){
	PIXI.Container.call(this);
	
	this.gameManager = gameManager_;
	
	//variables to control the update
	this.activated = false;
	this.opened = false;
	
	this.textStyles = {
		title: {
			fontSize:80,
			fontFamily:"Candice",
			fill:'#ffffff',
		},
		messsage: {
			fontSize:30,
			fontFamily:"Candice",
			fill:'#ffffff'
		},
		scoreText: {
			fontSize:30,
			fontFamily:"Candice",
			fill:'#ffffff'
		}
		
	};
	
	
	/**
	 *Panel elements
	 */
	this.box = null;	
	
	this.title = null;
	
	this.messsage = null;
	
	this.scoreText = null;
	this.scoreBG = null;	
	
	this.stars = [];
	
	this.buttons = {
		ok: null,
		cancel: null,
		levels:[]
	};
	
	
}

PanelManager.prototype = Object.create(PIXI.Container.prototype);

PanelManager.prototype.createObjects = function(){	
	this.box = new PIXI.Sprite(PIXI.Texture.fromFrame('panelContainer.png'));
	this.title = new PIXI.Text("", this.textStyles.title);
	this.messsage = new PIXI.Text("", this.textStyles.messsage);
	this.scoreText = new PIXI.Text("", this.textStyles.scoreText);
	this.scoreBG = new PIXI.Sprite(PIXI.Texture.fromFrame('panelScore.png'));
	
	/**
	 *Create buttons
	*/
	this.buttons.ok = new Button( this, this.buttonOkAction,{text:"Ok"});
	this.buttons.cancel = new Button( this, this.buttonCancelAction,{text:"Cancel"});
	
	//Level buttons
	var levels = levelsConfig;
	for(var i = 0;i<levels.length;i++){
		this.buttons.levels.push(new ButtonLevel(this,this.buttonLevelAction,i));
	}
	
};

PanelManager.prototype.resize = function(){
	if(this.box == null){
		return;
	}
	var bounds = this.getLocalBounds();
	var max = {
		width: window.innerWidth*0.8,
		height: window.innerHeight*0.8
	};
	
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
	this.y = (window.innerHeight - bounds.height*scale.final)/2;
};
PanelManager.prototype.repositionTitle = function(){
	var boxBounds = this.box.getLocalBounds();
	var titleBounds = this.title.getLocalBounds();
	
	this.title.x = (boxBounds.width - titleBounds.width)/2;
	this.title.y = 40 - titleBounds.height;
};


PanelManager.prototype.update = function(){
	if(!this.activated){
	   return
	}
	if(this.opened && this.alpha < 1){
		this.alpha += 0.05;
	}else if(!this.opened && this.alpha > 0){
		this.alpha -= 0.05;	   
	}else if(!this.opened && this.alpha <= 0){
		//Disable update
		this.activated = false;
		//Remove this container from stage
		this.gameManager.removePanel();
	}
};

PanelManager.prototype.open = function(type,options){
	
	this.opened = true;
	this.activated = true;
	
	this.alpha = 0;
	//Add basic elements
	this.addChild(this.box);
	this.addChild(this.title);
	
	//Add panel type elements
	switch(type){
		case "levelSelect": this.openLevelSelect(); break;
	}
	
	this.repositionTitle();
	
	this.resize();
};
PanelManager.prototype.openLevelSelect = function(){
	//Set Title	
	this.title.text = "LevelSelect";
	
	/**
	 *Level buttons
	 */
	var boxBounds = this.box.getLocalBounds();
	var marginTop = 210;
	for(var i=0; i< this.buttons.levels.length; i++){
		this.addChild(this.buttons.levels[i]);
		
		var line = Math.floor(i / 3);
		var column = i - line*3;
		
		//Calculate margin left and center columns
		var temp = this.buttons.levels.length - (line*3);
		if(temp > 3){
		   temp = 3;
		}
		var marginLeft = (boxBounds.width - temp* 155)/2;
		
		//Position
		this.buttons.levels[i].x = (column * 155) + marginLeft;
		this.buttons.levels[i].y = (line * 180) + marginTop;
	}
};




PanelManager.prototype.buttonOkAction = function(){
	
};
PanelManager.prototype.buttonCancelAction = function(){
	
};
PanelManager.prototype.buttonLevelAction = function(levelIndex){
	console.log("Level with index "+levelIndex+" was selected");
	this.opened = false;
	this.gameManager.openSceneMatch(levelIndex);
};