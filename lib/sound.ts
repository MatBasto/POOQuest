"use client";

export type GameSound = "success" | "error" | "unlock" | "victory" | "finish" | "review" | "toggle";

const STORAGE_KEY = "pooquest:sound:v1";
let audioContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

export function isSoundEnabled() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) !== "off";
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  window.dispatchEvent(new CustomEvent("pooquest:sound-change", { detail: { enabled } }));
}

export function primeSound() {
  if (!isSoundEnabled()) return;
  const context = getContext();
  if (context?.state === "suspended") void context.resume();
}

function tone(frequency: number, start: number, duration: number, volume = 0.045, type: OscillatorType = "sine") {
  const context = getContext();
  if (!context || context.state === "closed") return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
  gain.gain.setValueAtTime(0.0001, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(context.currentTime + start);
  oscillator.stop(context.currentTime + start + duration + 0.03);
}

export function playGameSound(sound: GameSound) {
  if (!isSoundEnabled()) return;
  const context = getContext();
  if (!context) return;
  if (context.state === "suspended") void context.resume();

  switch (sound) {
    case "success":
      tone(523.25, 0, 0.13, 0.035, "sine");
      tone(659.25, 0.1, 0.16, 0.04, "sine");
      tone(783.99, 0.22, 0.2, 0.045, "sine");
      break;
    case "review":
      tone(523.25, 0, 0.11, 0.025, "sine");
      tone(659.25, 0.09, 0.14, 0.03, "sine");
      break;
    case "unlock":
      tone(392, 0, 0.12, 0.03, "triangle");
      tone(523.25, 0.09, 0.14, 0.04, "triangle");
      tone(698.46, 0.2, 0.22, 0.045, "triangle");
      break;
    case "victory":
      tone(392, 0, 0.12, 0.035, "triangle");
      tone(523.25, 0.1, 0.14, 0.04, "triangle");
      tone(659.25, 0.2, 0.16, 0.045, "triangle");
      tone(783.99, 0.32, 0.3, 0.05, "triangle");
      break;
    case "finish":
      tone(523.25, 0, 0.16, 0.04, "triangle");
      tone(659.25, 0.12, 0.18, 0.045, "triangle");
      tone(783.99, 0.25, 0.2, 0.05, "triangle");
      tone(1046.5, 0.4, 0.42, 0.055, "triangle");
      break;
    case "error":
      tone(220, 0, 0.12, 0.035, "square");
      tone(174.61, 0.11, 0.16, 0.03, "square");
      break;
    case "toggle":
      tone(659.25, 0, 0.09, 0.022, "sine");
      break;
  }
}
