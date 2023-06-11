class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {

        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 
            loadingBar.fillStyle(0xFFFFFF, 1);                  
            loadingBar.fillRect(0, centerY, w * value, 5); 
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';


        this.load.atlas('dorothy', 'img/dorothy.png', 'img/dorothy.json');
        this.load.atlas('lion', 'img/lion.png', 'img/lion.json');
        this.load.atlas('tinman', 'img/tinman.png', 'img/tinman.json');
        this.load.atlas('dog', 'img/dog.png', 'img/dog.json');
        this.load.atlas('flyM', 'img/flyM.png', 'img/flyM.json');
        this.load.atlas('haha', 'img/flyM.png', 'img/haha.json');
        this.load.image('fragment', 'img/fragment.png');
        this.load.image('poppy', 'img/poppy.png');
        this.load.image('BKG', 'img/BKG.png');
        this.load.image('heart', 'img/heart.png');
        this.load.image('heartEM', 'img/heartEM.png');


        this.load.audio('beats', ['audio/cat.m4a']);
        this.load.audio('clang', ['audio/clang.m4a']);
        this.load.audio('death', ['audio/death.m4a']);
        this.load.audio('respawn', ['audio/heal.m4a']);
        this.load.audio('bark', ['audio/bark.ogg']);
        this.load.audio('explode', ['audio/explode.ogg']);
        this.load.audio('roar', ['audio/roar.ogg']);
        this.load.audio('blow', ['audio/blow.ogg']);


        this.load.bitmapFont('huh', 'font/huh.png', 'font/huh.xml');
    }

    create() {

        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }


        this.scene.start('titleScene');
    }
}