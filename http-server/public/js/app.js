var game = new Phaser.Game(1000, 900, Phaser.AUTO, null, { preload: preload, create: create, update: update });

var text;
var counter = 0;
var hero;
var player;
var cursors;
var leftEmitter;
var bird;
var back;
var anim;
var gangsta;
var kirby;
var score = 0;
var dead = false;
var lives = 3;
var bullet, bullets, bulletTime = 0;

function preload() {
  // load sprite
  game.load.image('bullet', 'img/laser.png');
  game.load.image('spark', 'img/spark.png');
  game.load.image('ship', 'img/ship.png');
  game.load.image('back', 'img/space.jpg');
}


function create() {
  // set background;
  back = game.add.sprite(0, 0, "back");
  back.scale.set(1);
  // text 
  text = game.add.text(25, 25, 'SCORE: 0\nLIVES: 5 ', { fill: '#ffffff', align: "center" });
  text.fixedToCamera = true;
  // text.cameraOffset.setTo(100,100);
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // set world bounds
  game.world.setBounds(0,0,2000,900);
  game.camera.follow(player);

  // set player up
  player = game.add.sprite(200,300, 'ship', 1);
  player.scale.set(0.05);
  player.smoothed = false;
  player.anchor.set(0.5,0.5);
  
  // camera
  game.camera.follow(player);
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;
  console.log(player);

  // set keys to listen to
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
 
  // set bullets up
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

 for (var i = 0; i < 20; i++) {
   var b = bullets.create(0, 0, 'bullet');
   b.name = 'bullet' + i;
   b.scale.set(.2)
   b.exists = false;
   b.visible = false;
   b.checkWorldBounds = true;
   b.events.onOutOfBounds.add(resetBullet, this);
 }

  // set emitter up
  leftEmitter = game.add.emitter(game.world.centerX, 0);
  leftEmitter.bounce.setTo(1, 1);
  leftEmitter.setXSpeed(-400, 400);
  leftEmitter.setYSpeed(-500, 500);
  leftEmitter.makeParticles('spark', 5000, 1000, 10, true);
  leftEmitter.start(false, 10000, 500);
}



function update () {
  if (lives < 0) {
    gameover();
  } else {

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        player.body.angularVelocity = -400;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        player.body.angularVelocity = 400;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        game.physics.arcade.velocityFromAngle(player.angle, 500, player.body.velocity);
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        fireBullet();
    }
    game.physics.arcade.collide(player, leftEmitter, loseLife, null, this);
    game.physics.arcade.overlap(bullets, leftEmitter, scoreAPoint, null, this);
  }
}

function scoreAPoint(player, spark ){
  spark.destroy();
  score++;
  text.text = 'SCORE: ' + score + '\nLIVES: ' + lives;
}

function loseLife () {
  if (!dead) {
    dead = true;
    lives--;
    player.reset(200,300);
    text.text = 'SCORE: ' + score + '\nLIVES: ' + lives;
    setTimeout(function() {
      dead = false;
    },2000);
  }
};

function gameover () {
  player.kill();
  text.text = 'GameOver';
  // leftEmitter.destroy();
}

function fireBullet () {
  if (game.time.now > bulletTime) {
    bullet = bullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(player.x + 6, player.y - 8);
      game.physics.arcade.velocityFromAngle(player.angle, 800, bullet.body.velocity);
      bulletTime = game.time.now + 150;
    }
  }
}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
    bullet.kill();
}
