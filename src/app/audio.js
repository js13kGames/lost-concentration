let _audioContext = window.hasOwnProperty('AudioContext') ? new window.AudioContext() : null;

export default {

	// correct()
	correct() {
		let mGain = _audioContext.createGain();
		let mOsc = _audioContext.createOscillator();
		let nTime = _audioContext.currentTime;

		mGain.gain.value = 1;
		mGain.gain.linearRampToValueAtTime(0, nTime + 0.2);
		mGain.connect(_audioContext.destination);

		mOsc.frequency.value = 300;
		mOsc.type = 'triangle';

		mOsc.connect(mGain);
		mOsc.start(0);
		mOsc.stop(nTime + 0.2);
	},


	// incorrect()
	// ...
	incorrect() {
		let mGain1 = _audioContext.createGain();
		let mGain2 = _audioContext.createGain();
		let mOsc1 = _audioContext.createOscillator();
		let mOsc2 = _audioContext.createOscillator();
		let nTime = _audioContext.currentTime;

		mGain1.gain.value = 0.1;
		mGain2.gain.value = 0.1;

		mOsc1.frequency.value = 200;
		mOsc1.type = 'sawtooth';

		mOsc2.frequency.value = 100;
		mOsc2.type = 'square';

		mOsc1.connect(mGain1);
		mGain1.connect(_audioContext.destination);
		mOsc1.start(0);
		mOsc1.stop(nTime + 0.2);

		mOsc2.connect(mGain2);
		mGain2.connect(_audioContext.destination);
		mOsc2.start(0);		
		mOsc2.stop(nTime + 0.2);
	}
	

}