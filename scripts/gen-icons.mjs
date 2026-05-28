import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = resolve(__dirname, '../public/assets')
const SRC = resolve(ASSETS, 'vetcoin_logo.svg')
const BG = '#0a0a0f'

const svgBuffer = await readFile(SRC)

// Render SVG with a density high enough that the rasterized output is at least
// `target` px on the long side — avoids blurry upscaling from the 25×25 viewBox.
const SVG_VIEWBOX = 25
const render = (target) =>
	sharp(svgBuffer, { density: Math.max(96, Math.ceil((target / SVG_VIEWBOX) * 96)) })

const writePng = async (file, pipeline) => {
	const out = resolve(ASSETS, file)
	await pipeline.png({ compressionLevel: 9 }).toFile(out)
	console.log(`✓ ${file}`)
}

// Transparent square favicons
await writePng('favicon-32.png', render(32).resize(32, 32))
await writePng('favicon-192.png', render(192).resize(192, 192))

// Apple touch icon — 180×180 on dark bg with ~10% safe-area padding
const appleInner = 140
const appleLogo = await render(appleInner).resize(appleInner, appleInner).png().toBuffer()
await writePng(
	'apple-touch-icon.png',
	sharp({
		create: { width: 180, height: 180, channels: 4, background: BG },
	}).composite([{ input: appleLogo, gravity: 'center' }])
)

// OG / Twitter image — 1200×630 on dark bg, logo centered
const ogLogoSize = 420
const ogLogo = await render(ogLogoSize).resize(ogLogoSize, ogLogoSize).png().toBuffer()
await writePng(
	'og-image.png',
	sharp({
		create: { width: 1200, height: 630, channels: 4, background: BG },
	}).composite([{ input: ogLogo, gravity: 'center' }])
)
