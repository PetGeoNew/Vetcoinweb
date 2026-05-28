const RESIZE_THROTTLE_MS = 80;

const getLayoutWidths = () => {
	const computed = getComputedStyle(document.documentElement);
	const getWidth = (prop, fallback) => parseInt(computed.getPropertyValue(prop)) || fallback;
	return {
		mobile: getWidth('--layout-width', 375),
		tablet: getWidth('--layout-width-tablet', 750),
		desktop: getWidth('--layout-width-desktop', 1200),
	};
};

const updateScalerHeight = () => {
	const scaler = document.getElementById('viewport-scaler');
	const main = document.querySelector('.main');
	
	if (!scaler || !main) return;

	const w = window.innerWidth;
	const widths = getLayoutWidths();

	if (w <= widths.mobile) {
		scaler.style.height = '';
		return;
	}

	const mainHeight = main.offsetHeight;
	if (!mainHeight || mainHeight <= 0) return;

	const scale = w >= widths.desktop
		? w / widths.desktop
		: w >= widths.tablet
			? w / widths.tablet
			: w / widths.mobile;

	scaler.style.height = mainHeight * scale + 'px';
};

const throttle = (fn, ms) => {
	let rafId = null;
	let lastCall = 0;
	
	return (...args) => {
		const now = Date.now();
		if (now - lastCall >= ms) {
			lastCall = now;
			fn(...args);
		} else if (!rafId) {
			rafId = requestAnimationFrame(() => {
				rafId = null;
				lastCall = Date.now();
				fn(...args);
			});
		}
	};
};

export const initViewportScale = () => {
	if (typeof document === 'undefined') return;

	const throttledUpdate = throttle(updateScalerHeight, RESIZE_THROTTLE_MS);
	
	updateScalerHeight();
	window.addEventListener('resize', throttledUpdate, { passive: true });
	
	const main = document.querySelector('.main');
	if (main && typeof ResizeObserver !== 'undefined') {
		try {
			new ResizeObserver(throttledUpdate).observe(main);
		} catch (error) {
			console.warn('[viewportScale] ResizeObserver not supported:', error);
		}
	}
};
