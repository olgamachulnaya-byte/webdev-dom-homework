import { comments } from "./commentsData.js";
import { renderComments } from "./render.js";
import { formatText } from "./utils.js";
import { initLikeListeners, initReplyListeners } from "./listeners.js";

const commentsList = document.getElementById("comments-list");
const addButton = document.getElementById("add-button");
const nameInput = document.getElementById("name-input");
const textInput = document.getElementById("text-input");


const appRender = () => {
  renderComments(comments, commentsList);
  initLikeListeners(comments, commentsList, appRender);
  initReplyListeners(comments, textInput);
};

addButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) return;

  const dateStr = new Date().toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).replace(',', '');

  comments.push({
    name: formatText(name),
    date: dateStr,
    text: formatText(text),
    likes: 0,
    isLiked: false
  });

  nameInput.value = "";
  textInput.value = "";
  appRender();
});


appRender();