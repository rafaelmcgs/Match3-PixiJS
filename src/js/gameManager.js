function GameManager(){
	
	this.loader = new Loader(this,this.gameInit);
	
	
	/**
	 *Html and PixiJS
	 */
	this.gameDiv = document.getElementById("gameDiv");
	
	//The canvas element will be created with this script
	this.canvas = document.createElement( 'canvas' );
	
	//The root game container
	this.stage = new PIXI.Container();
	this.stage.interactive = true;
	
	this.renderer; //will be initialized later
	
	
	//Create the levelManager
	this.levelManager = new LevelManager(this);
	
	//Create panelManager
	this.panelManager = new PanelManager(this);
	
	//Create welcome scene elements 
	this.mainTitle = new MainTitle();
	this.background = new Background();
	
	//Declare start btn	
	this.mainButton = null;	
	
	//Start the loader
	this.loader.start();
}


GameManager.prototype.update = function(){
	this.panelManager.update();
	this.levelManager.update();
	
	this.renderer.render(this.stage);
	requestAnimationFrame(this.update.bind(this));
};

GameManager.prototype.resize = function(){
	//Resize the canvas
	this.renderer.resize(window.innerWidth,window.innerHeight);
	
	//Resize welcome elements
	this.mainTitle.resize();
	this.background.resize();	
	this.mainButton.resize();
	
	//Resize others elements
	this.levelManager.resize();
	this.panelManager.resize();
	
};

GameManager.prototype.gameInit = function(){
	console.log("GameInit");
	
	//Create the objects
	this.levelManager.createObjects();
	this.panelManager.createObjects();
	this.background.create();	
	this.mainButton = new ButtonMain(this,this.mainButtonAction);
	
	//Add the canvas to the document
	this.gameDiv.appendChild(this.canvas);		
	
	//Initialize the renderer 
	this.renderer = new PIXI.WebGLRenderer(
			window.innerWidth,
			window.innerHeight,
			{view:this.canvas,
			antialias:true,
			forceFXAA:true,
			powerPreference : 'high-performance'}
	);
	
	//Resize is very important in html5 responsive games	
	window.addEventListener('resize', this.resize.bind(this));
	
	//Insert the background into stage
	this.stage.addChild(this.background);
	
	//Show welcome scene
	this.openSceneWelcome();
	
	//Add animation to the renderer
	requestAnimationFrame(this.update.bind(this));
};

GameManager.prototype.mainButtonAction = function(){
	this.stage.removeChild(this.mainTitle);
	this.stage.removeChild(this.mainButton);
	
	this.openSceneLevelSelect();
	
};


/**
 * Scenes Init
 */
GameManager.prototype.openSceneWelcome = function(){
	console.log("Open Welcome scene");
	this.stage.addChild(this.mainTitle);
	this.stage.addChild(this.mainButton);
};
GameManager.prototype.openSceneLevelSelect = function(){
	console.log("Open Level Select scene");
	
	this.panelManager.open("levelSelect");
	this.stage.addChild(this.panelManager);
};
GameManager.prototype.openSceneMatch = function(levelIndex){
	console.log("Open Match scene");

	this.levelManager.open(levelIndex);
	this.stage.addChild(this.levelManager);
};


/**
 * Global specific panel functions
 */
GameManager.prototype.openPanelHome = function(){
	if(this.levelManager.lockEvents){
		return;
	}
	console.log("Open Home Panel");
	this.panelManager.open("home");
	this.stage.addChild(this.panelManager);
	this.levelManager.lockEvents = true;
};
GameManager.prototype.openPanelScore = function(options){
	console.log("Open score Panel");
	this.panelManager.open("score",options);
	this.stage.addChild(this.panelManager);
	this.levelManager.lockEvents = true;
};
GameManager.prototype.removePanel = function(){
	console.log("Level Select scene was removed");
	this.stage.removeChild(this.panelManager);
	this.levelManager.lockEvents = false;
	
};


GameManager.prototype.closeLevel = function(){
	this.levelManager.close();
};
GameManager.prototype.removeLevel = function(){
	console.log("Level Select scene was removed");
	this.stage.removeChild(this.levelManager);
	
};