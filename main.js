import { comments, setComments } from "./commentsData.js";
import { renderComments } from "./render.js";
import { formatText, formatDate } from "./utils.js";
import { initLikeListeners, initReplyListeners } from "./listeners.js";
import { addCommentApi, getCommentsApi } from "./api.js";

const commentsList = document.getElementById("comments-list");
const addButton = document.getElementById("add-button");
const nameInput = document.getElementById("name-input");
const textInput = document.getElementById("text-input");

const mapApiComment = (comment) => ({
  name: formatText(comment.name),
  date: formatDate(comment.date),
  text: formatText(comment.text),
  likes: 0,
  isLiked: false,
});

const appRender = () => {
  renderComments(comments, commentsList);
  initLikeListeners(comments, commentsList, appRender);
  initReplyListeners(comments, textInput);
};

const loadComments = async () => {
  const commentsFromApi = await getCommentsApi();
  setComments(commentsFromApi.map(mapApiComment));
  appRender();
};

const showError = () => {
  alert("Что-то пошло не так, попробуйте позже");
};

addButton.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) return;

  addButton.disabled = true;

  try {
    await addCommentApi({ name, text });

    nameInput.value = "";
    textInput.value = "";

    await loadComments();
  } catch (error) {
    showError();
  } finally {
    addButton.disabled = false;
  }
});

loadComments().catch(showError);
