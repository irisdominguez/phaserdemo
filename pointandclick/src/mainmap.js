var mainMap = function(game){
    player = null;
    target = new Phaser.Point(160, 160);
}

mainMap.prototype = {
  	create: function(){
		var background = this.game.add.tileSprite(0,0,4320,900,"monkeybg");
		background.anchor.setTo(0,0);
        background.scale.setTo(this.game.height / background.height);

        this.game.world.setBounds(0, 0, background.width * background.scale.x,
                background.height * background.scale.y);

		player = this.game.add.sprite(160, 160, "miguy");
		player.anchor.setTo(0.5, 1.0);
        player.scale.setTo(0.5);
        this.game.camera.follow(player);

        // Interaction
        this.game.input.mouse.capture = true;
	},
    update: function(){
        if (this.game.input.activePointer.leftButton.isDown)
        {
            target = Phaser.Point.add(this.game.input.activePointer.positionDown, this.game.camera);
        }
        let playerPosition = new Phaser.Point(player.x, player.y);
        let delta = Phaser.Point.subtract(target, playerPosition);
        if (delta.getMagnitude() > 3.0)
        {
            delta = Phaser.Point.normalize(delta);
            delta.multiply(3.0, 3.0);
        }
        player.x += delta.x;
        player.y += delta.y;
        
    }
}
