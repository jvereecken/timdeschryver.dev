import { afterUpdate, onDestroy } from 'svelte';

export default function codeBlockLifeCycle() {
	let codeTabs: Element[] = [];

	afterUpdate(() => {
		codeTabs.forEach((pre) => pre.removeEventListener('click', codeTabClick));
		codeTabs = [...document.querySelectorAll('.code-group-tab')];
		codeTabs.forEach((pre) => pre.addEventListener('click', codeTabClick));
	});

	onDestroy(() => {
		codeTabs.forEach((pre) => pre.removeEventListener('click', codeTabClick));
	});

	function codeTabClick(e: PointerEvent) {
		if (e.target instanceof HTMLElement) {
			const target = e.target;
			if (target.classList.contains('active')) {
				return;
			}
			const id = target.getAttribute('data-id');
			const code = document.querySelector(`.code-group-code[data-id="${id}"]`);
			if (code instanceof HTMLElement) {
				const currentVisible = code.parentElement.querySelector(`.code-group-code:not([hidden])`);
				const currentActive = code.parentElement.querySelector(`.code-group-tab.active`);

				code.removeAttribute('hidden');
				target.classList.add('active');

				currentVisible.setAttribute('hidden', '');
				currentActive.classList.remove('active');
			}
		}
	}
}
