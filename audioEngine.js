function initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    // audioCtx.destination.channelInterpretation = 'discrete';
    audioCtx.destination.channelCount = audioCtx.destination.maxChannelCount;
    console.log(audioCtx.destination);
    audioEngine = new AudioEngine();
}

class AudioEngine {
    constructor() {
        this.createGainNodes();
    }

    createGainNodes() {
        this.gainNodes = [];
        this.offbeatGainNodes = [];
        for (let i = 0; i < 4; i++) {
            this.gainNodes.push([]);
            this.offbeatGainNodes.push([]);
            for (let j = 0; j < 6; j++) {
                let gain1 = audioCtx.createGain();
                gain1.gain.value = 0.5;
                this.gainNodes[i].push(gain1);

                let gain2 = audioCtx.createGain();
                gain2.gain.value = 0.5;
                this.offbeatGainNodes[i].push(gain2);
            }
        }
    }

    startSoundset() {
        if (currentSoundsetName == 'luca') {
            for (let j = 0; j < 6; j++) {
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/theta-monoloop.wav', this.gainNodes[0][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/alpha-monoloop.wav', this.gainNodes[1][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/lobeta-monoloop.wav', this.gainNodes[2][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/hibeta-monoloop.wav', this.gainNodes[3][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/theta-monoloop-offbeat.wav', this.offbeatGainNodes[0][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/alpha-monoloop-offbeat.wav', this.offbeatGainNodes[1][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/lobeta-monoloop-offbeat.wav', this.offbeatGainNodes[2][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/hibeta-monoloop-offbeat.wav', this.offbeatGainNodes[3][j], j);
            }
        } else {
            for (let j = 0; j < 6; j++) {
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/theta-monoloop.wav', this.gainNodes[0][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/alpha-monoloop.wav', this.gainNodes[1][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/lobeta-monoloop.wav', this.gainNodes[2][j], j);
                startMultichannelAudioStream('./assets/soundsets/' + currentSoundsetName + '/hibeta-monoloop.wav', this.gainNodes[3][j], j);
            }
        }
    }

    stopSoundset() {
        for (let i = 0; i < audioBuffers.length; i++) {
            audioBuffers[i].stop(0);
        }
        audioBuffers = [];
    }
}

function startMultichannelAudioStream(filepath, gainNode, outputChannel) {
    let source = audioCtx.createBufferSource();
    let outputBufferSource;
    let request = new XMLHttpRequest();
    request.open('GET', filepath, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      let audioData = request.response;
      audioCtx.decodeAudioData(audioData, function(buffer) {
            source.buffer = buffer;
            outputBuffer = audioCtx.createBuffer(audioCtx.destination.channelCount - 2, source.buffer.length, audioCtx.sampleRate);
            source.buffer.copyFromChannel(outputBuffer.getChannelData(outputChannel), 0);
            outputBufferSource = audioCtx.createBufferSource();
            outputBufferSource.buffer = outputBuffer;
            outputBufferSource.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            outputBufferSource.loop = true;
            outputBufferSource.start();
            audioBuffers.push(outputBufferSource);
        },
        function(e) { console.log("Error with decoding audio data: " + e.err); });
    }
    request.send();
}