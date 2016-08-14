var mainMap = function(game){
    player = null;
    current = 1;
    target = 1;
    path = [];
    pathdelta = 0.0;
    leveldata = null;

    tmp_distance = {};
}

function range(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
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

		this.backgroundz2 = game.add.tileSprite(0,0,1920,400,"pathbg-z2");
		this.backgroundz2.anchor.setTo(0,0);
        this.backgroundz2.scale.setTo(game.height / this.backgroundz2.height);

		var background = game.add.tileSprite(0,0,1920,400,"pathbg");
		background.anchor.setTo(0,0);
        background.scale.setTo(game.height / background.height);

        game.world.setBounds(0, 0, background.width * background.scale.x,
                background.height * background.scale.y);

		player = game.add.sprite(0, 0, "professor");
		player.anchor.setTo(0.5, 1.0);
        player.scale.setTo(1.5);
        player.x = leveldata.nodes[1].x;
        player.y = leveldata.nodes[1].y;
        game.camera.follow(player);
        player.animations.add('north', range(0, 8), 10, true);
        player.animations.add('west', range(9, 17), 10, true);
        player.animations.add('south', range(18, 26), 10, true);
        player.animations.add('east', range(27, 35), 10, true);

        // Interaction
        game.input.mouse.capture = true;
	},
    update: function(){
        this.updatePath();
        this.updateDistance();
        if (path.length > 0)
        {
            if (pathdelta == 0.0)
            {
                let a = tmp_distance.a;
                console.log(a);
                if (-45 < a && a <= 45)
                {
                    player.play('east');
                }
                else if (-135 < a && a <= -45)
                {
                    player.play('north');
                }
                else if (45 < a && a <= 135)
                {
                    player.play('south');
                }
                else
                {
                    player.play('west');
                }
            }

            let increment = 1.0 / 30;
            increment /= tmp_distance.d / 200;
            pathdelta += increment;

            if (pathdelta >= 1.0)
            {
                current = path[0];
                path.shift();
                pathdelta = 0.0;

                if (path.length == 0)
                {
                    player.animations.stop();
                }
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
        this.backgroundz2.x = game.camera.x * 0.5;
    },
    updatePath: function(){
        let oldTarget = target;
        this.updateTarget();

        if (oldTarget != target)
        {
            let astarRet = findPath(leveldata, current, target);
            if (path.length === 0)
            {
                path = astarRet.path;
                path.shift();
            }
            else
            {
                let from = current;
                let to = path[0];
                path = astarRet.path;
                if (to == path[1])
                {
                    path.shift();
                }
                else
                {
                    current = to;
                    pathdelta = 1.0 - pathdelta;
                }
            }
        }
    },
    updateTarget: function(){
        if (game.input.activePointer.isDown)
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
    },
    updateDistance: function(){
        if (path.length == 0)
        {
            tmp_distance = {};
        }
        else
        {
            if(tmp_distance.current !== current ||
                tmp_distance.next !== path[0])
            {
                tmp_distance.current === current;
                tmp_distance.next === path[0];
                let p1 = new Phaser.Point(
                        leveldata.nodes[current].x,
                        leveldata.nodes[current].y);
                let p2 = new Phaser.Point(
                        leveldata.nodes[path[0]].x,
                        leveldata.nodes[path[0]].y);
                tmp_distance.d = p1.distance(p2);
                tmp_distance.a = p1.angle(p2, true);
                console.log(tmp_distance.a);
            }
        }
    }
}
