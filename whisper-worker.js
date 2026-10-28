// Worker de reconocimiento de voz sin conexión (Whisper + transformers.js).
// Se ejecuta aparte para que la interfaz no se congele mientras transcribe.
import { pipeline, env } from './vendor/transformers.min.js';

env.allowLocalModels = false;          // el modelo se descarga de Hugging Face la primera vez
env.useBrowserCache = true;            // y queda guardado en el dispositivo (Cache Storage)
if (env.backends && env.backends.onnx) {
  env.backends.onnx.wasm = env.backends.onnx.wasm || {};
  env.backends.onnx.wasm.numThreads = 1; // GitHub Pages no permite multihilo (sin COOP/COEP)
  env.backends.onnx.wasm.proxy = false;
  env.backends.onnx.wasm.wasmPaths = {
    mjs: new URL('./vendor/ort-wasm-simd-threaded.asyncify.mjs', import.meta.url).href,
    wasm: new URL('./vendor/ort-wasm-simd-threaded.asyncify.wasm', import.meta.url).href,
  };
}

let asr = null;
let loadedModel = null;

async function load(model) {
  if (asr && loadedModel === model) return;
  asr = null;
  const files = {};
  asr = await pipeline('automatic-speech-recognition', model, {
    dtype: 'q8',
    device: 'wasm',
    progress_callback: (p) => {
      if (p.status === 'progress' && p.file) {
        files[p.file] = { loaded: p.loaded || 0, total: p.total || 0 };
        let loaded = 0, total = 0;
        for (const f of Object.values(files)) { loaded += f.loaded; total += f.total; }
        self.postMessage({ type: 'progress', loaded, total, file: p.file });
      } else if (p.status === 'done' && p.file) {
        self.postMessage({ type: 'file-done', file: p.file });
      }
    },
  });
  loadedModel = model;
}

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'load') {
      await load(data.model);
      self.postMessage({ type: 'ready', model: data.model });
    } else if (data.type === 'transcribe') {
      await load(data.model);
      const t0 = performance.now();
      const out = await asr(data.audio, {
        language: 'chinese',
        task: 'transcribe',
        chunk_length_s: 30,
        stride_length_s: 5,
      });
      const text = Array.isArray(out) ? out.map((o) => o.text).join('') : out.text;
      self.postMessage({ type: 'result', text: (text || '').trim(), ms: Math.round(performance.now() - t0) });
    }
  } catch (err) {
    self.postMessage({ type: 'error', message: String((err && err.message) || err) });
  }
};
