function TopBar(){
	PIXI.Container.call(this);

    this.box = new PIXI.Sprite(PIXI.Texture.fromFrame('headerContainer.png'));

    /**
     * Bar elements
     */
    this.barBg = new PIXI.Sprite(PIXI.Texture.fromFrame('barBG.png'));
    this.barColor = new PIXI.Sprite(PIXI.Texture.fromFrame('barColor.png'));
    this.barMask = new PIXI.Graphics();
    
    //Add mask to barColor
    this.barColor.mask = this.barMask;
    
    //Size and position of bar
    this.barBg.scale.x = this.barBg.scale.y = this.barColor.scale.x = this.barColor.scale.y = 0.5;
    this.barBg.x = this.barColor.x = 30;
    this.barBg.y = this.barColor.y = 8;


    /**
     * Text elements
     */
    this.textStyles = {
        remainingMoves:{
			fontSize:100,
			fontFamily:"Candice",
			fill:'#ffffff',
		},
        scoreGoal:{
			fontSize:50,
			fontFamily:"Candice",
			fill:'#ffffff',
		},
        scoreNow:{
			fontSize:40,
			fontFamily:"Candice",
			fill:'#ffffff',
		}
    };
    this.remainingMovesText = new PIXI.Text("10", this.textStyles.remainingMoves);
    this.scoreGoalText = new PIXI.Text("2000", this.textStyles.scoreGoal);
    this.scoreNowText = new PIXI.Text("2000", this.textStyles.scoreNow);

    
    this.scoreGoalBg = new PIXI.Sprite(PIXI.Texture.fromFrame('panelScore.png'));
    this.scoreGoalBg.scale.x = this.scoreGoalBg.scale.y = 0.43;
    this.scoreGoalBg.x = 408;
    this.scoreGoalBg.y = 2;


    /**
     * Insert elements to this container
     */
    this.addChild(this.box);
    this.addChild(this.scoreGoalBg);
    this.addChild(this.barBg);
    this.addChild(this.barColor);
    this.addChild(this.barMask);
    this.addChild(this.remainingMovesText);
    this.addChild(this.scoreGoalText);
    this.addChild(this.scoreNowText);

    this.reset(2000,10);
    this.resize();
	
}
TopBar.prototype = Object.create(PIXI.Container.prototype);

TopBar.prototype.resize = function(){
	var bounds = this.getLocalBounds();
	var max = {
		width: window.innerWidth*0.8,
		height: window.innerHeight*0.2
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
	this.y = 0;
};

TopBar.prototype.repositionTexts = function(){
    var textBounds;
    var referenceBounds;

    /**
     * remainingMovesText
     */
    referenceBounds = this.box.getBounds();
    textBounds = this.remainingMovesText.getBounds();
    this.remainingMovesText.x = (referenceBounds.width - textBounds.width)/2 ;
    this.remainingMovesText.y = (referenceBounds.height - textBounds.height)/2 - 20;


    /**
     * scoreNowText
     */
    referenceBounds = this.barBg.getBounds();
    textBounds = this.scoreNowText.getBounds();
    this.scoreNowText.x = this.barBg.x + referenceBounds.width - textBounds.width;
    this.scoreNowText.y = 75 - textBounds.height;

    /**
     * scoreGoalText
     */
    referenceBounds = this.scoreGoalBg.getBounds();
    textBounds = this.scoreGoalText.getBounds();
    this.scoreGoalText.x = this.scoreGoalBg.x + (referenceBounds.width - textBounds.width)/2;
    this.scoreGoalText.y = this.scoreGoalBg.y + (referenceBounds.height - textBounds.height)/2 - 3;
	
};

TopBar.prototype.reset = function(scoreGoal, remainingMoves){
    this.remainingMovesText.text = remainingMoves;

    this.scoreGoalText.text = scoreGoal;

    this.scoreNowText.text = "0";
    
    this.setBar(0);

    this.repositionTexts();
};

TopBar.prototype.setRemainingMoves = function(value){
	this.remainingMovesText.text = value;
    this.repositionTexts();
};

TopBar.prototype.setScoreNow = function(value){
	this.scoreNowText.text = value;
    this.repositionTexts();
};

TopBar.prototype.setBar = function(percent){

    var barBounds = this.barColor.getBounds();

    this.barMask.clear();
    
    this.barMask.lineStyle(1, 0x000000, 1);
    this.barMask.beginFill(0x000000); 

    this.barMask.moveTo(this.barColor.x,this.barColor.y);
    this.barMask.lineTo(this.barColor.x + barBounds.width * percent, this.barColor.y);
    this.barMask.lineTo(this.barColor.x + barBounds.width * percent, this.barColor.y + barBounds.height);
    this.barMask.lineTo(this.barColor.x, this.barColor.y + barBounds.height);
    
    this.barMask.endFill();
};

