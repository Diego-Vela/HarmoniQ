// Map sound files to an object with `uri` property
export const sounds: Record<string, any> = {
  c: require('@/assets/sounds/notes/c4.mp3'),
  d: require('@/assets/sounds/notes/d4.mp3'),
  e: require('@/assets/sounds/notes/e4.mp3'),
  f: require('@/assets/sounds/notes/f4.mp3'),
  g: require('@/assets/sounds/notes/g4.mp3'),
  a: require('@/assets/sounds/notes/a5.mp3'),
  b: require('@/assets/sounds/notes/b5.mp3'),

  correct: require('@/assets/sounds/correct.mp3'),
  wrong: require('@/assets/sounds/incorrect.mp3'),
  tap: require('@/assets/sounds/tap.mp3'),
  metronome: require('@/assets/sounds/metronome.wav'),
};