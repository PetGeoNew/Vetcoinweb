export function initMobileMenu() {
	const button = document.querySelector('.header__button');
	const menu = document.querySelector('.header__links');
	const header = document.querySelector('.header');

	if (!button || !menu) return;

	const mobileMq = window.matchMedia('(max-width: 1561px)');
	let isOpen = false;

	const setOpen = (open) => {
		isOpen = open;
		button.setAttribute('aria-expanded', String(open));
		menu.classList.toggle('header__links--open', open);
		// On desktop the nav is inline and always interactive; only gate a11y/scroll on mobile.
		menu.inert = mobileMq.matches ? !open : false;
		document.body.style.overflow = open && mobileMq.matches ? 'hidden' : '';
	};

	const reapply = () => setOpen(isOpen);
	mobileMq.addEventListener('change', reapply);
	reapply();

	button.addEventListener('click', () => setOpen(!isOpen));

	menu.addEventListener('click', (e) => {
		if (e.target.closest('.header__link')) setOpen(false);
	});

	document.addEventListener('click', (e) => {
		if (isOpen && header && !header.contains(e.target) && !menu.contains(e.target)) setOpen(false);
	});
}
