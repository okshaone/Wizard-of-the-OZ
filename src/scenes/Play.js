class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        console.log("Version 0.05b");
        const background = this.add.image(0, 0, 'BKG').setOrigin(0, 0);
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'dog').setOrigin(0.5, 0);
        this.time.delayedCall(1000, () => {
            this.p1Rocket.anims.play('doggo', true);
        });

        this.tinman = new Tinman(this, -100, game.config.height/2, 'tinman').setOrigin(0.5, 0);
        this.time.delayedCall(1000, () => {
            this.tinman.anims.play('riceball', true);
        });

        this.lion = new Lion(this, -100, game.config.height/2, 'lion').setOrigin(0.5, 0);
        this.time.delayedCall(2000, () => {
            this.lion.anims.play('ramen', true);
        });

        this.boySpeed = 40;
        this.boySpeedMax = 1000;
        level = 0;
        this.extremeMODE = false;
        this.shadowLock = false;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 185
          }

        this.timeSurvived = this.add.text(borderUISize , borderUISize , level, scoreConfig);

        this.bgm = this.sound.add('beats', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        this.time.delayedCall(20, () => { 
            if (this.textures.exists('titlesnapshot')) {
                let titleSnap = this.add.image(centerX, centerY, 'titlesnapshot').setOrigin(0.5);
                this.tweens.add({
                    targets: titleSnap,
                    duration: 1500,
                    alpha: { from: 1, to: 0 },
                    scale: { from: 1, to: 4 },
                    repeat: 0
                });
                
            } else {
                console.log('texture error');
            }
        });


        this.particleManager = this.add.particles('poppy');

        let line = new Phaser.Geom.Line(w, 0, w, h);
        this.lineEmitter = this.particleManager.createEmitter({
            speedX: { min: -500, max: -150 },
            speedY: { min: 50, max: 100 },
            gravityY: 0,
            lifespan: 5000,
            alpha: { start: 0.5, end: 0.3 },
            tint: [ 0xffff00, 0xff0000, 0x00ff00, 0x00ffff, 0x0000ff ],
            emitZone: { type: 'random', source: line, quantity: 10 },
            blendMode: 'normal',
            frequency: 300 
        });

        let line2 = new Phaser.Geom.Line(0, 0, w, 0);
        this.lineEmitter2 = this.particleManager.createEmitter({
            speedX: { min: -500, max: -150 },
            speedY: { min: 50, max: 100 },
            gravityY: 0,
            lifespan: 5000,
            alpha: { start: 0.5, end: 0.3 },
            tint: [ 0xffff00, 0xff0000, 0x00ff00, 0x00ffff, 0x0000ff ],
            emitZone: { type: 'random', source: line2, quantity: 10 },
            blendMode: 'normal',
            frequency: 300 
        });
        
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('dorothy', {
              prefix: 'walk',
              start: 1,
              end: 3,
              zeroPad: 2
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNames('flyM', {
              prefix: 'fly',
              start: 1,
              end: 3,
              zeroPad: 2
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNames('haha', {
              prefix: 'flyMD',
              start: 1,
              end: 3,
              zeroPad: 2
            }),
            frameRate: 5,
            repeat: 0
        });        
        
        this.anims.create({
            key: 'doggo',
            frames: this.anims.generateFrameNames('dog', {
              prefix: 'dogWalk',
              start: 1,
              end: 3,
              zeroPad: 2
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'riceball',
            frames: this.anims.generateFrameNames('tinman', {
              prefix: 'wow',
              start: 1,
              end: 3,
              zeroPad: 2
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'ramen',
            frames: this.anims.generateFrameNames('lion', {
              prefix: 'meow',
              start: 1,
              end: 3,
              zeroPad: 2
            }),
            frameRate: 5,
            repeat: -1
        });
        
        dorothy = this.physics.add.sprite(centerX, h - 100, 'dorothy').setOrigin(0.5);
        dorothy.setCollideWorldBounds(true);
        dorothy.setBounce(0.5);
        dorothy.setImmovable();
        dorothy.setMaxVelocity(325, 325);
        //dorothy.setDragX(0);
        //dorothy.setDragY(0);
        dorothy.setDepth(1);
        dorothy.destroyed = false;
        dorothy.setBlendMode('SCREEN');
        dorothy.anims.play('run', true);
        dorothy.setBlendMode(Phaser.BlendModes.NORMAL);

        this.healthBar = new HealthBar(this, healthX, healthY);


        this.boyGroup = this.add.group({
            runChildUpdate: true   
        });

        // main timer, make a moneky every 4 seconds
        const timer = this.time.addEvent({
            delay: 4000, // Delay in milliseconds (4 seconds)
            loop: true, // Set to true to repeat the timer indefinitely
            callback: this.addFlyM,
            callbackScope: this
        });

        // secondary timer... after 30 seconds, make another monkey every 3 seconds
        this.time.delayedCall(30000, () => {
            const timer2 = this.time.addEvent({
                delay: 3000, // Delay in milliseconds (4 seconds)
                loop: true, // Set to true to repeat the timer indefinitely
                callback: this.addFlyM,
                callbackScope: this
            });
        });



        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        this.time.delayedCall(10000, () => {
            this.tinman.activate();
        });

        this.time.delayedCall(20000, () => {
            this.lion.activate();
        });

        cursors = this.input.keyboard.createCursorKeys();
    }


    addFlyM() {
        let speedVariance =  Phaser.Math.Between(0, 20);
        let flyM = new FlyM(this, this.boySpeed + speedVariance);

        this.boyGroup.add(flyM);
    }

    update() {

        if(!dorothy.destroyed) {
            //Phaser.keyboard.input.isJustDown
           
            if(cursors.space.isDown) {
                this.p1Rocket.fireRocket();
            }

            if(cursors.left.isDown) {
                dorothy.body.velocity.x -= dorothyAcceleration;
            }
            else if(cursors.right.isDown) {
                dorothy.body.velocity.x += dorothyAcceleration;
            }
            else {
                dorothy.body.velocity.x *= 0.53;
            }

            if(cursors.up.isDown) {
                dorothy.body.velocity.y -= dorothyAcceleration;
            }
            else if(cursors.down.isDown) {
                dorothy.body.velocity.y += dorothyAcceleration;
            }
            else {
                dorothy.body.velocity.y *= 0.53;
            }

            if(dorothy.body.velocity.x >= -5 && dorothy.body.velocity.x <= 5) {
                dorothy.body.velocity.x = 0;
            }
            if(dorothy.body.velocity.y >= -5 && dorothy.body.velocity.y <= 5) {
                dorothy.body.velocity.y = 0;
            }

            //console.log(dorothy.body.velocity.x);

            this.p1Rocket.update();
            this.tinman.update();
            this.lion.update();

            // check if dog rocket has collided with a boy, if so, kill it
            for(let i=0;i<this.boyGroup.getChildren().length;i++) {
                let nextBoy = this.boyGroup.getChildren()[i];
                if (this.checkCollision(this.p1Rocket, nextBoy)) {
                    this.p1Rocket.reset();
                    this.shipExplode(nextBoy);

                    break; // (can't collide twice)
                }
            }
            
            // check if boy is within lion roar radius, if so, kill it
            for(let i=0;i<this.boyGroup.getChildren().length;i++) {
                let nextBoy = this.boyGroup.getChildren()[i];
                if(this.lion.roarRadiusContains(nextBoy.x, nextBoy.y)) {
                    this.shipExplode(nextBoy);

                    break; // (can't collide twice, will catch one per frame max)
                }
            }

            // check if dorothy collided with a boy, if so, kill it AND hurt dorothy
            for(let i=0;i<this.boyGroup.getChildren().length;i++) {
                let nextBoy = this.boyGroup.getChildren()[i];
                if (nextBoy.isAlive() && this.checkCollision(dorothy, nextBoy)) {
                    this.shipExplode(nextBoy);
                    this.dorothyCollision();
                }
            }
        }
    }

    checkCollision(partyMember, boy) {
        // simple AABB checking
        if (partyMember.x < boy.x + boy.width &&
            partyMember.x + partyMember.width > boy.x &&
            partyMember.y < boy.y + boy.height &&
            partyMember.height + partyMember.y > boy.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship

        ship.die();
        this.sound.play('blow', { volume: 0.5 });  
        this.boyGroup.remove(ship); 
        this.time.delayedCall(600, () => { 
            ship.setAlpha(0);
        });

        //this.sound.play('sfx_explosion');
    }
    
    levelBump() {

        level++;
        this.timeSurvived.text = "survived " + level + "s";
 
        if(level % 5 == 0) {
            this.sound.play('clang', { volume: 0.5 });       
            if(this.boySpeed <= this.boySpeedMax) {    
                this.boySpeed += 25;
                this.bgm.rate += 0.01;                         
            }
            
 

            let rndColor = this.getRandomColor();
            document.getElementsByTagName('canvas')[0].style.borderColor = rndColor;

 
            this.cameras.main.shake(100, 0.01);
        }

    }


    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]; 
        }
        return color;
    }

    dorothyCollision() {
        this.healthBar.takeHit();
        if (this.healthBar.getHearts() != 0){
            return;
        }






        dorothy.destroyed = true;                   
        this.difficultyTimer.destroy();           
        this.sound.play('death', { volume: 0.25 });
        this.cameras.main.shake(2500, 0.0075);     

        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });


        let deathParticleManager = this.add.particles('poppy');
        let deathEmitter = deathParticleManager.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: { min: 150, max: 500 },
            lifespan: 4000,
            blendMode: 'normal'
        });

  
        let pBounds = dorothy.getBounds();
        deathEmitter.setEmitZone({
            source: new Phaser.Geom.Rectangle(pBounds.x, pBounds.y, pBounds.width, pBounds.height),
            type: 'edge',
            quantity: 1000
        });


        deathEmitter.explode(1000);
        

        deathParticleManager.createGravityWell({
            x: pBounds.centerX,
            y: pBounds.centerY - 200,
            power: 0.5,
            epsilon: 100,
            gravity: 100
        });

        deathParticleManager.createGravityWell({
            x: centerX,
            y: centerY,
            power: 2,
            epsilon: 100,
            gravity: 150
        });

        dorothy.destroy();    


        this.time.delayedCall(4000, () => { this.scene.start('gameOverScene'); });
    }
}

