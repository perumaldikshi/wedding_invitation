import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 22050;
const seconds = 36;
const total = sampleRate * seconds;
const samples = new Float32Array(total);
const notes = [138.59, 207.89, 277.18, 346.48];

function addTone(frequency, gain, attack, release, start = 0, duration = seconds, tremolo = 0) {
  const from = Math.max(0, Math.floor(start * sampleRate));
  const to = Math.min(total, Math.floor((start + duration) * sampleRate));
  for (let i = from; i < to; i += 1) {
    const local = i / sampleRate - start;
    const end = duration - local;
    const envelope = Math.min(1, local / attack, end / release);
    const lfo = tremolo ? 0.86 + Math.sin(local * Math.PI * 2 * tremolo) * 0.14 : 1;
    samples[i] += Math.sin(local * Math.PI * 2 * frequency) * gain * Math.max(0, envelope) * lfo;
  }
}

// Original Sa–Pa ambient bed.
addTone(notes[0] * 0.5, 0.12, 2.5, 3, 0, seconds, 0.08);
addTone(notes[0], 0.09, 2, 3, 0, seconds, 0.11);
addTone(notes[1], 0.05, 2.4, 3, 0, seconds, 0.07);
addTone(notes[2], 0.028, 2.8, 3, 0, seconds, 0.13);

// Gentle, original bell-like phrases.
const phrase = [277.18, 311.13, 346.48, 415.78, 346.48, 311.13, 277.18, 207.89];
for (let cycle = 0; cycle < 4; cycle += 1) {
  phrase.forEach((frequency, index) => {
    const start = 2.5 + cycle * 8.2 + index * 0.72;
    addTone(frequency, 0.07, 0.08, 1.6, start, 2.1, 2.1);
    addTone(frequency * 2, 0.018, 0.04, 1.1, start, 1.5, 2.7);
  });
}

// Temple-bell accents.
[1.4, 9.6, 17.8, 26].forEach((start) => {
  addTone(523.25, 0.08, 0.01, 2.5, start, 3, 3.4);
  addTone(784.88, 0.035, 0.01, 2.1, start, 2.5, 4.1);
});

let peak = 0;
for (const value of samples) peak = Math.max(peak, Math.abs(value));
const scale = 0.82 / Math.max(peak, 0.001);
const dataSize = total * 2;
const output = Buffer.alloc(44 + dataSize);

output.write('RIFF', 0);
output.writeUInt32LE(36 + dataSize, 4);
output.write('WAVE', 8);
output.write('fmt ', 12);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(1, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * 2, 28);
output.writeUInt16LE(2, 32);
output.writeUInt16LE(16, 34);
output.write('data', 36);
output.writeUInt32LE(dataSize, 40);

for (let i = 0; i < total; i += 1) {
  const fadeIn = Math.min(1, i / (sampleRate * 1.3));
  const fadeOut = Math.min(1, (total - i) / (sampleRate * 2.2));
  const value = Math.max(-1, Math.min(1, samples[i] * scale * fadeIn * fadeOut));
  output.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
}

const destination = path.resolve('public/assets/wedding-ambience.wav');
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, output);
console.log(`Generated ${destination} (${(output.length / 1024 / 1024).toFixed(2)} MB)`);
