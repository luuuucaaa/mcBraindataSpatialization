class Electrode {
  constructor(posX, posY, coordX, coordY, diameter) {
    this.posX = posX;
    this.posY = posY;
    this.coordX = coordX;
    this.coordY = coordY;
    this.diameter = diameter;
    this.alphaTheta, this.alphaAlpha, this.alphaLobeta, this.alphaHibeta = 0, 0, 0, 0;
    this.rescale();
  }

  rescale() {
    this.posX = width/2 + (this.coordX * imgBrain.width * imgBrainScale);
    this.posY = height/2 + (this.coordY * imgBrain.height * imgBrainScale);
    this.diameter = imgBrain.width * imgBrain.height * imgBrainScale * 0.00007;  
  }

  display(playing) {
    this.playing = playing;
    if (this.playing) {
      noFill();
      // theta circle
      stroke(0, 122, 158, this.alphaTheta);
      strokeWeight(7);
      circle(this.posX, this.posY, this.diameter);
      // alpha circle
      stroke(177, 6, 58, this.alphaAlpha);
      strokeWeight(6);
      circle(this.posX, this.posY, this.diameter * 4);
      // lobeta circle
      stroke(221, 97, 8, this.alphaLobeta);
      strokeWeight(5);
      circle(this.posX, this.posY, this.diameter * 7);
      // hibeta circle
      stroke(246, 168, 0, this.alphaHibeta);
      strokeWeight(4);
      circle(this.posX, this.posY, this.diameter * 10);
    }
  }
}

function createElectrodes() {
  let electrodes = [];
  let coordinates = [[- 2.5/10, - 3/10], [2.5/10, - 3/10], [- 4/10, 0], [4/10, 0], [- 2.5/10, 3/10], [2.5/10, 3/10]];
  for (let i = 0; i < 6; i++) {
    electrodes[i] = new Electrode(windowWidth * coordinates[i][0], windowHeight * coordinates[i][1], coordinates[i][0], coordinates[i][1], 45);
  }
  return electrodes;
}

function rescaleElectrodes() {
  for (let e of electrodes) {
    e.rescale();
  }
}

function displayElectrodes(playing) {
  for (let e of electrodes) {
    e.display(playing);
  }
}