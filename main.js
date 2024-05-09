// assets
let dataRaw;
let imgHpi, imgHpiScale, imgBrain, imgBrainScale;

// gui
let font;
let startStopButton, samplerateSlider;
let playing = false;
let fullscreenButton;
let muteAlphaButton, muteHibetaButton, muteLobetaButton, muteThetaButton;
var mutingTheta = false, mutingHibeta = false, mutingLobeta = false, mutingAlpha = false;
let soundset1Button, soundset2Button, soundset3Button;
var playingSoundset1 = true, playingSoundset2 = false, playingSoundset3 = false, playingSoundset4 = false;

// rest
let audioInitialized = false;
let thetaAudio, alphaAudio, lobetaAudio, hibetaAudio;
let audioCtx, audioEngine;
let audioBuffers = [];
let datastream, electrodes;
let currentSoundsetName = 'tim';


document.addEventListener('click', () => {
    if (!audioInitialized) {
        initAudio();
        audioInitialized = true;
        console.log('audio initialized');
    }
});

function preload() {
    dataRaw = loadTable('./assets/data.csv', 'csv', 'header');
    imgHpi = loadImage('./assets/hpilogo.png');
    imgBrain = loadImage('./assets/brain3d.png');
    font = loadFont('./assets/SourceCodePro-Medium.ttf')
}

function setup() {
    createCanvas(constrain(windowWidth, 1200, displayWidth), constrain(windowHeight, 600, displayHeight));
    imgBrainScale = 0.00095 * constrain(windowHeight, 600, displayHeight);
    imgHpiScale = 0.2;
    imageMode(CENTER);
    frameRate(30);
    createButtons();
    createSliders();
    datastream = new DataStream(dataRaw);
    electrodes = createElectrodes();
}

function windowResized() {
    resizeCanvas(constrain(windowWidth, 1200, displayWidth), constrain(windowHeight, 600, displayHeight));
    imgBrainScale = 0.00095 * constrain(windowHeight, 600, displayHeight);
    imgHpiScale = 0.2;
    // rescaleElectrodes();
}

function draw() {
    background(0);
    image(imgBrain, width/2, height/2, imgBrainScale * imgBrain.width, imgBrainScale * imgBrain.height);
    image(imgHpi, width - 160, 90, imgHpiScale * imgHpi.width, imgHpiScale * imgHpi.height);
    displayLEDs();
    displayElectrodes(playing);
    datastream.update();
    rescaleElectrodes();

    if (audioInitialized) {

        for (let i = 0; i < electrodes.length; i++) {
            let theta = datastream.getAlphaAndVolume(i, 'theta');
            let alpha = datastream.getAlphaAndVolume(i, 'alpha');
            let lobeta = datastream.getAlphaAndVolume(i, 'lobeta');
            let hibeta = datastream.getAlphaAndVolume(i, 'hibeta');

            if (mutingTheta) {
                audioEngine.gainNodes[0][i].gain.value = 0;
                audioEngine.offbeatGainNodes[0][i].gain.value = 0;
                electrodes[i].alphaTheta = 0;
            } else {
                audioEngine.gainNodes[0][i].gain.value = theta[1];
                audioEngine.offbeatGainNodes[0][i].gain.value = ((theta[1] < 0.6) ? 0.0 : theta[1] - 0.1);
                electrodes[i].alphaTheta = theta[0];
            }

            if (mutingAlpha) {
                audioEngine.gainNodes[1][i].gain.value = 0;
                audioEngine.offbeatGainNodes[1][i].gain.value = 0;
                electrodes[i].alphaAlpha = 0;
            } else {
                audioEngine.gainNodes[1][i].gain.value = alpha[1];
                audioEngine.offbeatGainNodes[1][i].gain.value = ((alpha[1] < 0.6) ? 0.0 : alpha[1] - 0.1);;
                electrodes[i].alphaAlpha = alpha[0];
            }

            if (mutingLobeta) {
                audioEngine.gainNodes[2][i].gain.value = 0;
                audioEngine.offbeatGainNodes[2][i].gain.value = 0;
                electrodes[i].alphaLobeta = 0;
            } else {
                audioEngine.gainNodes[2][i].gain.value = lobeta[1];
                audioEngine.offbeatGainNodes[2][i].gain.value = ((lobeta[1] < 0.6) ? 0.0 : lobeta[1] - 0.1);;
                electrodes[i].alphaLobeta = lobeta[0];
            }

            if (mutingHibeta) {
                audioEngine.gainNodes[3][i].gain.value = 0;
                audioEngine.offbeatGainNodes[3][i].gain.value = 0;
                electrodes[i].alphaHibeta = 0;
            } else {
                audioEngine.gainNodes[3][i].gain.value = hibeta[1];
                audioEngine.offbeatGainNodes[3][i].gain.value = ((hibeta[1] < 0.6) ? 0.0 : hibeta[1] - 0.1);;
                electrodes[i].alphaHibeta = hibeta[0];
            }

            let mean = (theta[0] + alpha[0] + lobeta[0] + hibeta[0])/4;
            electrodes[i].diameter = map(mean, 0, 100, 1, 25);
        }

    }
}