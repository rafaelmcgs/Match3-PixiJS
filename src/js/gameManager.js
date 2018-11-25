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
	
	//Create mainTitle
	this.mainTitle = new MainTitle();

	
	
	
	this.loader.start();
}


GameManager.prototype.update = function(){
	
};
GameManager.prototype.resize = function(){
	
	this.levelManager.resize();
	this.panelManager.resize();
	this.mainTitle.resize();
	
};

GameManager.prototype.gameInit = function(){
	console.log("GameInit");
	
	//Create the objects
	this.levelManager.createObjects();
	this.panelManager.createObjects();
	
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
	
	//Add animation to the renderer
	//requestAnimationFrame(this.update.bind(this));	
};