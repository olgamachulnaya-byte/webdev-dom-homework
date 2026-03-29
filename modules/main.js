import { comments, setComments } from "./commentsData.js";
import { renderComments } from "./render.js";
import { formatText, formatDate } from "./utils.js";
import { initLikeListeners, initReplyListeners } from "./listeners.js";
import {
  addCommentApi,
  getCommentsApi,
  loginApi,
  registerApi,
} from "./api.js";
import { renderLoginComponent } from "./loginComponent.js";
import { renderRegisterComponent } from "./registerComponent.js";

const STORAGE_KEY = "comments-app-user";

const commentsList = document.getElementById("comments-list");
const commentsLoading = document.getElementById("comments-loading");
const authRoot = document.getElementById("auth-root");

let user = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
let currentPage = "comments";
let authErrorMessage = "";
let isAuthLoading = false;

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

const saveUser = (nextUser) => {
  user = nextUser;

  if (!nextUser) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
};

const renderCommentForm = () => {
  authRoot.innerHTML = `
    <div id="add-form" class="add-form">
      <input
        type="text"
        id="name-input"
        class="add-form-name"
        value="${formatText(user.name)}"
        readonly
      />
      <textarea
        id="text-input"
        class="add-form-text"
        placeholder="Введите ваш комментарий"
        rows="4"
      ></textarea>
      <div class="add-form-row">
        <button id="add-button" class="add-form-button">Написать</button>
      </div>
    </div>
    <p id="add-form-loading" class="status-message hidden">Комментарий добавляется</p>
  `;

  const addButton = document.getElementById("add-button");
  const textInput = document.getElementById("text-input");
  const addForm = document.getElementById("add-form");
  const addFormLoading = document.getElementById("add-form-loading");

  const setAddFormLoading = (isLoading) => {
    addForm.classList.toggle("hidden", isLoading);
    addFormLoading.classList.toggle("hidden", !isLoading);
  };

  addButton.addEventListener("click", () => {
    const text = textInput.value.trim();

    if (!text) {
      return;
    }

    addButton.disabled = true;
    setAddFormLoading(true);

    addCommentApi({ text, token: user.token })
      .then(() => {
        textInput.value = "";

        return getCommentsApi();
      })
      .then((commentsResponse) => {
        setComments(commentsResponse.comments.map(mapApiComment));
        appRender();
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        addButton.disabled = false;
        setAddFormLoading(false);
      });
  });
};

const renderUnauthorizedSection = () => {
  authRoot.innerHTML = `
    <p class="status-message">
      Чтобы добавить комментарий, <a href="#" id="go-to-login" class="auth-link">авторизуйтесь</a>
    </p>
  `;

  document.getElementById("go-to-login").addEventListener("click", (event) => {
    event.preventDefault();
    currentPage = "login";
    authErrorMessage = "";
    renderBottomSection();
  });
};

const onAuthSuccess = (response) => {
  saveUser({
    name: response.user.name,
    login: response.user.login,
    token: response.user.token,
  });
  currentPage = "comments";
  appRender();
};

const handleAuthRequest = (request) => {
  isAuthLoading = true;
  authErrorMessage = "";
  renderBottomSection();

  request
    .then(onAuthSuccess)
    .catch((error) => {
      authErrorMessage = error.message;
      renderBottomSection();
    })
    .finally(() => {
      isAuthLoading = false;
      renderBottomSection();
    });
};

const renderLoginPage = () => {
  renderLoginComponent({
    container: authRoot,
    errorMessage: authErrorMessage,
    isLoading: isAuthLoading,
    onGoToRegister: () => {
      currentPage = "register";
      authErrorMessage = "";
      renderBottomSection();
    },
    onLogin: ({ login, password }) => {
      if (!login || !password) {
        authErrorMessage = "Заполните логин и пароль";
        renderBottomSection();
        return;
      }

      handleAuthRequest(loginApi({ login, password }));
    },
  });
};

const renderRegisterPage = () => {
  renderRegisterComponent({
    container: authRoot,
    errorMessage: authErrorMessage,
    isLoading: isAuthLoading,
    onGoToLogin: () => {
      currentPage = "login";
      authErrorMessage = "";
      renderBottomSection();
    },
    onRegister: ({ login, name, password }) => {
      if (!login || !name || !password) {
        authErrorMessage = "Заполните все поля";
        renderBottomSection();
        return;
      }

      handleAuthRequest(registerApi({ login, name, password }));
    },
  });
};

const renderBottomSection = () => {
  if (currentPage === "login") {
    renderLoginPage();
    return;
  }

  if (currentPage === "register") {
    renderRegisterPage();
    return;
  }

  if (user) {
    renderCommentForm();
    return;
  }

  renderUnauthorizedSection();
};

const appRender = () => {
  renderComments(comments, commentsList);
  renderBottomSection();

  initLikeListeners(comments, commentsList, appRender);

  const textInput = document.getElementById("text-input");
  if (textInput) {
    initReplyListeners(comments, textInput);
  }
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

loadComments().catch((error) => {
  alert(error.message);
});
