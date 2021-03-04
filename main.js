// Search appear
const loupe = document.querySelector('.search__icon');
const searchInput = document.querySelector('.search__input');

loupe.addEventListener('click', () => {
	console.log('dziala');

	searchInput.classList.toggle('search__input-active');
	loupe.classList.toggle('search__icon-inactive');
});
