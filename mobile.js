const ul = document.querySelector('ul');

const onTouch = (e) => {
  console.log('on Touch ruszylo');
  console.log(e.currentTarget);
  console.log(allTasks);
};

const init = () => {
  const allTasks = [...document.querySelectorAll('.task-list__task')];
  allTasks.forEach((task) => {
    task.addEventListener('touchdown', onTouch);
    task.addEventListener('mousedown', onTouch);
    task.addEventListener('click', onTouch);
  });
};

init();
