
class FlyM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene,  game.config.width + boyWidth, Phaser.Math.Between(boyHeight/2, game.config.height - boyHeight/2), 'boy'); 
        
        this.parentScene = scene;              


        this.parentScene.add.existing(this);   
        this.parentScene.physics.add.existing(this);  

        this.anims.play('flap', true);
        
        
        this.setVelocityX(-velocity);           
        this.setImmovable();                    
        this.tint = Math.random() * 0xFFFFFF;   
        this.newBoy = true;             
    }

    update() {

        if(this.newBoy && this.y > centerY) {

            this.parentScene.addBoy();
            this.newBoy = false;
        }

        if(this.y > h) {
            this.destroy();
        }
    }
}