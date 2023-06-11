
'use strict';


let config = {

    parent: 'myGame',
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {

            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Load, Title, Play, GameOver ]
}


let game = new Phaser.Game(config);

let rightX = game.config.width;
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let threeQuarterX = game.config.width*3/4;
let w = game.config.width;
let h = game.config.height;
const textSpacer = 64;
let dorothy = null;
const dorothyWidth = 16;
const dorothyHeight = 50;
const dorothyAcceleration = 250;
const flyMWidth = 16;
const flyMHeight = 16;
const healthX = 20;
const healthY = 20;
let level;
let highScore;
let newHighScore = false;
let cursors;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
