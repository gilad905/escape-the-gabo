
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('bg', 'images/bg_small.jpg');
    game.load.image('ian', 'images/ian_small_trans.png');
    game.load.image('gabo', 'images/gabo_small_trans.png');
    //  game.load.spritesheet('ian', 'assets/sprites/humstar.png', 32, 32);
   //  game.load.image('sweet', 'assets/sprites/spinObj_06.png');
}

var ian;
var background;
var cursors;
var counter = 0;
var gabos;
// var timer;

function create() {

    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);

   //  game.physics.p2.gravity.y = 100;
   //  game.physics.p2.restitution = 1.2;
    game.physics.p2.restitution = 1;

    //  Create our collision groups. One for the player, one for the gabos
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var gaboCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

    background = game.add.tileSprite(0, 0, 800, 600, 'bg');
    background.fixedToCamera = true;

    gabos = game.add.group();
    gabos.enableBody = true;
    gabos.physicsBodyType = Phaser.Physics.P2JS;

    var gaboCount = 13;

    for (var i = 0; i < gaboCount; i++)
    {
        var gabo = gabos.create(game.world.randomX, game.world.randomY, 'gabo');
        gabo.body.setRectangle(40, 40);

        //  Tell the gabo to use the gaboCollisionGroup
        gabo.body.setCollisionGroup(gaboCollisionGroup);

        //  Gabos will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        gabo.body.collides([gaboCollisionGroup, playerCollisionGroup]);

      //   gabo.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
        var randomGaboVelocity = function() {
           var inital = 130
           var factor = 1;
           return (inital + (Math.random() * factor)) * (Math.random() > 0.5 ? 1 : -1);
        }

        gabo.body.velocity.x = randomGaboVelocity();
        gabo.body.velocity.y = randomGaboVelocity();

        gabo.body.damping = 0;
        gabo.body.angularDamping = 0;
    }

    //  Create our ian sprite
    ian = game.add.sprite(200, 200, 'ian');
   //  ian.scale.set(2);
   //  ian.smoothed = false;
   //  ian.animations.add('fly', [0,1,2,3,4,5], 10, true);
   //  ian.play('fly');

    game.physics.p2.enable(ian, false);
    ian.body.setCircle(28);
    ian.body.fixedRotation = true;

    //  Set the ians collision group
    ian.body.setCollisionGroup(playerCollisionGroup);

    //  The ian will collide with the gabos, and when it strikes one the hitGabo callback will fire, causing it to alpha out a bit
    //  When gabos collide with each other, nothing happens to them.
    ian.body.collides(gaboCollisionGroup, hitGabo, this);

    game.camera.follow(ian);

    cursors = game.input.keyboard.createCursorKeys();

    text = game.add.text(100, 100, '0', { font: "70px Arial", fill: "#8a2be2", align: "center" });
text.anchor.setTo(0.5, 0.5);
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

   //  timer = game.time.create(false);
   //  timer.add(60 * 1000, endGame, this);
   //  timer.start();

   // restartTimer = game.time.create(false);
   //   restartTimer.add(2 * 1000, restartGame, this);

   //   gamePaused = false;
   // game.input.keyboard.onDownCallback = function(e) {
   //       if (e.keyCode == 13) {
   //          game.state.restart();
   //          create();
   //       }
   // }
}

var gamePaused;

function updateCounter() {

    counter++;
   //  if (!gamePaused)
      text.setText(counter);

}

var restartTimer;

function hitGabo(body1, body2) {

    //  body1 is the space ian (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our gabo
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
   //   restartTimer.add(2 * 1000, game.state.restart, this);
   //   restartTimer.start();
   //   pauseAll();
   game.paused = true;
}

function pauseAll() {
   for (var i = 0; i < gabos.countLiving(); i++) {
      var aGabo = gabos.getAt(i);
      aGabo.body.velocity.x = 0;
      aGabo.body.velocity.y = 0;
      aGabo.setZeroVelocity();
   }
   gamePaused = true;
}

function update() {

    ian.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
        ian.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
        ian.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
        ian.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        ian.body.moveDown(200);
    }

    if (!game.camera.atLimit.x)
    {
        background.tilePosition.x += (ian.body.velocity.x * 16) * game.time.physicsElapsed;
    }

    if (!game.camera.atLimit.y)
    {
        background.tilePosition.y += (ian.body.velocity.y * 16) * game.time.physicsElapsed;
    }

}

function render() {

   // game.debug.text('Don\'t collide!', 32, 32);
   // game.debug.text(timer.seconds.toFixed(0), 32, 32);
   //  game.debug.text('Don\'t collide with the Gabos!', 32, 32);

}
