const MAX_TAB_HEIGHT = 132; // 3x line height, wrap overflowing text
let tabData = JSON.parse(document.querySelector('#data-source').innerHTML);

const state = {
  currentTaskId: '',
};

const loupe = document.querySelector('.search__btn-loupe');
const searchInput = document.querySelector('.search__input');
const searchBackBtn = document.querySelector('.search__btn-back');
const searchClearBtn = document.querySelector('.search__btn-clear');

const initList = () => {
  // ----- CLOSE THE TASK -Start
  // TODO dlaczego renderClosedTasks znajduje się w initList, a nie globalnie?
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
  const closeTheTask = (ev) => {
    const currentItem = ev.currentTarget;
    currentItem.parentNode.parentNode.classList.toggle('task-list__task-done');
    console.log(currentItem.parentNode.parentNode);
    const currentItemId = currentItem.getAttribute('data-id');
    renderClosedTasks(currentItem, currentItemId);
  };

  const allCheckBox = document.querySelectorAll('input.task-list__checkbox');
  allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('click', closeTheTask);
  });
  // ----- CLOSE THE TASK - End

  // ----- Switch TABS  (All/Active/Completed)
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

  // ----- DELETE TASK on Swipe
  const allTrashBin = document.querySelectorAll(
    'button.task-list__btn-edit-delete.trash'
  );
  allTrashBin.forEach((trashBin) => {
    trashBin.addEventListener('click', deleteTask);
  });

  // ----- EDIT TASK on Swipe
  const allPencil = document.querySelectorAll(
    'button.task-list__btn-edit-delete.pencil'
  );
  allPencil.forEach((pencil) => {
    pencil.addEventListener('click', handlePencilClick);
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
//  *** initList END

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

    const taskEditDelete = document.createElement('div');
    taskEditDelete.classList.add('task-list__task-edit-delete');
    taskEditDelete.setAttribute('data-id', item.id);
    taskEditDelete.innerHTML = `
    <button class="task-list__btn-edit-delete pencil"><i class="fa fa-pencil" aria-hidden="true"></i></button>
    <button class="task-list__btn-edit-delete trash">
    <i class="fa fa-trash-o" aria-hidden="true"></i></button>`;

    if (item.isCompleted) {
      newChild.classList.add('task-list__task-done');
    }

    // ITEM/TASK selection
    // newChild.setAttribute('draggable', true);
    // newChild.addEventListener('click', function () {
    //   console.log('select Task funkcja działa');
    //   newChild.classList.toggle('selected');
    // });

    // ---- Task SWIPE  START
    let touchstartX = 0;
    let touchendX = 0;
    function handleGestureX() {
      if (touchendX - touchstartX > 60) {
        taskEditDelete.classList.remove('active-swipe');
        taskTextContent.classList.remove('active-swipe');
      }
      if (touchendX - touchstartX < -60) {
        removeSwipe();
        taskEditDelete.classList.add('active-swipe');
        taskTextContent.classList.add('active-swipe');
      }
    }

    // BUG [Violation] Added non-passive event listener to a scroll-blocking <some> event. Consider marking event handler as 'passive' to make the page more responsive. See <URL>
    // main.js:177 [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
    newChild.addEventListener('touchstart', (ev) => {
      touchstartX = ev.changedTouches[0].screenX;
    });

    newChild.addEventListener('touchend', (ev) => {
      touchendX = ev.changedTouches[0].screenX;
      handleGestureX();
    });
    // ---- Task swipe END

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

    const taskTextContent = newChild.firstElementChild;
    listContainer.appendChild(newChild);
    shortenLongTask(taskTextContent);
    newChild.appendChild(taskEditDelete);
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
const openNewTaskWindow = () => {
  newTaskWindow.classList.remove('new-task-container-hide');
  document.body.style.overflow = 'hidden';
};
const newTaskWindow = document.querySelector('.new-task-container');
const plusBtn = document.querySelector('.footer__btn-add-task');
plusBtn.addEventListener('click', openNewTaskWindow);

// Add Task - close window
const closeNewTaskWindow = () => {
  newTaskWindow.classList.add('new-task-container-hide');
  document.body.style.overflow = 'visible';
};

const closeAddNewTaskWindowBtn = document.querySelector(
  '.new-task-container__btn-close-x'
);
closeAddNewTaskWindowBtn.addEventListener('click', closeNewTaskWindow);

// --- ADD NEW TASK   -
const backToListBtn = document.querySelector(
  '.new-task-container__btn-back-to-list'
);
const addTaskBtn = document.querySelector('.new-task-container__btn-confirm');
const newTaskTextInput = document.querySelector(
  '.new-task-container__textarea'
);
const addItem = () => {
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
backToListBtn.addEventListener('click', addItem);
//  end ADD TASK

// REMOVE SWIPE
const removeSwipe = () => {
  const allSwipedTasks = document.querySelectorAll('li div.active-swipe');
  allSwipedTasks.forEach((swipedTask) => {
    swipedTask.classList.remove('active-swipe');
  });
};

// *** EDIT TASK ON SWIPE - Start

// const allPencil = document.querySelectorAll(
//   'button.task-list__btn-edit-delete.pencil'
// );

const backToListSaveBtn = document.querySelector(
  '.edit-task-container__btn-back-to-list'
);
const saveTaskBtn = document.querySelector('.edit-task-container__btn-save');
const closeEditTaskWindowBtn = document.querySelector(
  '.edit-task-container__btn-close-x'
);

const getTaskId = (ev) => {
  const currentTask = ev.currentTarget;
  const taskId = currentTask.parentNode.getAttribute('data-id') - 1;
  state.currentTaskId = taskId;
  return taskId;
};

const openEditTaskWindow = () => {
  editTaskWindow.classList.remove('edit-task-container-hide');
  document.body.style.overflow = 'hidden';
};

const closeEditTaskWindow = () => {
  removeSwipe();
  editTaskWindow.classList.add('edit-task-container-hide');
  document.body.style.overflow = 'visible';
};

const showEditedTask = (taskId) => {
  const editTaskTextInput = document.querySelector(
    '.edit-task-container__textarea'
  );

  openEditTaskWindow();
  const taskTextBeforeChange = tabData[taskId].text;
  editTaskTextInput.value = taskTextBeforeChange;
};

const handlePencilClick = (ev) => {
  const id = getTaskId(ev);
  showEditedTask(id);
};

const editTaskWindow = document.querySelector('.edit-task-container');
const saveEditedTask = () => {
  const editTaskTextInput = document.querySelector(
    '.edit-task-container__textarea'
  );
  let taskId = state.currentTaskId;
  const taskTextAfterChange = editTaskTextInput.value;
  tabData[taskId].text = taskTextAfterChange;
  filterTasksAccStatus();
  closeEditTaskWindow();
};

// Listeners
saveTaskBtn.addEventListener('click', saveEditedTask);
backToListSaveBtn.addEventListener('click', saveEditedTask);
closeEditTaskWindowBtn.addEventListener('click', closeEditTaskWindow);

// *** EDIT TASK ON SWIPE - End

// *** DELETE TASK on swipe - Start
const renderTaskAfterDelete = (currentItemId) => {
  tabData.splice(currentItemId, 1);
  for (let i = 0; i < tabData.length; i++) {
    tabData[i].id = i + 1;
  }
  showAll();
  // return tabData;
};

const deleteTask = (ev) => {
  console.log(tabData);
  const currentItem = ev.currentTarget;
  const currentItemId = currentItem.parentNode.getAttribute('data-id') - 1;
  // console.log('will be deleted item nr:' + tabData[currentItemId].text);
  renderTaskAfterDelete(currentItemId);
  console.log(tabData);
};
// *** DELETE TASK on swipe - End

// On start
showAll();

// Handle READ MORE on resize
window.addEventListener('resize', filterTasksAccStatus);
