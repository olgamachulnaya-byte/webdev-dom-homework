const API_URL = "https://wedev-api.sky.pro/api/v1/irina-1/comments";

const createApiError = (response) => {
  const status = response.status;

  if (status >= 500) {
    return new Error("SERVER_ERROR");
  }

  if (status === 400) {
    return new Error("BAD_REQUEST");
  }

  return new Error("API_ERROR");
};

const handleResponse = (response) => {
  if (!response.ok) {
    throw createApiError(response);
  }

  return response.json();
};

const handleNetworkError = (error) => {
  if (error instanceof TypeError) {
    throw new Error("NETWORK_ERROR");
  }

  throw error;
};

export const getCommentsApi = () => {
  return fetch(API_URL).then(handleResponse).catch(handleNetworkError);
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
      forceError: true,
    }),
  })
    .then(handleResponse)
    .catch(handleNetworkError);
};
