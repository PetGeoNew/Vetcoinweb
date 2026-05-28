import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

const CONTRACT_ADDRESS = '0xc2A52f1f5e082CD1Ff7954aA2F133e2d7e1a1599';

function htmlInjectPartials() {
	const injectRegex = /<!-- inject: (\S+) -->/g;

	return {
		name: 'html-inject-partials',
		transformIndexHtml(html) {
			return html
				.replace(injectRegex, (_, filePath) => {
					const resolved = path.resolve(process.cwd(), filePath);
					try {
						return fs.readFileSync(resolved, 'utf-8');
					} catch (err) {
						console.warn(`[html-inject-partials] File not found: ${resolved}`, err.message);
						return '';
					}
				})
				.replaceAll('{{CONTRACT_ADDRESS}}', CONTRACT_ADDRESS);
		},
	};
}

export default defineConfig({
	plugins: [htmlInjectPartials()],
	build: {
		rollupOptions: {
			input: {
				main: 'index.html',
				whitepaper: 'whitepaper/index.html',
			},
		},
	},
});
