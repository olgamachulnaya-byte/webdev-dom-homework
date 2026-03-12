const API_URL = "https://wedev-api.sky.pro/api/v1/irina-l/comments";

export const getCommentsApi = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не удалось загрузить комментарии");
  }

  return response.json();
};

export const addCommentApi = async ({ name, text }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error("Не удалось добавить комментарий");
  }

  return response.json();
};
