var game = new Phaser.Game(1024,768,Phaser.AUTO,'game',{ preload: preload, create: create, update: update, render: render });

function preload () {
	game.load.image('background', 'assets/images/back1.png');
	game.load.image('ground1', 'assets/tilemaps/tiles/grassMid.png');
	game.load.image('platform', 'assets/tilemaps/tiles/platform.png');
	game.load.image('orb', 'assets/images/orb.png');
	game.load.tilemap('map', 'assets/tilemaps/maps/first.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.spritesheet('player', 'assets/images/player1.png', 80, 110, 24);
};

var map;
var layer;
var background;
var cursors;
var player;
//var facing = 'right';
var orb;

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
	orb = game.add.sprite(50, 50, 'orb');
	orb.scale.setTo(0.2, 0.2);
	
	game.physics.enable(player, Phaser.Physics.ARCADE);
	game.physics.enable(orb, Phaser.Physics.ARCADE);
	
	player.anchor.set(0.5,1);
	player.body.collideWorldBounds = true;
	player.body.gravity.y = 1500;
	
	player.animations.add('walk', [9, 10], 8, true);
	player.animations.add('idle', [0]);
	player.animations.add('jump', [1]);
    player.animations.add('fall', [2]);
	player.animations.add('duck', [3]);
	player.animations.add('sneak', [19,3], 8, true);
	
	player.facing = 'right';
	player.body.jumpPower = 1200;
	player.body.moveSpeed = 200;

	orb.body.collideWorldBounds = true;

	game.camera.follow(player);
	cursors = game.input.keyboard.createCursorKeys();
	
	player.update = function() {
		game.physics.arcade.collide(this, layer);

		if (cursors.left.isDown) {
			this.body.velocity.x = -this.body.moveSpeed;
			this.scale.x = -1;
			this.animations.play('walk');
			this.facing = 'left';		
		}
		else if (cursors.right.isDown) {
			this.body.velocity.x = this.body.moveSpeed;
			this.scale.x = 1;
			this.animations.play('walk');
			this.facing = 'right';
		}	
		else {
			this.body.velocity.x = 0;
			this.animations.play('idle');
			this.animations.stop();
			
			if (this.facing == 'left')
				this.scale.x = -1;
		}
		
		if (cursors.up.isDown) {
			if (this.body.onFloor())
				this.body.velocity.y = -this.body.jumpPower;
			this.animations.play('jump');
		}
		if (this.body.velocity.y < 0) {
			this.animations.play('jump');		
		}
		else if (this.body.velocity.y > 0 && !this.body.onFloor()) {
			this.animations.play ('fall');
		}
		
		if (cursors.down.isDown) {
			if (this.body.velocity.x != 0)
				this.animations.play('sneak');	
			else	
				this.animations.play ('duck');
		}
	};	

	orb.update = function() {
		game.physics.arcade.collide(this, layer);

		if (game.input.mousePointer.isDown) {
			game.physics.arcade.moveToPointer(this, 500);
		}
		if (this.body.onFloor())
			this.body.velocity.x *= 0.9;
	};
		
};

function update () {
	player.update();
	orb.update();
};

function render () {

};




