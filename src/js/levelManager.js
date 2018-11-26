function LevelManager(gameManager_){
    PIXI.Container.call(this);
    
	//variables to control the update
	this.activated = false;
	this.opened = false;
	
    this.gameManager = gameManager_;

    /**
     * match variables
     */
    this.remainingMoves = 0;
    this.scoreGoal = 0;
    this.scoreNow = 0;
    
    
	/**
	 *Panel elements
	 */
    this.buttonHome = null;

    this.topBar = null;

    this.board = null;

	
}
LevelManager.prototype = Object.create(PIXI.Container.prototype);

LevelManager.prototype.createObjects = function(){
    this.buttonHome = new ButtonHome(this.gameManager, this.gameManager.openPanelHome);
    this.addChild(this.buttonHome);

    this.topBar = new TopBar();
    this.addChild(this.topBar);

    this.board = new Board(this);
    this.addChild(this.board);


	
};
LevelManager.prototype.resize = function(){
    this.topBar.resize();
    this.buttonHome.resize();
    this.board.resize();
};

LevelManager.prototype.update = function(){
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
	}else{
        this.board.update();

    }
};


LevelManager.prototype.open = function(levelIndex){
	this.opened = true;
	this.activated = true;
	
    this.alpha = 0;

    var levels = levelsConfig;

    //save configs    
    this.remainingMoves = levels[levelIndex].moves;
    this.scoreGoal = levels[levelIndex].pointsGoal;
    this.scoreNow = 0;
    
    //Prepare the board
    this.board.reDraw(levels[levelIndex].board);
    this.board.populate();

    //prepare the topbar
    this.topBar.setScoreGoal(this.scoreGoal);
    this.topBar.setScoreNow(this.scoreNow);
    this.topBar.setBar(this.scoreNow/this.scoreGoal);
    this.topBar.setRemainingMoves(this.remainingMoves);
};

LevelManager.prototype.increaseScore = function(points){
    this.scoreNow += points;
    this.topBar.setScoreNow(this.scoreNow);
    this.topBar.setBar(this.scoreNow/this.scoreGoal);
};

LevelManager.prototype.decreaseMoves = function(){
    this.remainingMoves -=1;
    this.topBar.setRemainingMoves(this.remainingMoves);
};
LevelManager.prototype.increaseMoves = function(){
    this.remainingMoves +=1;
    this.topBar.setRemainingMoves(this.remainingMoves);
};
