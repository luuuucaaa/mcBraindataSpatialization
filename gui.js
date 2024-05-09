function createMyButton(text, width, posX, posY, func) {
    let button = createButton(text);
    button.style('width', width);
    button.position(posX, posY);
    button.mousePressed(func);
    return button;
}

function createButtons() {
    startStopButton = createMyButton('Start/Stop', '130px', 15, 15, function() { play(); });
    fullscreenButton = createMyButton('Fullscreen', '130px', 15, 45, function() { enterFullscreen(); });
    muteThetaButton = createMyButton('Theta', '130px', 15, 120, function() { mutingTheta = toggle(mutingTheta); });
    muteAlphaButton = createMyButton('Alpha', '130px', 15, 150, function() { mutingAlpha = toggle(mutingAlpha); });
    muteLobetaButton = createMyButton('Lobeta', '130px', 15, 180, function() { mutingLobeta = toggle(mutingLobeta); });
    muteHibetaButton = createMyButton('Hibeta', '130px', 15, 210, function() { mutingHibeta = toggle(mutingHibeta); });
    soundset1Button = createMyButton('Soundset 1', '130px', 15, 285, function() { [playingSoundset1, playingSoundset2, playingSoundset3, playingSoundset4] = toggleExclusive(playingSoundset1, playingSoundset2, playingSoundset3, playingSoundset4, 'tim'); });
    soundset2Button = createMyButton('Soundset 2', '130px', 15, 315, function() { [playingSoundset2, playingSoundset1, playingSoundset3, playingSoundset4] = toggleExclusive(playingSoundset2, playingSoundset1, playingSoundset3, playingSoundset4, 'luca'); });
    soundset3Button = createMyButton('Soundset 3', '130px', 15, 345, function() { [playingSoundset3, playingSoundset1, playingSoundset2, playingSoundset4] = toggleExclusive(playingSoundset3, playingSoundset1, playingSoundset2, playingSoundset4, 'philipp'); });
    soundset4Button = createMyButton('Soundset 4', '130px', 15, 375, function() { [playingSoundset4, playingSoundset1, playingSoundset2, playingSoundset3] = toggleExclusive(playingSoundset4, playingSoundset1, playingSoundset2, playingSoundset3, 'tim'); });
}
  
function createSliders() {
    samplerateSlider = createSlider(0, 100, 50);
    samplerateSlider.position(202, 15);
    samplerateSlider.style('width', '100px');
}

function enterFullscreen() {
    windowResized();
    let fs = fullscreen();
    fullscreen(!fs);
}

function play() {
    if (audioInitialized) {
        if (!playing) {
            playing = true;
            audioEngine.startSoundset('tim');
        } else {
            playing = false;
            audioEngine.stopSoundset('tim');
        }
    }
}

function toggle(value) {
  if (!value) {
    value = true;
  } else {
    value = false;
  }
  return value;
}

function toggleExclusive(value, other1, other2, other3, soundsetNameToActivate) {
    audioEngine.stopSoundset();
    value = true;
    other1 = false;
    other2 = false;
    other3 = false;
    currentSoundsetName = soundsetNameToActivate;
    if (playing) {
        audioEngine.startSoundset();
    }
    return [value, other1, other2, other3];
}

function displayLEDs() {
    noFill();
    if (!mutingTheta) {
        // theta circle on
        stroke(0, 122, 158); strokeWeight(5); circle(155, 80, 104);
    } else {
        // theta circle off
        stroke(0, 122, 158, 90); strokeWeight(3); circle(155, 80, 104);
    }

    if (!mutingAlpha) {
        // alpha circle on
        stroke(177, 6, 58); strokeWeight(5); circle(155, 80, 164);
    } else {
        // alpha circle off
        stroke(177, 6, 58, 90); strokeWeight(3); circle(155, 80, 164);
    }

    if (!mutingLobeta) {
        // lobeta circle on
        stroke(221, 97, 8); strokeWeight(5); circle(155, 80, 224);
    } else {
        // lobeta circle off
        stroke(221, 97, 8, 90); strokeWeight(3); circle(155, 80, 224);
    }

    if (!mutingHibeta) {
        // hibeta circle on
        stroke(246, 168, 0); strokeWeight(5); circle(155, 80, 284);
    } else {
        // hibeta circle off
        stroke(246, 168, 0, 90); strokeWeight(3); circle(155, 80, 284);
    }

    if (playingSoundset1) {
        // soundset1 on
        stroke(0, 122, 158); strokeWeight(5); line(155, 297, 170, 297);
    } else {
        // soundset1 off
        stroke(0, 122, 158, 90); strokeWeight(3); line(155, 297, 170, 297);
    }

    if (playingSoundset2) {
        // soundset2 on
        stroke(0, 122, 158); strokeWeight(5); line(155, 327, 170, 327);
    } else {
        // soundset2 off
        stroke(0, 122, 158, 90); strokeWeight(3); line(155, 327, 170, 327);
    }

    if (playingSoundset3) {
        // soundset3 on
        stroke(0, 122, 158); strokeWeight(5); line(155, 357, 170, 357);
    } else {
        // soundset3 off
        stroke(0, 122, 158, 90); strokeWeight(3); line(155, 357, 170, 357);
    }

    if (playingSoundset4) {
        // soundset4 on
        stroke(0, 122, 158); strokeWeight(5); line(155, 387, 170, 387);
    } else {
        // soundset4 off
        stroke(0, 122, 158, 90); strokeWeight(3); line(155, 387, 170, 387);
    }

    // black square left
    noStroke(); fill(0); rect(0, 0, 155, 650);
    // black square above
    rect(0, 0, 350, 80);

    textSize(16);
    textFont(font);
    fill(255, 255, 255);
    text('slow', 157, 31);
    text('fast', 316, 31);
}