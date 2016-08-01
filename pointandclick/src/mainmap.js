var mainMap = function(game){
    player = null;
    current = 1;
    target = 1;
    path = [];
    pathdelta = 0.0;
    leveldata = null;
}

mainMap.prototype = {
    preload: function(){
        this.load.text('mainlevel', 'assets/data/pathbg.json');
    },
  	create: function(){
        // Level data
        leveldata = JSON.parse(game.cache.getText('mainlevel'));
        for (let wpi in leveldata.nodes)
        {
            let wp = leveldata.nodes[wpi];
            wp.x = wp.x * 480 / 400; 
            wp.y = wp.y * 480 / 400; 
        }
        astarPreProcess(leveldata);
        console.log(leveldata);

		var background = game.add.tileSprite(0,0,1920,400,"pathbg");
		background.anchor.setTo(0,0);
        background.scale.setTo(game.height / background.height);

        game.world.setBounds(0, 0, background.width * background.scale.x,
                background.height * background.scale.y);

		player = game.add.sprite(0, 0, "miguy");
		player.anchor.setTo(0.5, 1.0);
        player.scale.setTo(0.5);
        player.x = leveldata.nodes[1].x;
        player.y = leveldata.nodes[1].y;
        game.camera.follow(player);

        // Interaction
        game.input.mouse.capture = true;
	},
    update: function(){
        this.updatePath();
        if (path.length > 0)
        {
            let increment = 1.0 / 30;
            pathdelta += increment;

            if (pathdelta >= 1.0)
            {
                current = path[0];
                path.shift();
                pathdelta = 0.0;
            }
        }

        if (path.length > 0)
        {
            let next = path[0];
            let nextPoint = leveldata.nodes[next];
            let currentPoint = leveldata.nodes[current];

            let newPosition = {};
            newPosition.x = currentPoint.x * (1.0 - pathdelta) + nextPoint.x * pathdelta;
            newPosition.y = currentPoint.y * (1.0 - pathdelta) + nextPoint.y * pathdelta;

            player.x = newPosition.x;
            player.y = newPosition.y;
        }
    },
    updatePath: function(){
        let oldTarget = target;
        this.updateTarget();

        if (oldTarget != target)
        {
            let astarRet = findPath(leveldata, current, target);
            path = astarRet.path;
            path.shift();
        }
    },
    updateTarget: function(){
        if (game.input.activePointer.leftButton.isDown)
        {
            let mousePosition = Phaser.Point.add(game.input.activePointer.positionDown, game.camera);
            target = this.closerPoint(mousePosition.x, mousePosition.y);
        }
    },
    closerPoint: function(x, y){
        let point = new Phaser.Point(x, y);
        let wpi;
        let best = 0;
        let minDist = null;
        for (wpi in leveldata.nodes)
        {
            let wp = leveldata.nodes[wpi];
            let wpPoint = new Phaser.Point(wp.x, wp.y);
            let distance = wpPoint.distance(point);
            if (minDist == null || distance < minDist)
            {
                best = wpi;
                minDist = distance;
            }
        }
        return best;
    }
}
