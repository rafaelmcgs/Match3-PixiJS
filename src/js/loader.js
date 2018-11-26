function Loader(gameManager_, onCompleteCallBack_){
	this.pixiLoader = PIXI.loader;
	
	this.gameManager = gameManager_;
	this.onCompleteCallback = onCompleteCallBack_;
	
	/**
	 *Important variables to control % progress
	*/
	this.resourceCount = 0;
	this.resourcesLoaded = 0;
	
	
	this.addResourcesToLoad();
	
	
}


Loader.prototype.addResourcesToLoad = function(){
	var i;
	var resource;
	var name;
	
	//get resources list
	var list = toLoad;
	
	//add dragonbones
	for(i=0; i<list.dragonBones.length;i++){
		resource = list.dragonBones[i];
		
		//extrac name from resource path
		name = resource.substr(resource.lastIndexOf('/') + 1);
		//add the dragonBones files
		this.pixiLoader.add("dB-"+name+"-bonesData", resource+"_ske.dbbin", { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
		this.pixiLoader.add("dB-"+name+"-textureData", resource+"_tex.json");
		this.pixiLoader.add("dB-"+name+"-textureImg", resource+"_tex.png");
		
		this.resourceCount += 3;
	}
	
	//add spriteSheet
	for(i=0; i<list.spriteSheets.length;i++){
		
		resource = list.spriteSheets[i];
		
		//extrac name from resource path
		name = resource.substr(resource.lastIndexOf('/') + 1);
		
		this.pixiLoader.add("sprite-"+name+"-textureData", resource+".json");
		
		this.resourceCount += 2;
		
	}
	
	//add images
	for(i=0; i<list.images.length;i++){
		
		resource = list.images[i];
		
		//extrac name from resource path
		name = resource.substr(resource.lastIndexOf('/') + 1);
		
		this.pixiLoader.add("img-"+name, resource);
		
		this.resourceCount += 1;		
	}
	
	//add sounds
	for(i=0; i<list.sounds.length;i++){
		
		resource = list.sounds[i];
		
		//extrac name from resource path
		name = resource.substr(resource.lastIndexOf('/') + 1);
		
		this.pixiLoader.add("sound-"+name, resource+".{mp3,ogg}");	
		
		this.resourceCount += 1;	
		
	}
	
};

Loader.prototype.start = function(){
	//Setup the callback function to loader when it is completed
	this.pixiLoader.load(this.onComplete.bind(this));
	
	
	//Setup the callback function when each file is completed
	this.pixiLoader.onLoad.add(this.onFileLoad.bind(this));
	
	console.log("Loader started:"+this.resourceCount+" files");
};

Loader.prototype.onFileLoad = function(){
	//increase the counter
	this.resourcesLoaded += 1;
	
	//get % of progress
	var percent = this.resourcesLoaded/this.resourceCount;
	//get the css value, where 0% = -1400 and 100%=0
	var cssValue = -1400 + (1400 * percent);
	
	//get the svg "path" element
	var logoEl = document.getElementsByClassName("cls-1")[0];
	
	//modify the logo style to redraw the stroke
	logoEl.style = "stroke-dashoffset: "+cssValue+"px";
	
};

Loader.prototype.onComplete = function(){	
	console.log("Loader completed:"+this.resourceCount+"/"+this.resourcesLoaded+" files");
	
	//get the svg "path" element
	var logoEl = document.getElementsByClassName("cls-1")[0];
	
	//modify the logo style to fill
	logoEl.style = "stroke-dashoffset: 0px;fill:#FFF";
	
	//modify the body css to make the preloader disappear
	var bodyEl = document.getElementById("gazeusGame");
	bodyEl.className = "gameStarted";
	
	setTimeout(this.onCompleteCallback.bind(this.gameManager),2000);
};
