"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Music, Play, Pause } from "lucide-react";

interface FrequencyPreset {
  id: string;
  name: string;
  freq: number;
  desc: string;
  color: string;
}

const FREQUENCIES: FrequencyPreset[] = [
  { id: "432", name: "432 Hz", freq: 432, desc: "Tần số Tĩnh Tâm & Kết Nối Tự Nhiên", color: "from-amber-400 to-amber-600" },
  { id: "528", name: "528 Hz", freq: 528, desc: "Tần số Tái Tạo Năng Lượng & Chữa Lành", color: "from-emerald-400 to-teal-600" },
  { id: "639", name: "639 Hz", freq: 639, desc: "Tần số Hòa Hợp Mối Quan Hệ", color: "from-purple-400 to-indigo-600" },
];

export const AmbientSoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<FrequencyPreset>(FREQUENCIES[1]); // 528Hz default
  const [volume, setVolume] = useState(0.15);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // ignore
      }
      oscRef.current = null;
    }
    if (subOscRef.current) {
      try {
        subOscRef.current.stop();
        subOscRef.current.disconnect();
      } catch {
        // ignore
      }
      subOscRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.suspend();
    }
  };

  const startAudio = (freqHz: number) => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainRef.current = gainNode;

    // Main Harmonic Oscillator (Sine Wave)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqHz, ctx.currentTime);
    osc.connect(gainNode);
    osc.start();
    oscRef.current = osc;

    // Deep Tibetan Bowl Harmonics Sub-oscillator (Soft Binaural Pulse)
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(freqHz / 2 + 1.5, ctx.currentTime);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.3, ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(gainNode);
    subOsc.start();
    subOscRef.current = subOsc;
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(selectedFreq.freq);
      setIsPlaying(true);
    }
  };

  const handleSelectFreq = (preset: FrequencyPreset) => {
    setSelectedFreq(preset);
    if (isPlaying) {
      startAudio(preset.freq);
    }
  };

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(isMuted ? 0 : volume, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div className={`relative rounded-2xl bg-zinc-950/80 p-3 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-amber-950/40 transition-all duration-300 ${expanded ? 'w-80' : 'w-auto'}`}>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={togglePlay}
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${selectedFreq.color} text-zinc-950 font-bold shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all`}
            title={isPlaying ? "Tắt Nhạc Tĩnh Tâm" : "Phát Nhạc Tần Số Chữa Lành"}
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </button>

          <div 
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer flex-1 select-none pr-1"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
              <span>{selectedFreq.name} Ambient</span>
              {isPlaying && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 line-clamp-1 truncate max-w-[170px]">
              {selectedFreq.desc}
            </p>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-zinc-400 hover:text-amber-300 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-amber-500/10 space-y-2 animate-fadeIn">
            <p className="text-[11px] font-medium text-amber-300/80 flex items-center gap-1">
              <Music className="h-3 w-3" /> Chọn Tần Số Âm Thanh Thần Thức:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectFreq(f)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedFreq.id === f.id
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-zinc-500">Âm lượng</span>
              <input
                type="range"
                min="0.02"
                max="0.4"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 flex-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbientSoundscapePlayer;
