const MAX_TAB_HEIGHT = 132; // 3x line height, wrap overflowing text
let tabData = JSON.parse(document.querySelector('#data-source').innerHTML);

const loupe = document.querySelector('.search__btn-loupe');
const searchInput = document.querySelector('.search__input');
const searchBackBtn = document.querySelector('.search__btn-back');
const searchClearBtn = document.querySelector('.search__btn-clear');

const initList = () => {
  // SEARCH INPUT
  const showSearchInput = () => {
    searchInput.classList.add('search__input-active');
    loupe.classList.add('search__btn-loupe-inactive');
    searchBackBtn.classList.add('search__btn-back-active');
    searchClearBtn.classList.add('search__btn-clear-active');
    searchInput.focus();
  };

  const closeSearchInput = () => {
    searchInput.classList.remove('search__input-active');
    loupe.classList.remove('search__btn-loupe-inactive');
    searchBackBtn.classList.remove('search__btn-back-active');
    searchClearBtn.classList.remove('search__btn-clear-active');
    clearSearchInput();
  };

  searchBackBtn.addEventListener('click', closeSearchInput);
  loupe.addEventListener('click', showSearchInput);

  // CLOSE THE TASK
  const renderClosedTasks = (currentItem, currentItemId) => {
    tabData = tabData.map((item) => {
      if (item.id.toString() === currentItemId) {
        return {
          ...item,
          isCompleted: currentItem.checked,
        };
      }
      return item;
    });
  };
  // CLOSE THE TASK
  const closeTheTask = (ev) => {
    const currentItem = ev.currentTarget;
    currentItem.parentNode.classList.toggle('task-list__task-done');
    const currentItemId = currentItem.getAttribute('data-id');
    renderClosedTasks(currentItem, currentItemId);
  };

  const allCheckBox = document.querySelectorAll('input.task-list__checkbox');
  allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('click', closeTheTask);
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

// Highlight searched text
const addHighlight = (text, searchText) => {
  let re = new RegExp(`(${searchText})`, 'ig');
  return text.replace(re, `<mark>$1</mark>`);
};

//READ MORE / READ LESS
const resizeTaskContent = function (ev) {
  const clickedBtn = ev.currentTarget;
  const contentToExpand = clickedBtn.previousElementSibling;
  if (
    contentToExpand.classList.contains('task-list__task-description--shorten')
  ) {
    clickedBtn.innerText = 'read less...';
    contentToExpand.classList.remove('task-list__task-description--shorten');
  } else {
    clickedBtn.innerText = 'read more...';
    contentToExpand.classList.add('task-list__task-description--shorten');
  }
};

const shortenLongTask = (task) => {
  const itemHeight = task.clientHeight;

  if (itemHeight > MAX_TAB_HEIGHT) {
    const taskParagraph = task.lastElementChild;
    taskParagraph.classList.add('task-list__task-description--shorten');
    const btnReadMore = document.createElement('button');
    task.classList.add('task-list__task--long');
    task.appendChild(btnReadMore);
    btnReadMore.classList.add('task-list__btn-read-more');
    btnReadMore.innerText = 'read more...';
    btnReadMore.addEventListener('click', resizeTaskContent);
  }
};

// selectTaskDesktop = () => {
//   console.log('select Task funkcja działa');
//   newChild.classList.toggle('selected');
// };

const renderList = (items, searchText = '') => {
  const listContainer = document.querySelector('#list-container');
  listContainer.innerHTML = '';
  //
  items.forEach((item) => {
    const newChild = document.createElement('li');
    newChild.classList.add('task-list__task');

    const newChildEditDelete = document.createElement('div');
    newChildEditDelete.classList.add('task-list__task-edit-delete');
    newChildEditDelete.innerHTML = `
    <button class="task-list__btn-edit-delete"><i class="fa fa-pencil" aria-hidden="true"></i></button>
    <button class="task-list__btn-edit-delete">
    <i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
    console.log(newChildEditDelete);

    if (item.isCompleted) {
      newChild.classList.add('task-list__task-done');
    }

    // ITEM/TASK selection
    newChild.setAttribute('draggable', true);
    newChild.addEventListener('click', function () {
      console.log('select Task funkcja działa');
      newChild.classList.toggle('selected');
    });

    // Task SWIPE  START
    let touchstartX = 0;
    let touchendX = 0;
    function handleGestureX() {
      if (touchendX - touchstartX > 100) {
        console.log('swiped right!');
        newChildEditDelete.classList.remove('active-swipe');
        newChildTextContent.classList.remove('active-swipe');
      }
      if (touchendX - touchstartX < -100) {
        console.log('swiped left!');
        newChildEditDelete.classList.add('active-swipe');
        newChildTextContent.classList.add('active-swipe');
      }
    }

    newChild.addEventListener('touchstart', (e) => {
      touchstartX = e.changedTouches[0].screenX;
    });

    newChild.addEventListener('touchend', (e) => {
      touchendX = e.changedTouches[0].screenX;
      handleGestureX();
    });
    // Task swipe END

    let itemText = item.text;
    if (searchText) {
      itemText = addHighlight(itemText, searchText);
    }

    // console.log(itemText);
    newChild.innerHTML = `
    <div class="task-list__text-container">
			<input type="checkbox" class="task-list__checkbox" id="task_checkbox${
        item.id
      }"${item.isCompleted ? ' checked' : ''} data-id="${item.id}"/>
			<label for="task_checkbox${
        item.id
      }"><i class="fa fa-check" aria-hidden="true"></i></label>
			<p class="task-list__task-description">${itemText}</p>
    </div>
		`;

    const newChildTextContent = newChild.firstElementChild;
    listContainer.appendChild(newChild);
    shortenLongTask(newChildTextContent);
    newChild.appendChild(newChildEditDelete);
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

// --- start SEARCH TASK function
// const searchInput = document.getElementById('search');
const filterSearchTask = (ev) => {
  const searchText = ev.target.value.toLowerCase();
  if (tabActive.classList.contains('nav-status__btn-active')) {
    renderList(
      tabData.filter(
        (item) =>
          item.text.toLowerCase().includes(searchText) && !item.isCompleted
      ),
      searchText
    );
  } else if (tabCompleted.classList.contains('nav-status__btn-active')) {
    renderList(
      tabData.filter(
        (item) =>
          item.text.toLowerCase().includes(searchText) && item.isCompleted
      ),
      searchText
    );
  } else {
    renderList(
      tabData.filter((item) => item.text.toLowerCase().includes(searchText)),
      searchText
    );
  }
};
document
  .querySelector('.search__input')
  .addEventListener('input', filterSearchTask);

const filterTasksAccStatus = () => {
  if (tabActive.classList.contains('nav-status__btn-active')) {
    filterActive();
  } else if (tabCompleted.classList.contains('nav-status__btn-active')) {
    filterCompleted();
  } else {
    showAll();
  }
};

// clear search input
const clearSearchInput = () => {
  searchInput.value = '';
  filterTasksAccStatus();
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
const backToListBtn = document.querySelector(
  '.new-task-container__btn-back-to-list'
);
backToListBtn.addEventListener('click', closeNewTaskWindow);

// --- ADD NEW TASK   -
const addTaskBtn = document.querySelector('.new-task-container__btn-confirm');

const addItem = () => {
  const newTaskTextInput = document.querySelector(
    '.new-task-container__textarea'
  );
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

// START - Delete  selected Task on swipe

// END - Delete selected Task on swipe

// On start
showAll();

// Handle READ MORE on resize
window.addEventListener('resize', filterTasksAccStatus);
