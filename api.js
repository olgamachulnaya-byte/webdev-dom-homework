const API_URL = "https://wedev-api.sky.pro/api/v1/irina-1/comments";

const getErrorMessageByStatus = (status) => {
  if (status === 400) {
    return "Имя и комментарий должны быть не короче 3 символов";
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

export const addCommentApi = ({ name, text }) => {
  return requestJson(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      text,
      forceError: true,
    }),
  });
};
