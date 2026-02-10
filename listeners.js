import { renderComments } from "./render.js";

export const initLikeListeners = (comments, commentsList, callback) => {
  const likeButtons = document.querySelectorAll('.like-button');

  likeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const index = button.dataset.index;
      const comment = comments[index];

      comment.isLiked ? comment.likes-- : comment.likes++;
      comment.isLiked = !comment.isLiked;

      
      callback();
    });
  });
};

export const initReplyListeners = (comments, textInput) => {
  const commentElements = document.querySelectorAll('.comment');

  commentElements.forEach((element) => {
    element.addEventListener('click', () => {
      const index = element.dataset.index;
      const comment = comments[index];
      textInput.value = `> ${comment.text}\n\n${comment.name}, `;
      textInput.focus();
    });
  });
};