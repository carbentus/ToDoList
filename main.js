let tabData = JSON.parse(document.querySelector('#data-source').innerHTML);

const initList = () => {
	// Toggle SEARCH input
	const loupe = document.querySelector('.search__btn-loupe');
	const searchInput = document.querySelector('.search__input');

	const showSearchInput = () => {
		searchInput.classList.toggle('search__input-active');
		// loupe.classList.toggle('search__btn-loupe-inactive');
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

const tabActive = document.getElementById('tab-active');
tabActive.addEventListener('click', filterActive);

const tabCompleted = document.getElementById('tab-completed');
tabCompleted.addEventListener('click', filterCompleted);

const tabAll = document.getElementById('tab-all');
tabAll.addEventListener('click', showAll);

const newTaskWindow = document.querySelector('.new-task-container');
const plusBtn = document.querySelector('.footer__btn-add-task');
plusBtn.addEventListener('click', () => {
	newTaskWindow.classList.remove('new-task-container-hide');
	document.body.style.overflow = 'hidden';
});

// ---- SEARCH TASK function
const filterSearchTask = (ev) => {
	const searchText = ev.target.value.toLowerCase();

	if (tabActive.classList.contains('nav-status__btn-active')) {
		renderList(
			tabData.filter((item) => item.text.toLowerCase().includes(searchText) && !item.isCompleted)
		);
	} else if (tabCompleted.classList.contains('nav-status__btn-active')) {
		renderList(
			tabData.filter((item) => item.text.toLowerCase().includes(searchText) && item.isCompleted)
		);
	} else {
		renderList(tabData.filter((item) => item.text.toLowerCase().includes(searchText)));
	}
};
document.querySelector('.search__input').addEventListener('input', filterSearchTask);
// ----- end SEARCH TASK function

// Exit Add Task
const closeNewTaskWindow = () => {
	newTaskWindow.classList.add('new-task-container-hide');
	document.body.style.overflow = 'visible';
};
const backToListBtn = document.querySelector('.new-task-container__btn-back-to-list');
backToListBtn.addEventListener('click', closeNewTaskWindow);

//AddTask Confirm

const addTaskBtn = document.querySelector('.new-task-container__btn-confirm');

// ADD NEW TASK   -

const addItem = () => {
	const newTaskTextInput = document.querySelector('.new-task-container__textarea');
	const newTaskText = newTaskTextInput.value;

	const id = tabData.length + 1;
	tabData.push({
		id,
		isCompleted: false,
		text: newTaskText,
	});
	newTaskTextInput.value = '';
	closeNewTaskWindow();
	showAll();
};
addTaskBtn.addEventListener('click', addItem);

// Przy uruchomieniu od razu wyświetl wszystkie
showAll();
