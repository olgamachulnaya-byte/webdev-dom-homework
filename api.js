const API_URL = "https://wedev-api.sky.pro/api/v1/irina-1/comments";

export const getCommentsApi = () => {
  return fetch(API_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Не удалось загрузить комментарии");
    }

    return response.json();
  });
};

export const addCommentApi = ({ name, text }) => {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      text,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Не удалось добавить комментарий");
    }

    return response.json();
  });
};
