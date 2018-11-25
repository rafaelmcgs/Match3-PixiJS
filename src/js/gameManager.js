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
	
	this.renderer.render(this.stage);
	requestAnimationFrame(this.update.bind(this));
};
GameManager.prototype.resize = function(){
	//resize the canvas
	this.renderer.resize(window.innerWidth,window.innerHeight);
	
	//resize welcome elements
	this.mainTitle.resize();
	this.background.resize();	
	this.mainButton.resize();
	
	//resize others elements
	this.levelManager.resize();
	this.panelManager.resize();
	
};

GameManager.prototype.gameInit = function(){
	console.log("GameInit");
	
	//Create the objects
	this.levelManager.createObjects();
	this.panelManager.createObjects();
	this.background.create();	
	this.mainButton = new ButtonMain(this,this.openSceneLevelSelect);
	
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


GameManager.prototype.openSceneWelcome = function(){
	console.log("Open Welcome scene");
	this.stage.addChild(this.mainTitle);
	this.stage.addChild(this.mainButton);
};
GameManager.prototype.openSceneLevelSelect = function(){
	console.log("Open Level Select scene");
	
	
	
};