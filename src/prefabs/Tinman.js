class Tinman extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene = scene;

        scene.add.existing(this);
        this.isFiring = false;
        this.isResetting = false;
        this.isActive = false;
        this.heartDelay = 20;
        this.moveSpeed = 9;

        //this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        //this.sfxMissed = scene.sound.add('sfx_missed');
        this.dorothyOffsetX = -100;
        this.dorothyOffsetY = -30;

        this.takeMyEnergy = scene.physics.add.sprite(this.x, this.y-10, 'heart').setOrigin(0.5);
        this.takeMyEnergy.alpha = 0;
    }

    fireHeart() {
        this.isFiring = true;
        this.takeMyEnergy.alpha = 1;
        // create a spirte and throw it to dorthy

        this.scene.sound.play('respawn', { volume: 0.5 });   
    }
    
    activate() {
        this.isActive = true;
    }

    update() {
        if(this.isActive == false) {
            return; // do nothing if not yet active
        }

        // if user has less than 3 hearts, timer proceeds as normal
        if(this.scene.healthBar.getHearts(0) < 3) {
            this.heartDelay -= 1;
        }
        else if(this.heartDelay > 50 || this.heartDelay <= 0) {
            // if user has 3 hearts, timer should count down to 50 and stop
            this.heartDelay -= 1;
        }
        else {
            // if counter is 1 to 50 and user has 3 hearts, lock it at 50
            this.heartDelay = 50; 
        }

        // note: "firing" is while he is giving you a heart
        // "resetting" is when he is charging up for the next heart
        // does not move when firing
        if (this.isFiring) {
            // play the give a heart animation
            if(this.heartDelay < -150) {
                // if 150 ticks pass since heart animation, start resetting
                this.scene.healthBar.giveLife();
                this.isFiring = false;
                this.isResetting = true;
                this.heartDelay = 1500; // how long until the next heart
                this.takeMyEnergy.alpha = 0;
            }
            else {
                //this.scene.healthBar
                // delay is somewhere between -150 and 0
                // it ends at -150
                // heart position is a fraction 1/150th * counter
                // of the position between tinman and heart canister
                let target = this.scene.healthBar.getEmptyHeart();
                let tX = target.x;
                let tY = target.y;
                let sX = this.x;
                let sY = this.y;
                let frac = -this.heartDelay; // 1 to 50
                let dx = sX - tX;
                let dy = sY - tY;
                let curX = sX - dx*frac/150.0;
                let curY = sY - dy*frac/150.0;


                this.takeMyEnergy.x = curX;
                this.takeMyEnergy.y = curY;
            }
        }
        else {
            // if heart delay reaches zero, fire the heart
            if(this.heartDelay < 0) {
                this.isFiring = true;
                this.isResetting = false;
                this.fireHeart();
            }

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

            this.takeMyEnergy.x = this.x;
            this.takeMyEnergy.y = this.y - 10;

        }
    }

    reset() {
        this.isFiring = false;
        this.isResetting = true;
        //this.y = game.config.height - borderUISize - borderPadding;
    }

}