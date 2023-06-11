class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        if (localStorage.getItem('hiscore') == null) {
            localStorage.setItem('hiscore', '0');
        }

        let storedScore = parseInt(localStorage.getItem('hiscore'));

        if(level > storedScore) {
            localStorage.setItem('hiscore', level.toString());
            highScore = level;
            newHighScore = true;
        } else {
            highScore = parseInt(localStorage.getItem('hiscore'));
            newHighScore = false;
        }

        if(newHighScore) {
            this.add.bitmapText(centerX, centerY - textSpacer, 'huh', 'New Hi-Score!', 32).setOrigin(0.5);
        }
        this.add.bitmapText(centerX, 0 + textSpacer, 'huh', `Dorothy survived ${level}s under the Monkeies' invasion`, 20).setOrigin(0.5);
        this.add.bitmapText(centerX, 0 + textSpacer*2.5, 'huh', `The best score was achieve by SCARECROW `, 24).setOrigin(0.5);
        this.add.bitmapText(centerX, 0 + textSpacer*3.5, 'huh', `and it was ${highScore}s`, 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*2, 'huh', `Press UP ARROW to Restart`, 36).setOrigin(0.5);
        this.addThreat();


        cursors = this.input.keyboard.createCursorKeys();
    }
   
    addThreat() {
        let flyM = new FlyM(this, 0 );
        flyM.x = centerX;
        flyM.y = centerY + 45;
        let flyM2 = new FlyM(this, 0 );
        flyM2.x = centerX + 60;
        flyM2.y = centerY;
        let flyM3 = new FlyM(this, 0 );
        flyM3.x = centerX - 60;
        flyM3.y = centerY - 20;
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            let textureManager = this.textures;

            this.game.renderer.snapshot((snapshotImage) => {
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                textureManager.addImage('titlesnapshot', snapshotImage);
            });

            this.sound.play('respawn', { volume: 0.5 });
            this.scene.start('playScene');
        }
    }
}