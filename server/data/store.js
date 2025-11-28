import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname);
const assetsFile = path.join(dataDir, 'assets.json');

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(assetsFile, 'utf-8');
  } catch {
    await writeFile(assetsFile, '[]', 'utf-8');
  }
}

export async function readAssets() {
  await ensureStore();
  const contents = await readFile(assetsFile, 'utf-8');
  return JSON.parse(contents || '[]');
}

export async function writeAssets(assets) {
  await ensureStore();
  await writeFile(assetsFile, JSON.stringify(assets, null, 2), 'utf-8');
}

