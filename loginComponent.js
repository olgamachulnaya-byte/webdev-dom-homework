export const renderLoginComponent = ({
  containe,
  onLogin,
  onGoToRegister,
  errorMessage,
  isLoading,
}) => {
  container.innerHTML = `
    <div class="add-form">
      <h3>Вход</h3>
      <input
        type="text"
        class="add-form-name"
        id="login-input"
        placeholder="Логин"
      />
      <input
        type="password"
        class="add-form-name"
        id="password-input"
        placeholder="Пароль"
      />
      ${errorMessage ? `<p class="auth-error">${errorMessage}</p>` : ""}
      <div class="add-form-row">
        <button class="add-form-button" id="login-button" ${isLoading ? "disabled" : ""}>Войти</button>
      </div>
      <p class="auth-switch">Нет аккаунта? <a href="#" id="go-to-register">Зарегистрируйтесь</a></p>
    </div>
  `;

  container.querySelector("#login-button").addEventListener("click", () => {
    const login = container.querySelector("#login-input").value.trim();
    const password = container.querySelector("#password-input").value.trim();

    onLogin({ login, password });
  });

  container.querySelector("#go-to-register").addEventListener("click", (event) => {
    event.preventDefault();
    onGoToRegister();
  });
};
