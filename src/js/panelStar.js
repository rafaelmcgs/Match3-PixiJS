function Star(manager_){
    PIXI.Container.call(this);

    this.opened = false;

    this.background = new PIXI.Sprite(PIXI.Texture.fromFrame('panelCircle.png'));
    this.star = new PIXI.Sprite(PIXI.Texture.fromFrame('star.png'));

    this.addChild(this.background);
    this.addChild(this.star);

    var bgBounds = this.background.getLocalBounds();
    var starBounds = this.star.getLocalBounds();

    this.star.x = (bgBounds.width - starBounds.width) / 2;
    this.star.y = (bgBounds.width - starBounds.width) / 2;

    this.scale.x = this.scale.y = 0.7;
    this.star.alpha = 0;
    
}

Star.prototype = Object.create(PIXI.Container.prototype);

Star.prototype.showStar = function(bool_){
    if(bool_){
        this.star.alpha = 1;

    }else{
        this.star.alpha = 0;

    }
};