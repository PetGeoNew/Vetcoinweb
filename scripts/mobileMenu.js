export function initMobileMenu() {
	const button = document.querySelector('.header__button');
	const menu = document.querySelector('.header__links');
	const header = document.querySelector('.header');

	if (!button || !menu) return;

	let isOpen = false;
	// Menu now stays in the DOM (see header.css) — keep it out of the tab order
	// and hidden from screen readers while closed.
	menu.inert = true;

	const setOpen = (open) => {
		isOpen = open;
		button.setAttribute('aria-expanded', String(open));
		menu.classList.toggle('header__links--open', open);
		menu.inert = !open;
		document.body.style.overflow = open ? 'hidden' : '';
	};

	button.addEventListener('click', () => setOpen(!isOpen));

	menu.addEventListener('click', (e) => {
		if (e.target.closest('.header__link')) setOpen(false);
	});

	document.addEventListener('click', (e) => {
		if (isOpen && header && !header.contains(e.target) && !menu.contains(e.target)) setOpen(false);
	});
}
