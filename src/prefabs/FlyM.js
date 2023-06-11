
class FlyM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene,  game.config.width + flyMWidth, Phaser.Math.Between(flyMHeight/2, game.config.height - flyMHeight/2), 'boy'); 
        
        this.parentScene = scene;   


        this.parentScene.add.existing(this);   
        this.parentScene.physics.add.existing(this);  

        this.anims.play('flap', true);
       
        
        this.setVelocityX(-velocity);           
        this.setImmovable();                    
        //this.tint = Math.random() * 0xFFFFFF;   
        this.newFlyM = true;
        this.velocityX = velocity;    
        this.velocityY = 0;       
        this.nonChaotic = true;

        this.alive = true;
    }



    update() {
        if(this.newFlyM && this.x < threeQuarterX) {
            this.parentScene.addFlyM();
            this.newFlyM = false;
        }

        if(this.nonChaotic && this.x < centerX) {
            this.velocityX = Phaser.Math.Between(-200, 200);
            this.velocityY = Phaser.Math.Between(20, 50);
            let invert = Phaser.Math.Between(10);
            if(invert < 5) {
                this.velocityY = -this.velocityY;
            }
            this.setVelocityX(-this.velocityX);
            this.setVelocityY(this.velocityY);

            this.nonChaotic = false;
        }

        if(this.y > h) {
            this.destroy();
        }
    }
 
    die(){
        this.anims.play('die', true);
        this.alive = false;
        this.setVelocityX(0);
        this.setVelocityY(0);

    }

    isAlive() {
        return this.alive;
    }
}