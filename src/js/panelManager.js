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
			fill:'#ee3875',
			dropShadow: true,
			dropShadowColor: "#009fc5"
		},
		messsage: {
			fontSize:50,
			fontFamily:"Candice",
			fill:'#ee3875',
			align:'center',
			dropShadow: true,
			dropShadowColor: "#009fc5"
		},
		scoreText: {
			fontSize:80,
			fontFamily:"Candice",
			fill:'#ee3875',
			dropShadow: true,
			dropShadowColor: "#009fc5"
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
	
	//stars
	
	for(var i = 0;i<3;i++){
		this.stars.push(new Star(this,this.buttonLevelAction,i));
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
	this.removeChildren();
	this.opened = true;
	this.activated = true;
	
	this.alpha = 0;
	//Add basic elements
	this.addChild(this.box);
	this.addChild(this.title);
	
	//Add panel type elements
	switch(type){
		case "levelSelect": this.openLevelSelect(); break;
		case "home": this.openHome(); break;
		case "score": this.openScore(options); break;
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
PanelManager.prototype.openHome = function(){
	//Set Title	
	this.title.text = "";

	//insert msg object
	this.messsage.text = "You will leave\n this game.\nAre you sure?";
	this.addChild(this.messsage);
	
	var boxBounds = this.box.getLocalBounds();
	var msgBounds = this.messsage.getLocalBounds();

	this.messsage.x = (boxBounds.width - msgBounds.width)/2;
	this.messsage.y = 250;

	//insert buttons	
	this.addChild(this.buttons.ok);
	this.addChild(this.buttons.cancel);

	//resize buttons
	this.buttons.ok.resize(boxBounds.width*0.4);
	this.buttons.cancel.resize(boxBounds.width*0.4);

	//reposition buttons
	this.buttons.ok.x = boxBounds.width*0.05;
	this.buttons.ok.y = boxBounds.height*0.7;

	this.buttons.cancel.x = boxBounds.width*0.55;
	this.buttons.cancel.y = boxBounds.height*0.7;

};
PanelManager.prototype.openScore = function(options){
	//Set Title	
	this.title.text = "Level Complete";

	
	var boxBounds = this.box.getLocalBounds();

	//insert buttons	
	this.addChild(this.buttons.ok);

	//resize buttons
	this.buttons.ok.resize(boxBounds.width*0.4);

	//reposition buttons
	this.buttons.ok.x = boxBounds.width*0.3;
	this.buttons.ok.y = boxBounds.height*0.75;

	//insert stars
	this.addChild(this.stars[0]);
	this.addChild(this.stars[1]);
	this.addChild(this.stars[2]);

	
	this.stars[0].x = (boxBounds.width - 3* 155)/2;
	this.stars[1].x = (155)+(boxBounds.width - 3* 155)/2;
	this.stars[2].x = (2 * 155)+(boxBounds.width - 3* 155)/2;
	this.stars[0].y = this.stars[1].y = this.stars[2].y = 240;

	if(options.stars >0){
		this.stars[0].showStar(true);
	}else{		
		this.stars[0].showStar(false);
	}

	if(options.stars >1){
		this.stars[1].showStar(true);
	}else{		
		this.stars[1].showStar(false);
	}

	if(options.stars >2){
		this.stars[2].showStar(true);
	}else{		
		this.stars[2].showStar(false);
	}

	
	this.scoreText.text =options.score;

	var scoreBGBounds = this.scoreBG.getLocalBounds();
	var scoreTextBounds = this.scoreText.getLocalBounds();
	
	this.scoreBG.x = (boxBounds.width - scoreBGBounds.width) /2;
	this.scoreBG.y = 400;

	this.scoreText.x = this.scoreBG.x + (scoreBGBounds.width - scoreTextBounds.width)/2;
	this.scoreText.y = this.scoreBG.y + (scoreBGBounds.height - scoreTextBounds.height)/2;

	this.addChild(this.scoreBG);
	this.addChild(this.scoreText);

};



PanelManager.prototype.buttonOkAction = function(){
	this.gameManager.closeLevel();
	this.open("levelSelect");
	
};
PanelManager.prototype.buttonCancelAction = function(){
	this.opened = false;
	
};
PanelManager.prototype.buttonLevelAction = function(levelIndex){
	console.log("Level with index "+levelIndex+" was selected");
	this.opened = false;
	this.gameManager.openSceneMatch(levelIndex);
};