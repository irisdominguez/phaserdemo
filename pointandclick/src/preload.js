var preload = function(game){}

preload.prototype = {
	preload: function(){ 
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
		this.game.load.image("monkeybg","assets/monkeybg.jpg");
		this.game.load.image("miguy","assets/miguy.gif");
	},
  	create: function(){
		this.game.state.start("MainMap");
	}
}
