var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser', {
   preload: preload,
   create: create,
   update: update,
   render: render
});

var background;
var ian;
var gabos;
var cursors;
var timeCounter = 0;
var gaboSound;
var gameEnded;

var GABO_COUNT = 13;

function preload() {
   game.load.image('bg', 'media/bg_small.jpg');
   game.load.image('ian', 'media/ian_small_trans.png');
   game.load.image('gabo', 'media/gabo_small_trans.png');
   game.load.audio('gaboSound', 'media/gabo.wav');
};

function create() {
   game.physics.startSystem(Phaser.Physics.P2JS);
   game.physics.p2.setImpactEvents(true);

   game.physics.p2.restitution = 1.05;

   var playerCollisionGroup = game.physics.p2.createCollisionGroup();
   var gaboCollisionGroup = game.physics.p2.createCollisionGroup();
   game.physics.p2.updateBoundsCollisionGroup();

   background = game.add.tileSprite(0, 0, 800, 600, 'bg');
   background.fixedToCamera = true;

   addGabos(playerCollisionGroup, gaboCollisionGroup);
   addIan(playerCollisionGroup, gaboCollisionGroup);

   addTimerText();

   cursors = game.input.keyboard.createCursorKeys();

   game.time.events.loop(Phaser.Timer.SECOND, updateTimeCounter, this);

   gaboSound = game.add.audio('gaboSound');
   gaboSound.addMarker('gaboSound', 0, 1.0);
}

function update() {
   ian.body.setZeroVelocity();

   if (!gameEnded) {
      if (cursors.left.isDown) {
         ian.body.moveLeft(200);
      } else if (cursors.right.isDown) {
         ian.body.moveRight(200);
      }

      if (cursors.up.isDown) {
         ian.body.moveUp(200);
      } else if (cursors.down.isDown) {
         ian.body.moveDown(200);
      }
      // if (!game.camera.atLimit.x) {
      //    background.tilePosition.x += (ian.body.velocity.x * 16) * game.time.physicsElapsed;
      // }
      //
      // if (!game.camera.atLimit.y) {
      //    background.tilePosition.y += (ian.body.velocity.y * 16) * game.time.physicsElapsed;
      // }
   }
}

function render() {}



function addGabos(playerCollisionGroup, gaboCollisionGroup) {
   gabos = game.add.group();
   gabos.enableBody = true;
   gabos.physicsBodyType = Phaser.Physics.P2JS;

   for (var iGabo = 0; iGabo < GABO_COUNT; iGabo++) {
      var aGabo = gabos.create(game.world.randomX, gaboRandomY(), 'gabo');

      aGabo.body.setRectangle(40, 40);

      aGabo.body.setCollisionGroup(gaboCollisionGroup);
      aGabo.body.collides([gaboCollisionGroup, playerCollisionGroup]);

      aGabo.body.velocity.x = gaboRandomVelocity();
      aGabo.body.velocity.y = gaboRandomVelocity();

      aGabo.body.damping = 0;
      aGabo.body.angularDamping = 0;
   }
}

function addIan(playerCollisionGroup, gaboCollisionGroup) {
   ian = game.add.sprite(game.world.centerX, 50, 'ian');
   game.physics.p2.enable(ian, false);
   ian.body.setCircle(28);
   ian.body.fixedRotation = true;
   ian.body.setCollisionGroup(playerCollisionGroup);
   ian.body.collides(gaboCollisionGroup, hitGabo, this);
}

function addTimerText() {
   timerText = game.add.text(100, 100, '0', {
      font: "70px Arial",
      fill: "#8a2be2",
      align: "center"
   });
   timerText.anchor.setTo(0.5, 0.5);
}

function gaboRandomVelocity() {
   var inital = 130;
   var factor = 1;
   return (inital + (Math.floor(Math.random() * factor))) * (Math.random() > 0.5 ? 1 : -1);
};

function gaboRandomY() {
   var top = 100;
   var bottom = game.world.getBounds().bottom;
   return ((Math.floor(Math.random() * (bottom - top)) + top));
};

function hitGabo(body1, body2) {
   gaboSound.play('gaboSound');
   pauseAll();
}

function updateTimeCounter() {
   if (!gameEnded) {
      timeCounter++;
      timerText.setText(timeCounter);
   }
}

function pauseAll() {
   for (var iGabo = 0; iGabo < gabos.countLiving(); iGabo++) {
      var aGabo = gabos.getAt(iGabo);
      aGabo.body.setZeroVelocity();
      aGabo.body.setZeroRotation();
   }
   gameEnded = true;
}
