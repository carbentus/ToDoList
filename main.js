let tabData = JSON.parse(document.querySelector('#data-source').innerHTML);

const initList = () => {
	// SHOW   Search input
	const loupe = document.querySelector('.search__icon');
	const searchInput = document.querySelector('.search__input');

	const showSearchInput = () => {
		searchInput.classList.toggle('search__input-active');
		loupe.classList.toggle('search__icon-inactive');
	};

	loupe.addEventListener('click', showSearchInput);

	// CLOSE THE TASK
	const allCheckBox = document.querySelectorAll('input.task-list__checkbox');

	allCheckBox.forEach((checkBox) => {
		checkBox.addEventListener('click', (ev) => {
			const currentItem = ev.currentTarget;
			currentItem.parentNode.classList.toggle('task-list__task-done');
			const currentItemId = currentItem.getAttribute('data-id');

			tabData = tabData.map((item) => {
				if (item.id.toString() === currentItemId) {
					return {
						...item,
						isCompleted: currentItem.checked,
					};
				}
				return item;
			});
		});
	});

	// Navigation - Switch TABS  (All/Active/Completed)

	const allTabs = document.querySelectorAll('.nav-status__btn');
	const allTabsArray = [...allTabs];

	allTabsArray.forEach((tab) => {
		tab.addEventListener('click', (ev) => {
			const currentItem = ev.currentTarget;

			allTabsArray.forEach((tab) => {
				tab.classList.remove('nav-status__btn-active');
			});
			currentItem.classList.add('nav-status__btn-active');
		});
	});
};

const renderList = (items) => {
	const listContainer = document.querySelector('#list-container');
	listContainer.innerHTML = '';
	items.forEach((item) => {
		const newChild = document.createElement('li');
		newChild.classList.add('task-list__task');
		if (item.isCompleted) {
			newChild.classList.add('task-list__task-done');
		}
		newChild.innerHTML = `
			<input type="checkbox" class="task-list__checkbox" id="task_checkbox${item.id}"${
			item.isCompleted ? ' checked' : ''
		} data-id="${item.id}"/>
			<label for="task_checkbox${item.id}"><i class="fa fa-check" aria-hidden="true"></i></label>
			<p class="task-list__task-description">${item.text}</p>
		`;
		listContainer.appendChild(newChild);
	});
};

const filterActive = () => {
	renderList(tabData.filter((item) => !item.isCompleted));
	initList();
};

const filterCompleted = () => {
	renderList(tabData.filter((item) => item.isCompleted));
	initList();
};

const showAll = () => {
	renderList(tabData);
	initList();
};

const addItem = () => {
	const id = tabData.length + 1;
	tabData.push({
		id,
		isCompleted: false,
		text: 'Fooo bar!',
	});
	showAll();
};

const tabActive = document.getElementById('tab-active');
tabActive.addEventListener('click', filterActive);

const tabCompleted = document.getElementById('tab-completed');
tabCompleted.addEventListener('click', filterCompleted);

const tabAll = document.getElementById('tab-all');
tabAll.addEventListener('click', showAll);

const plusButton = document.querySelector('.footer__btn-add-task');
plusButton.addEventListener('click', addItem);

showAll();
