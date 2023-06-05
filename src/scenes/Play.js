class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {

    const background = this.add.image(0, 0, 'BKG').setOrigin(0, 0);
        

        this.boySpeed = 400;
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


        let line = new Phaser.Geom.Line(w, 0, w, h);


        this.particleManager = this.add.particles('poppy');
        

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

        this.boyGroup = this.add.group({
            runChildUpdate: true   
        });

        this.time.delayedCall(20, () => { 
            this.addBoy();
        });


        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });


        cursors = this.input.keyboard.createCursorKeys();
    }


    addBoy() {
        let speedVariance =  Phaser.Math.Between(0, 50);
        let flyM = new FlyM(this, this.boySpeed - speedVariance);

        this.boyGroup.add(flyM);
    }

    update() {

        if(!dorothy.destroyed) {
           
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

            this.physics.world.collide(dorothy, this.boyGroup, this.dorothyCollision, null, this);
        }
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

