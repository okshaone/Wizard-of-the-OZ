class Lion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene = scene;

        var graphics = this.scene.add.graphics();
        this.graphics = graphics;

        scene.add.existing(this);
        this.isFiring = false;
        this.isResetting = false;
        this.isActive = false;
        this.heartDelay = 20;
        this.moveSpeed = 9;

        //this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        //this.sfxMissed = scene.sound.add('sfx_missed');
        this.dorothyOffsetX = -150;
        this.dorothyOffsetY = -30;
    }

    fireHeart() {
        this.isFiring = true;
        // create a spirte and throw it to dorthy
        this.scene.sound.play('roar', { volume: 0.5 });   

    }
    
    activate() {
        this.isActive = true;
    }

    roarRadiusContains(x, y) {
        // roar radius can't contain anything if lion isn't roaring
        if(this.isFiring == false) {
            return false;
        }

        // calculate roar radius
        let frac = -this.heartDelay/150; // 1 to 50
        let screenWidth = config.width;
        let radius = screenWidth*frac;

        // calculate lions distance to x,y using pythagorean theorem (a^2+b^2=c^2)
        let dx = this.x - x;
        let dy = this.y - y;
        // square root of dx^2 + dy^2 is hypotenuse (distance) between boy and lion
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist <= radius) {
            return true;
        }

        return false;
    }

    update() {
        if(this.isActive == false) {
            return; // do nothing if not yet active
        }

        this.heartDelay -= 1;

        // note: "firing" is while he is giving you a heart
        // "resetting" is when he is charging up for the next heart
        // does not move when firing
        if (this.isFiring) {
            // play the give a heart animation
            if(this.heartDelay < -150) {
                // if 150 ticks pass since heart animation, start resetting
                this.isFiring = false;
                this.isResetting = true;
                this.heartDelay = 2000; // how long until the next heart
                this.graphics.clear();
            }
            else {
                //this.scene.healthBar
                // delay is somewhere between -150 and 0
                // it ends at -150
                // heart position is a fraction 1/150th * counter
                // of the position between tinman and heart canister
                let frac = -this.heartDelay/150; // 1 to 50
                let screenWidth = config.width;

                let radius = screenWidth*frac;

                 // Set the fill color and alpha (transparency) of the circle
                var fillColor = 0xff0000; // Red
                var fillAlpha = 0.5; // 50% transparency

                // Set the line style for the circle border
                var lineWidth = 2;
                var lineColor = 0xffffff; // white

                this.graphics.clear();

                this.graphics.lineStyle(lineWidth, lineColor);
                this.graphics.fillStyle(fillColor, fillAlpha);
                this.graphics.beginPath();
                this.graphics.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
                this.graphics.closePath();
                this.graphics.fill();
                this.graphics.stroke();


        

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

        }
    }

    reset() {
        this.isFiring = false;
        this.isResetting = true;
        //this.y = game.config.height - borderUISize - borderPadding;
    }

}