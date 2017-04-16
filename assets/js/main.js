
var game = new Phaser.Game(1024,768,Phaser.AUTO,'game',{ preload: preload, create: create, update: update, render: render });


function preload () {
	game.load.image('background', 'assets/images/back1.png');
	game.load.tilemap('map', 'assets/tilemaps/maps/first.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('ground1', 'assets/tilemaps/tiles/grassMid.png');
	game.load.image('platform', 'assets/tilemaps/tiles/platform.png');
	game.load.spritesheet('player', 'assets/images/player1.png', 80, 110, 24);
};

var map;
var layer;
var background;
var cursors;
var player;
var facing = 'right';

function create () {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	background = game.add.image(0, 0, 'background');
	background.fixedToCamera = true;
	
	game.physics.arcade.gravity.y = 250;
	
	map = game.add.tilemap('map');
	map.addTilesetImage('ground1');
	map.addTilesetImage('platform');
	map.setCollisionBetween(1,30);
	
	layer = map.createLayer('Tile Layer 1'); 

	layer.resizeWorld();
	
	player = game.add.sprite(100, 600, 'player');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
	player.anchor.set(0.5,1);
	player.body.collideWorldBounds = true;
	player.body.gravity.y = 1500;
	
	
	player.animations.add('walk', [9, 10], 8, true);
	player.animations.add('idle', [0]);
	player.animations.add('jump', [1]);
    player.animations.add('fall', [2]);
	player.animations.add('duck', [3]);
	player.animations.add('sneak', [19,3], 8, true);
	game.camera.follow(player);
	cursors = game.input.keyboard.createCursorKeys();
	
	player.update = function() {
		game.physics.arcade.collide(player, layer);

		if (cursors.left.isDown) {
			player.body.velocity.x = -200;
			player.scale.x = -1;
			player.animations.play('walk');
			facing = 'left';		
		}
				
		else if (cursors.right.isDown) {
			player.body.velocity.x = 200;
			player.scale.x = 1;
			player.animations.play('walk');
			facing = 'right';
		}	
		else {
			player.body.velocity.x = 0;
			player.animations.play('idle');
			player.animations.stop();
			
			if (facing == 'left')
				player.scale.x = -1;
			
		}
		
		if (cursors.up.isDown) {
			if (player.body.onFloor())
				player.body.velocity.y = -1200;
				player.animations.play('jump');
		}
		if (player.body.velocity.y < 0) {
				player.animations.play('jump');		
		}
		else if (player.body.velocity.y > 0 && !player.body.onFloor()) {
				player.animations.play ('fall');
		}
		
		if (cursors.down.isDown) {
			if (player.body.velocity.x != 0)
				player.animations.play('sneak');	
			else	
				player.animations.play ('duck');
		}
	
		
};	
	
	
	
};

function update () {
	player.update();

};


function render () {
};




