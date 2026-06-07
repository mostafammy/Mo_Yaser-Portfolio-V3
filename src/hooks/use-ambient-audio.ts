"use client"

import { useRef, useCallback, useEffect } from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AmbientSection =
  | "hero"
  | "about"
  | "story"
  | "global-presence"
  | "github-contributions"
  | "hackathons"
  | "case-studies"
  | "contact"
  | "default"

interface SceneNodes {
  sources: AudioScheduledSourceNode[]
  masterGain: GainNode
  all: AudioNode[]
}

// ---------------------------------------------------------------------------
// Noise buffer factory
// ---------------------------------------------------------------------------

function createNoiseBuffer(
  ctx: AudioContext,
  type: "white" | "pink",
  durationSec = 3
): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const frameCount = Math.floor(sampleRate * durationSec)
  const buffer = ctx.createBuffer(1, frameCount, sampleRate)
  const data = buffer.getChannelData(0)

  if (type === "white") {
    for (let i = 0; i < frameCount; i++) data[i] = Math.random() * 2 - 1
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < frameCount; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.96900 * b2 + w * 0.1538520
      b3 = 0.86650 * b3 + w * 0.3104856
      b4 = 0.55000 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  }
  return buffer
}

// ---------------------------------------------------------------------------
// Audio graph singleton — module-level so it survives React re-renders
// ---------------------------------------------------------------------------

let _ctx: AudioContext | null = null
let _compressor: DynamicsCompressorNode | null = null
let _masterGain: GainNode | null = null
let _currentScene: SceneNodes | null = null
let _currentSection: AmbientSection = "hero"
let _isEnabled = false

const FADE_IN  = 1.0   // seconds
const FADE_OUT = 1.5

/**
 * Boot the audio graph. Must be called synchronously inside a user gesture.
 */
function bootAudioGraph() {
  if (_ctx) return

  _ctx = new AudioContext({ sampleRate: 44100, latencyHint: "interactive" })

  // Compressor normalises everything — no more inaudible output
  _compressor = _ctx.createDynamicsCompressor()
  _compressor.threshold.value = -18
  _compressor.knee.value      = 6
  _compressor.ratio.value     = 4
  _compressor.attack.value    = 0.003
  _compressor.release.value   = 0.25
  _compressor.connect(_ctx.destination)

  _masterGain = _ctx.createGain()
  _masterGain.gain.setValueAtTime(0, _ctx.currentTime)
  _masterGain.connect(_compressor)
}

function rampGain(param: AudioParam, target: number, duration: number) {
  if (!_ctx) return
  param.cancelScheduledValues(_ctx.currentTime)
  param.setValueAtTime(param.value, _ctx.currentTime)
  param.linearRampToValueAtTime(target, _ctx.currentTime + duration)
}

// ---------------------------------------------------------------------------
// Helper for lush ambient chords
// ---------------------------------------------------------------------------
function buildChordPad(
  ctx: AudioContext,
  master: GainNode,
  frequencies: number[],
  type: OscillatorType = "sine",
  detuneHz = 1.5,
  gainVal = 0.15
): { sources: AudioScheduledSourceNode[]; nodes: AudioNode[] } {
  const nodes: AudioNode[] = []
  const sources: AudioScheduledSourceNode[] = []

  const chordGain = ctx.createGain()
  chordGain.gain.value = gainVal
  chordGain.connect(master)
  nodes.push(chordGain)

  frequencies.forEach((freq) => {
    // Main note
    const osc1 = ctx.createOscillator()
    osc1.type = type
    osc1.frequency.value = freq
    osc1.connect(chordGain)
    osc1.start()
    sources.push(osc1)

    // Detuned shimmer note for chorus effect
    const osc2 = ctx.createOscillator()
    osc2.type = type
    osc2.frequency.value = freq + detuneHz
    osc2.connect(chordGain)
    osc2.start()
    sources.push(osc2)
  })

  return { sources, nodes }
}

// ---------------------------------------------------------------------------
// Scene builders — connect directly to _masterGain
// ---------------------------------------------------------------------------

function buildHeroScene(): SceneNodes {
  const ctx = _ctx!
  const master = _masterGain!
  
  const sceneGain = ctx.createGain()
  sceneGain.gain.setValueAtTime(0, ctx.currentTime)
  sceneGain.connect(master)
  
  // Triumphant Eb Major (Eb3, G3, Bb3, Eb4) - Victory / Heroic
  const { sources, nodes } = buildChordPad(
    ctx, 
    sceneGain, 
    [155.56, 196.00, 233.08, 311.13], 
    "triangle", 
    2.0, 
    0.15
  )

  // Sub-bass root note for power
  const sub = ctx.createOscillator()
  sub.type = "sine"
  sub.frequency.value = 77.78 // Eb2
  const subG = ctx.createGain()
  subG.gain.value = 0.5
  sub.connect(subG).connect(sceneGain)
  sub.start()
  
  sources.push(sub)
  nodes.push(subG, sceneGain)

  return { sources, masterGain: sceneGain, all: nodes }
}

function buildStoryScene(): SceneNodes {
  const ctx = _ctx!
  const master = _masterGain!
  
  const sceneGain = ctx.createGain()
  sceneGain.gain.setValueAtTime(0, ctx.currentTime)
  sceneGain.connect(master)
  
  // Emotional / Encouraging Ab Major 7 (Ab3, C4, Eb4, G4)
  const pad = buildChordPad(
    ctx, 
    sceneGain, 
    [207.65, 261.63, 311.13, 392.00], 
    "sine", 
    1.2, 
    0.2
  )

  // Warm vinyl hiss
  const whiteBuf = createNoiseBuffer(ctx, "white", 3)
  const hiss = ctx.createBufferSource()
  hiss.buffer = whiteBuf; hiss.loop = true
  const hissLP = ctx.createBiquadFilter()
  hissLP.type = "lowpass"; hissLP.frequency.value = 1500 // Softer than before
  const hissG = ctx.createGain(); hissG.gain.value = 0.1
  hiss.connect(hissLP).connect(hissG).connect(sceneGain)
  hiss.start()

  return { 
    sources: [...pad.sources, hiss], 
    masterGain: sceneGain, 
    all: [...pad.nodes, hissLP, hissG, sceneGain] 
  }
}

function buildGlobalPresenceScene(): SceneNodes {
  const ctx = _ctx!
  const master = _masterGain!
  
  const sceneGain = ctx.createGain()
  sceneGain.gain.setValueAtTime(0, ctx.currentTime)
  sceneGain.connect(master)
  
  // Wide open majestic Bb Major (Bb2, F3, Bb3, D4)
  const pad = buildChordPad(
    ctx, 
    sceneGain, 
    [116.54, 174.61, 233.08, 293.66], 
    "triangle", 
    0.8, 
    0.15
  )

  // Gentle Pink Noise wind
  const pinkBuf = createNoiseBuffer(ctx, "pink", 5)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = pinkBuf; noiseSrc.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"; bp.frequency.value = 800; bp.Q.value = 0.3
  const noiseG = ctx.createGain(); noiseG.gain.value = 0.2
  noiseSrc.connect(bp).connect(noiseG).connect(sceneGain)
  noiseSrc.start()

  return { 
    sources: [...pad.sources, noiseSrc], 
    masterGain: sceneGain, 
    all: [...pad.nodes, bp, noiseG, sceneGain] 
  }
}

function buildDefaultScene(): SceneNodes {
  const ctx = _ctx!
  const master = _masterGain!
  
  const sceneGain = ctx.createGain()
  sceneGain.gain.setValueAtTime(0, ctx.currentTime)
  sceneGain.connect(master)
  
  // Peaceful / Optimistic C Major wash (C3, G3, C4, E4)
  const pad = buildChordPad(
    ctx, 
    sceneGain, 
    [130.81, 196.00, 261.63, 329.63], 
    "sine", 
    1.5, 
    0.12
  )

  return { 
    sources: [...pad.sources], 
    masterGain: sceneGain, 
    all: [...pad.nodes, sceneGain] 
  }
}

function getSceneForSection(section: AmbientSection): SceneNodes {
  if (section === "hero")            return buildHeroScene()
  if (section === "story")           return buildStoryScene()
  if (section === "global-presence") return buildGlobalPresenceScene()
  return buildDefaultScene()
}

function teardownScene(scene: SceneNodes) {
  const ctx = _ctx
  if (!ctx) return
  rampGain(scene.masterGain.gain, 0, FADE_OUT)
  setTimeout(() => {
    scene.sources.forEach((s) => { try { s.stop() } catch { /**/ } })
    scene.all.forEach((n) => { try { n.disconnect() } catch { /**/ } })
  }, (FADE_OUT + 0.3) * 1000)
}

// ---------------------------------------------------------------------------
// Public imperative functions — safe to call in click handlers
// ---------------------------------------------------------------------------

export function audioActivate(section: AmbientSection = "hero") {
  // 1. Boot audio graph (must be in gesture)
  bootAudioGraph()
  const ctx = _ctx!
  const master = _masterGain!

  // 2. Resume if suspended (must be in gesture)
  if (ctx.state === "suspended") ctx.resume()

  _isEnabled = true
  _currentSection = section

  // 3. Fade master in
  rampGain(master.gain, 0.85, FADE_IN)

  // 4. Start scene
  if (_currentScene) teardownScene(_currentScene)
  _currentScene = getSceneForSection(section)
  rampGain(_currentScene.masterGain.gain, 1, FADE_IN)
}

export function audioDeactivate() {
  if (!_isEnabled || !_ctx || !_masterGain) return
  _isEnabled = false

  rampGain(_masterGain.gain, 0, FADE_OUT)
  if (_currentScene) {
    teardownScene(_currentScene)
    _currentScene = null
  }
  setTimeout(() => {
    if (!_isEnabled) _ctx?.suspend()
  }, (FADE_OUT + 0.3) * 1000)
}

export function audioSwitchSection(section: AmbientSection) {
  if (_currentSection === section) return
  _currentSection = section

  if (!_isEnabled || !_ctx || !_masterGain) return

  if (_currentScene) teardownScene(_currentScene)
  _currentScene = getSceneForSection(section)
  rampGain(_currentScene.masterGain.gain, 1, FADE_IN)
}

// ---------------------------------------------------------------------------
// Hook — purely for cleanup
// ---------------------------------------------------------------------------

export function useAmbientAudio() {
  const cleanupRef = useRef(false)

  useEffect(() => {
    cleanupRef.current = false
    return () => {
      cleanupRef.current = true
      // Don't close context on HMR — only on full unmount in prod
    }
  }, [])

  const activate      = useCallback((s?: AmbientSection) => audioActivate(s), [])
  const deactivate    = useCallback(() => audioDeactivate(), [])
  const switchSection = useCallback((s: AmbientSection) => audioSwitchSection(s), [])

  return { activate, deactivate, switchSection }
}
