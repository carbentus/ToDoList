let tabData = JSON.parse(document.querySelector('#data-source').innerHTML);

const loupe = document.querySelector('.search__btn-loupe');
const searchInput = document.querySelector('.search__input');
const searchBackBtn = document.querySelector('.search__btn-back');
const searchClearBtn = document.querySelector('.search__btn-clear');
const initList = () => {
	// Toggle SEARCH input
	const showSearchInput = () => {
		searchInput.classList.add('search__input-active');
		loupe.classList.add('search__btn-loupe-inactive');
		searchBackBtn.classList.add('search__btn-back-active');
		searchClearBtn.classList.add('search__btn-clear-active');
	};

	const closeSearchInput = () => {
		searchInput.classList.remove('search__input-active');
		loupe.classList.remove('search__btn-loupe-inactive');
		searchBackBtn.classList.remove('search__btn-back-active');
		searchClearBtn.classList.remove('search__btn-clear-active');
	};
	searchBackBtn.addEventListener('click', closeSearchInput);
	loupe.addEventListener('click', showSearchInput);
	// clear search input

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

		// turncut for long tasks
		const newChildHeight = newChild.clientHeight;

		if (newChildHeight > 132) {
			const newChildParagraph = newChild.lastElementChild;
			newChildParagraph.classList.add('task-list__task-description--shorten');

			const btnReadMore = document.createElement('button');
			newChild.classList.add('task-list__task--long');
			newChild.appendChild(btnReadMore);
			btnReadMore.classList.add('task-list__btn-read-more');
			btnReadMore.innerText = 'read more...';

			//READ MORE / READ LESS
			const resizeTaskContent = function (ev) {
				const clickedBtn = ev.currentTarget;
				const contentToExpand = clickedBtn.previousElementSibling;
				if (contentToExpand.classList.contains('task-list__task-description--shorten')) {
					clickedBtn.innerText = 'read less...';
					contentToExpand.classList.remove('task-list__task-description--shorten');
				} else {
					clickedBtn.innerText = 'read more...';
					contentToExpand.classList.add('task-list__task-description--shorten');
				}
			};

			btnReadMore.addEventListener('click', resizeTaskContent);
		}
	});
};

// start Read more

// end Read more

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

// --- start SEARCH TASK function
// const searchInput = document.getElementById('search');
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

	let searchedText = searchText.trim();
	if (searchedText !== '') {
		console.log(searchedText);
		let text = document.getElementById('text').innerHTML;
		let re = new RegExp(searchedText, 'g');
		let newText = text.replace(re, `<mark>${searchedText}</mark>`);
		document.getElementById('text').innerHTML = newText;
	} else {
		console.log('pusty input');
	}
};
document.querySelector('.search__input').addEventListener('input', filterSearchTask);

//// HIGHLIGHT
// const text = document.querySelector('.text').innerText;
// function highlight() {
// 	let searchedText = document.getElementById('test-search-input').value.trim();
// 	if (searchedText !== '') {
// 		console.log('dziala');
// 		// let text = document.getElementById('text').innerHTML;
// 		let re = new RegExp(searchedText, 'g');
// 		let newText = text.replace(re, `<mark>${searchedText}</mark>`);
// 		document.getElementById('text').innerHTML = newText;
// 	} else {
// 		console.log('pusty input');
// 	}
}

// clear search input
const clearSearchInput = () => {
	searchInput.value = '';
	if (tabActive.classList.contains('nav-status__btn-active')) {
		filterActive();
	} else if (tabCompleted.classList.contains('nav-status__btn-active')) {
		filterCompleted();
	} else {
		showAll();
	}
};
searchClearBtn.addEventListener('click', clearSearchInput);

// --- end SEARCH TASK function

// --- start  ADD TASK - show window
const newTaskWindow = document.querySelector('.new-task-container');
const plusBtn = document.querySelector('.footer__btn-add-task');
plusBtn.addEventListener('click', () => {
	newTaskWindow.classList.remove('new-task-container-hide');
	document.body.style.overflow = 'hidden';
});

// Add Task - close window
const closeNewTaskWindow = () => {
	newTaskWindow.classList.add('new-task-container-hide');
	document.body.style.overflow = 'visible';
};
const backToListBtn = document.querySelector('.new-task-container__btn-back-to-list');
backToListBtn.addEventListener('click', closeNewTaskWindow);

// --- ADD NEW TASK   -
const addTaskBtn = document.querySelector('.new-task-container__btn-confirm');

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
//  end ADD TASK

// Przy uruchomieniu od razu wyświetl wszystkie
showAll();

// Handle READ MORE on resize
const readMoreOnResize = () => {
	if (tabActive.classList.contains('nav-status__btn-active')) {
		filterActive();
	} else if (tabCompleted.classList.contains('nav-status__btn-active')) {
		filterCompleted();
	} else {
		showAll();
	}
};
window.addEventListener('resize', readMoreOnResize);
