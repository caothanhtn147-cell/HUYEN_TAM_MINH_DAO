'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Music, Play, Pause, Bell } from 'lucide-react';

interface FrequencyPreset {
  id: string;
  name: string;
  freq: number;
  desc: string;
  color: string;
  type: 'bowl' | 'zen' | 'solfeggio';
}

const FREQUENCIES: FrequencyPreset[] = [
  {
    id: '432-bowl',
    name: '432 Hz Chuông Xoay Tây Tạng',
    freq: 432,
    desc: 'Âm hưởng chuông đồng Tây Tạng, tĩnh tâm và buông xả tạp niệm',
    color: 'from-amber-400 to-amber-600',
    type: 'bowl',
  },
  {
    id: '528-zen',
    name: '528 Hz Thiền Thức Tỉnh',
    freq: 528,
    desc: 'Tần số tái tạo sinh khí & chữa lành tế bào sâu thẳm',
    color: 'from-emerald-400 to-teal-600',
    type: 'zen',
  },
  {
    id: '396-sol',
    name: '396 Hz Giải Tỏa Lo Âu',
    freq: 396,
    desc: 'Tiêu trừ cảm giác tội lỗi, sợ hãi và gánh nặng tâm lý',
    color: 'from-blue-400 to-indigo-600',
    type: 'solfeggio',
  },
  {
    id: '639-sol',
    name: '639 Hz Gắn Kết Yêu Thương',
    freq: 639,
    desc: 'Chữa lành các mối quan hệ rạn nứt, mở rộng lòng từ bi',
    color: 'from-purple-400 to-pink-600',
    type: 'solfeggio',
  },
];

export const AmbientSoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<FrequencyPreset>(FREQUENCIES[0]);
  const [volume, setVolume] = useState(0.18);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const overtoneOscRef = useRef<OscillatorNode | null>(null);
  const shimmerOscRef = useRef<OscillatorNode | null>(null);

  const stopAudio = () => {
    [oscRef, overtoneOscRef, shimmerOscRef].forEach((ref) => {
      if (ref.current) {
        try {
          ref.current.stop();
          ref.current.disconnect();
        } catch {
          // ignore
        }
        ref.current = null;
      }
    });

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.suspend();
      } catch {
        // ignore
      }
    }
  };

  const startAudio = (preset: FrequencyPreset) => {
    stopAudio();

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    const baseFreq = preset.freq;

    // 1. Fundamental Pure Sine Wave
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.connect(masterGain);
    osc.start();
    oscRef.current = osc;

    // 2. Harmonic Overtone (Tibetan Singing Bowl shimmer ratio 2.71x or octave)
    const overtoneOsc = ctx.createOscillator();
    overtoneOsc.type = 'sine';
    const overtoneFreq = preset.type === 'bowl' ? baseFreq * 2.714 : baseFreq * 2;
    overtoneOsc.frequency.setValueAtTime(overtoneFreq, ctx.currentTime);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, ctx.currentTime);
    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(masterGain);
    overtoneOsc.start();
    overtoneOscRef.current = overtoneOsc;

    // 3. Deep Binaural Resonance Pulse (432 / 2 = 216Hz + 2Hz Theta Wave beat)
    const shimmerOsc = ctx.createOscillator();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(baseFreq / 2 + 2, ctx.currentTime);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.25, ctx.currentTime);
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmerOsc.start();
    shimmerOscRef.current = shimmerOsc;
  };

  const strikeBowlChime = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Strike bell sound with fast attack and exponential decay
    const chimeOsc = ctx.createOscillator();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(864, ctx.currentTime); // High crystal bowl harmonic

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0.35, ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chimeOsc.start();
    chimeOsc.stop(ctx.currentTime + 3.5);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(selectedFreq);
      setIsPlaying(true);
    }
  };

  const handleSelectFreq = (preset: FrequencyPreset) => {
    setSelectedFreq(preset);
    if (isPlaying) {
      startAudio(preset);
    }
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div
        className={`relative rounded-3xl bg-slate-950/85 p-3.5 backdrop-blur-2xl border border-amber-500/30 shadow-2xl shadow-amber-950/40 transition-all duration-300 ${
          expanded ? 'w-80' : 'w-auto'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedFreq.color} text-slate-950 font-bold shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer`}
            title={isPlaying ? 'Tạm dừng Nhạc Thiền' : 'Phát Chuông Xoay & Tần Số Thức Tỉnh'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          <div
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer flex-1 select-none pr-1"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="truncate max-w-[150px]">{selectedFreq.name}</span>
              {isPlaying && (
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
              {selectedFreq.desc}
            </p>
          </div>

          {/* Quick Strike Bell Button */}
          <button
            type="button"
            onClick={strikeBowlChime}
            className="p-1.5 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition"
            title="Thỉnh Chuông Tây Tạng Tĩnh Lặng"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-amber-300 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-amber-500/15 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Music className="h-3 w-3" /> Tần Số Chiêm Nghiệm:
              </span>
              <button
                type="button"
                onClick={strikeBowlChime}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold hover:bg-amber-500/30"
              >
                🔔 Thỉnh Chuông
              </button>
            </div>

            <div className="space-y-1.5">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectFreq(f)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-all border ${
                    selectedFreq.id === f.id
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 font-bold shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{f.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">{f.freq}Hz</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">{f.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400 font-medium">Âm lượng</span>
              <input
                type="range"
                min="0.02"
                max="0.4"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 flex-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbientSoundscapePlayer;
