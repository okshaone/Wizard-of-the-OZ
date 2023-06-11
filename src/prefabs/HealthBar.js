class HealthBar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        let heart1 = scene.physics.add.sprite(this.x, this.y, 'heart').setOrigin(0.5);
        let heart2 = scene.physics.add.sprite(this.x + 50, this.y, 'heart').setOrigin(0.5);
        let heart3 = scene.physics.add.sprite(this.x + 100, this.y, 'heartEM').setOrigin(0.5);
        this.hearts = [heart1, heart2, heart3];

        this.heartCount = 2;
    }

    getHearts(){
        return this.heartCount;
    }

    getEmptyHeart() {
        // return the sprite of the next empty heart in the health bar
        return this.hearts[this.heartCount];
    }

    update() {
        
    }
    
    takeHit(){
        //console.log(this.heartCount);
        //console.log(this.hearts);
        this.heartCount = this.heartCount - 1;
        this.hearts[this.heartCount].setTexture('heartEM');
        //console.log(this.hearts[0]);
    }

    giveLife() {
        this.heartCount = this.heartCount + 1;
        if(this.heartCount >= 4) {
            this.heartCount = 3;
        }
        this.hearts[this.heartCount-1].setTexture('heart');
    }
}