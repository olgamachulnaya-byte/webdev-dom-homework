const API_URL = "https://wedev-api.sky.pro/api/v2/irina-1/comments";
const LOGIN_URL = "https://wedev-api.sky.pro/api/user/login";
const REGISTER_URL = "https://wedev-api.sky.pro/api/user";

const getErrorMessageByStatus = (status) => {
  if (status === 400) {
    return "Проверьте корректность введенных данных";
  }

  if (status === 401) {
    return "Неверный логин или пароль";
  }

  if (status >= 500) {
    return "Ошибка сервера";
  }

  return "Что-то пошло не так, попробуйте позже";
};

const requestJson = (url, options) => {
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(getErrorMessageByStatus(response.status));
      }

      return response.json();
    })
    .catch((error) => {
      if (error instanceof TypeError) {
        throw new Error("Кажется, у вас пропал интернет, попробуйте позже");
      }

      throw error;
    });
};

export const getCommentsApi = () => {
  return requestJson(API_URL);
};

export const addCommentApi = ({ text, token }) => {
  return requestJson(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text,
      forceError: true,
    }),
  });
};

export const loginApi = ({ login, password }) => {
  return requestJson(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });
};

export const registerApi = ({ login, name, password }) => {
  return requestJson(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  });
};
