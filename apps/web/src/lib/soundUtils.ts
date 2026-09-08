/**
 * TIỆN ÍCH ÂM THANH CHUÔNG XOAY TÂY TẠNG NGUYÊN BẢN (W3C Web Audio API)
 * Tạo âm hưởng chuông đồng vật lý: Fundamental 432Hz + Tỉ lệ Shimmer Overtone 2.714x (1172.4Hz)
 */

let audioCtx: AudioContext | null = null;

export const playTibetanBowlChime = (duration: number = 4.5): void => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Filter đồng ấm Lowpass 2400Hz
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.connect(audioCtx.destination);

    // Layer 1: Fundamental warm bronze bell (432Hz)
    const fundOsc = audioCtx.createOscillator();
    fundOsc.type = 'sine';
    fundOsc.frequency.setValueAtTime(432, now);

    const fundGain = audioCtx.createGain();
    fundGain.gain.setValueAtTime(0.32, now);
    fundGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    fundOsc.connect(fundGain);
    fundGain.connect(filter);
    fundOsc.start(now);
    fundOsc.stop(now + duration);

    // Layer 2: Shimmering crystal overtone (1172.4Hz - tỉ lệ 2.714x)
    const overtoneOsc = audioCtx.createOscillator();
    overtoneOsc.type = 'sine';
    overtoneOsc.frequency.setValueAtTime(1172.4, now);

    const overtoneGain = audioCtx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.85);

    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(filter);
    overtoneOsc.start(now);
    overtoneOsc.stop(now + duration * 0.85);
  } catch {
    // Graceful fallback if Web Audio is blocked or unsupported
  }
};
