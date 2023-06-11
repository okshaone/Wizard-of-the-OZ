class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene = scene;

        scene.add.existing(this);
        this.isFiring = false;
        this.isResetting = false;
        this.moveSpeed = 9;

        //this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        //this.sfxMissed = scene.sound.add('sfx_missed');
        this.dorothyOffsetX = -50;
        this.dorothyOffsetY = -30;
    }

    fireRocket() {
        if(this.isResetting == false) {
            this.isFiring = true;
            this.scene.sound.play('bark', { volume: 0.5 });   
        }
    }
    
    update() {
        if (this.isFiring) {
            this.x += this.moveSpeed;
            if (this.x > rightX) {
                //this.sfxMissed.play();
                this.reset();
            }
        }
        else {
            let changeX = true;
            if(this.x < dorothy.x + this.dorothyOffsetX - 10) {
                this.x += this.moveSpeed;
            }
            else if(this.x > dorothy.x + this.dorothyOffsetX + 10) {
                this.x -= this.moveSpeed;
            }
            else {
                changeX = false;
            }
            
            let changeY = true;
            if(this.y < dorothy.y + this.dorothyOffsetY - 10) {
                this.y += this.moveSpeed;
            }
            else if(this.y > dorothy.y + this.dorothyOffsetY + 10) {
                this.y -= this.moveSpeed;
            }
            else {
                changeY = false;
            }

            // it was resetting but it didn't have to move
            // means it's found dorothy, ready to fire again
            if(changeX == false && changeY == false && this.isResetting) {
                this.isResetting = false;
            }
        }
    }

    reset() {
        this.isFiring = false;
        this.isResetting = true;
        //this.y = game.config.height - borderUISize - borderPadding;
    }

}