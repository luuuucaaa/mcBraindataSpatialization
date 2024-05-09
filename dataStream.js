class DataStream {
    constructor(dataRaw) {
        this.data = dataRaw.getArray();
        console.log(this.data);
        this.dataFrame = {
            'theta': [0, 0, 0, 0, 0, 0], 'thetaPrev': [0, 0, 0, 0, 0, 0], 'thetaBuffer': [0, 0, 0, 0, 0, 0],
            'alpha': [0, 0, 0, 0, 0, 0], 'alphaPrev': [0, 0, 0, 0, 0, 0], 'alphaBuffer': [0, 0, 0, 0, 0, 0],
            'lobeta': [0, 0, 0, 0, 0, 0], 'lobetaPrev': [0, 0, 0, 0, 0, 0], 'lobetaBuffer': [0, 0, 0, 0, 0, 0],
            'hibeta': [0, 0, 0, 0, 0, 0], 'hibetaPrev': [0, 0, 0, 0, 0, 0], 'hibetaBuffer': [0, 0, 0, 0, 0, 0],
        }
        this.frameIndex = 0;
        this.frameThreshhold = map(samplerateSlider.value(), 0, 100, 60, 15);
        this.interpolationAmount = map(samplerateSlider.value(), 0, 100, 1/40, 1/4.5);
    }

    update() {
        this.updateParams();
        if (playing) {
            if (frameCount > this.frameThreshhold) {
                for (let i = 0; i < electrodes.length; i++) {
                this.dataFrame['thetaPrev'][i] = this.dataFrame['theta'][i];
                this.dataFrame['theta'][i] = this.data[this.frameIndex][0 + i];
                this.dataFrame['alphaPrev'][i] = this.dataFrame['alpha'][i];
                this.dataFrame['alpha'][i] = this.data[this.frameIndex][6 + i];
                this.dataFrame['lobetaPrev'][i] = this.dataFrame['lobeta'][i];
                this.dataFrame['lobeta'][i] = this.data[this.frameIndex][12 + i];
                this.dataFrame['hibetaPrev'][i] = this.dataFrame['hibeta'][i];
                this.dataFrame['hibeta'][i] = this.data[this.frameIndex][18 + i];
                }
                this.frameIndex += 1;
                if (this.frameIndex > this.data.length - 1) {
                    this.frameIndex = 0;
                    for (let i = 0; i < electrodes.length; i++) {
                        this.dataFrame['theta'][i] = 0;
                        this.dataFrame['alpha'][i] = 0;
                        this.dataFrame['lobeta'][i] = 0;
                        this.dataFrame['hibeta'][i] = 0;
                    }
                    play();
                }
                frameCount = 0;
            }
        }
    }

    getAlphaAndVolume(electrodeIndex, freqBand) {
        let out = lerp(
            this.dataFrame[freqBand + 'Buffer'][electrodeIndex],
            this.dataFrame[freqBand][electrodeIndex],
            this.interpolationAmount
        );
        this.dataFrame[freqBand + 'Buffer'][electrodeIndex] = out;
        return [map(out, 0, 100, 0, 255), pow(out, 4)/pow(100, 4)]
    }

    updateParams() {
        this.frameThreshhold = map(samplerateSlider.value(), 0, 100, 60, 15);
        this.interpolationAmount = map(samplerateSlider.value(), 0, 100, 1/40, 1/4.5);
    }
}