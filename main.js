// SHOW   Search input
const loupe = document.querySelector('.search__icon');
const searchInput = document.querySelector('.search__input');

const showSearchInput = () => {
	searchInput.classList.toggle('search__input-active');
	loupe.classList.toggle('search__icon-inactive');
};

// Listener SHOW SEARCH INPUT
loupe.addEventListener('click', showSearchInput);

// Close the Task

const allTasks = document.querySelectorAll('li.task-list__task');
const allCheckBox = document.querySelectorAll('input.task-list__checkbox');

// CLOSE the TASK
allCheckBox.forEach((checkBox) => {
	checkBox.addEventListener('click', (ev) => {
		ev.currentTarget.parentNode.classList.toggle('task-list__task-done');
	});
});

// Navigation - Switch TABS  (All/Active/Completed)

const allTabs = document.querySelectorAll('div.nav-status__element');
const allTabsArray = [...allTabs];
const tabAll = document.getElementById('tab-all');
const tabActive = document.getElementById('tab-active');
// const tabCompleted = document.getElementById('tab-completed');

//

// const completedTasks = document.querySelectorAll('li.task-list__task-done');

allTabsArray.forEach((tab) => {
	tab.addEventListener('click', (ev) => {
		allTabsArray.forEach((tab) => {
			tab.classList.remove('nav-status__element-active');
			tab.firstElementChild.classList.remove('nav-status__link-active');
		});
		ev.currentTarget.classList.add('nav-status__element-active');
		ev.currentTarget.firstElementChild.classList.add('nav-status__link-active');

		if (ev.currentTarget === tabAll) {
			console.log('kliknales w ALL');
			console.log(allTasks);
		} else if (ev.currentTarget === tabActive) {
			const activeTasks = document.querySelectorAll(
				'li.task-list__task:not(.task-list__task-done)'
			);

			console.log('kliknales w Active');
			console.log(activeTasks);
		} else {
			console.log('kliknales w COMPLETED');
			const completedTasks = document.querySelectorAll('li.task-list__task-done');
			console.log(completedTasks);
		}
	});
});
