function JellyPool(){
	this.jellys = {
        1:[],
        2:[],
        3:[],
        4:[],
        5:[]
    };

    for(var i =0;i<90;i++){
        this.addJelly(1,i);
        this.addJelly(2,i);
        this.addJelly(3,i);
        this.addJelly(4,i);
        this.addJelly(5,i);
    }
}
JellyPool.prototype.addJelly = function(type,id){
	var jelly = new Jelly(type,id);
	this.jellys[type].push(jelly);
};

JellyPool.prototype.borrow = function(type){
	return this.jellys[type].shift();
};
JellyPool.prototype.return = function(jelly){
	this.jellys[jelly.type].push(jelly);
};