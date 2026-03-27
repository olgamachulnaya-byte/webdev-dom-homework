import { comments, setComments } from "./commentsData.js";
import { renderComments } from "./render.js";
import { formatText, formatDate } from "./utils.js";
import { initLikeListeners, initReplyListeners } from "./listeners.js";
import { addCommentApi, getCommentsApi } from "./api.js";

const commentsList = document.getElementById("comments-list");
const commentsLoading = document.getElementById("comments-loading");
const addForm = document.getElementById("add-form");
const addFormLoading = document.getElementById("add-form-loading");
const addButton = document.getElementById("add-button");
const nameInput = document.getElementById("name-input");
const textInput = document.getElementById("text-input");

const mapApiComment = (comment) => ({
  name: formatText(comment.author.name),
  date: formatDate(comment.date),
  text: formatText(comment.text),
  likes: 0,
  isLiked: false,
});

const setCommentsLoading = (isLoading) => {
  commentsLoading.classList.toggle("hidden", !isLoading);
  commentsList.classList.toggle("hidden", isLoading);
};

const setAddFormLoading = (isLoading) => {
  addForm.classList.toggle("hidden", isLoading);
  addFormLoading.classList.toggle("hidden", !isLoading);
};

const appRender = () => {
  renderComments(comments, commentsList);
  initLikeListeners(comments, commentsList, appRender);
  initReplyListeners(comments, textInput);
};

const loadComments = () => {
  setCommentsLoading(true);

  return getCommentsApi()
    .then((commentsResponse) => {
      setComments(commentsResponse.comments.map(mapApiComment));
      appRender();
    })
    .finally(() => {
      setCommentsLoading(false);
    });
};

const showError = (error) => {
  alert(error.message);
};

const addCommentWithRetry = ({ name, text }) => {
  return addCommentApi({ name, text }).catch((error) => {
    if (error.message === "Ошибка сервера") {
      return addCommentWithRetry({ name, text });
    }

    throw error;
  });
};

addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    return;
  }

  addButton.disabled = true;
  setAddFormLoading(true);

  addCommentWithRetry({ name, text })
    .then(() => {
      nameInput.value = "";
      textInput.value = "";

      return getCommentsApi();
    })
    .then((commentsResponse) => {
      setComments(commentsResponse.comments.map(mapApiComment));
      appRender();
    })
    .catch(showError)
    .finally(() => {
      addButton.disabled = false;
      setAddFormLoading(false);
    });
});

loadComments().catch(showError);
