// ====== html 요소 변수 선언  ======= //

const form = document.querySelector(".formControl");
const formInput = document.querySelector(".formInput");
const submitBtn = document.querySelector(".submitBtn");
const todoList = document.querySelector(".todoList");
const doneList = document.querySelector(".doneList");
const todoCountField = document.querySelector(".todoCount");
const doneCountField = document.querySelector(".doneCount");

// form | form 요소
// formInput | form 입력 영역 요소
// submitBtn | form 내 등록 버튼
// todoList | todoItem 가지는 list container
// doneList | doneItem 가지는 list container
// todoCountField, doneCountField | 각 count 값 가지는 text container

// ====== 초기화시 실행 동작 ======= //

window.addEventListener("DOMContentLoaded", () => {
  updateCnt();
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      if (item.value.type === "todo") {
        createTodoItem(item.id, item.value.text);
      } else if (item.value.type === "done") {
        createDoneItem(item.id, item.value.text);
      }
    });
  }

  // LocalStorage에서 Item을 불러오고, 비어있는 경우 예외
});

// ===== 등록 이벤트핸들러, Item 수 추적 ===== //

form.addEventListener("submit", addTodo);

function updateCnt() {
  todoCountField.textContent = todoList.children.length;
  doneCountField.textContent = doneList.children.length;
}

// ====== Todo, Done List 조작 관련 함수들 ======= //

function addTodo(e) {
  e.preventDefault();
  const value = formInput.value;
  const id = new Date().getTime().toString();

  if (value !== "") {
    createTodoItem(id, value);
    addToLocalStorage(id, { text: value, type: "todo" });
  }

  formInput.value = "";
  updateCnt();

  // Form에서 넘어온 값이 공백인 경우 넘기기
  // Unique ID를 생성하기 위해 등록시점의 시간을 사용 (millisecond 단위)
}

function moveToDone(e) {
  const todoItem = e.currentTarget.parentElement;
  const id = todoItem.getAttribute("id");
  const itemText = todoItem.textContent.slice(0, -3);

  todoList.removeChild(todoItem);
  editLocalStorage(id, { text: itemText, type: "done" });

  createDoneItem(id, itemText);
  updateCnt();

  // button 기준 parentELement = doneItem
  // Unique ID를 기준으로 localStorage 수정
}
function moveToTodo(e) {
  const doneItem = e.currentTarget.parentElement;
  const id = doneItem.getAttribute("id");
  const itemText = doneItem.textContent.slice(0, -3);

  //textContent로 불러올 시 "  \n"이 더해지는 현상이 있어 slice로 처리

  doneList.removeChild(doneItem);
  editLocalStorage(id, { text: itemText, type: "todo" });

  createTodoItem(id, itemText);
  updateCnt();

  // button 기준 parentELement = todoItem
  // Unique ID를 기준으로 localStorage 수정
}

// ====== Item 조작 관련 함수들 ======= //

function deleteTodoItem(e) {
  const todoItem = e.currentTarget.parentElement;
  const id = todoItem.getAttribute("id");
  todoList.removeChild(todoItem);
  removeFromLocalStorage(id);
  updateCnt();

  // button 기준 parentELement = doneItem
}

function deleteDoneItem(e) {
  const doneItem = e.currentTarget.parentElement;
  const id = doneItem.getAttribute("id");
  doneList.removeChild(doneItem);
  removeFromLocalStorage(id);
  updateCnt();

  // button 기준 parentELement = todoItem
}

function createTodoItem(id, itemText) {
  const todoItem = document.createElement("div");
  let attribute = document.createAttribute("id");
  attribute.value = id;
  todoItem.setAttributeNode(attribute);
  todoItem.classList.add("item");

  // 새로운 div element 생성 후 인자로 전달된 unique id를 attribute으로 설정
  // 'item' 클래스는 각 아이템의 css 스타일 프리셋

  todoItem.innerHTML = `<button class="itemFinish" type="button"><p class="itemTitle">${itemText}</p></button>
  <button class="itemDelete" type="button"><p><i class="fa fa-solid fa-trash"></i></p></button>`;

  const moveBtn = todoItem.querySelector(".itemFinish");
  moveBtn.addEventListener("click", moveToDone);
  const deleteBtn = todoItem.querySelector(".itemDelete");
  deleteBtn.addEventListener("click", deleteTodoItem);
  todoList.appendChild(todoItem);

  //각각 moveTodone(doneList로 이동), deleteTodoItem(todoList에서 삭제) 함수 연결
}

function createDoneItem(id, itemText) {
  const doneItem = document.createElement("div");
  let attribute = document.createAttribute("id");
  attribute.value = id;
  doneItem.setAttributeNode(attribute);
  doneItem.classList.add("item");

  doneItem.innerHTML = `<button class="itemFinish" type="button"><p class="itemTitle"><del>${itemText}</del></p></button>
  <button class="itemDelete" type="button"><p><i class="fa fa-solid fa-trash"></i></p></button>`;

  const moveBtn = doneItem.querySelector(".itemFinish");
  moveBtn.addEventListener("click", moveToTodo);
  const deleteBtn = doneItem.querySelector(".itemDelete");
  deleteBtn.addEventListener("click", deleteDoneItem);
  doneList.appendChild(doneItem);

  //각각 moveTodone(todoList로 이동), deleteTodoItem(doneList에서 삭제) 함수 연결
}

// ====== Storage 조작 관련 함수들 ======= //
// 과거 수강했었던 강의의 코드를 참조했습니다
// https://www.youtube.com/c/CodingAddict/videos
//list | {id, {value: value, type: type}} 구조

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function addToLocalStorage(id, value) {
  console.log(value);
  const item = { id, value };
  let items = getLocalStorage();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  console.log(id);
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
