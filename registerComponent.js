export const renderRegisterComponent = ({
  container,
  onRegister,
  onGoToLogin,
  errorMessage,
  isLoading,
}) => {
  container.innerHTML = `
    <div class="add-form">
      <h3>Регистрация</h3>
      <input
        type="text"
        class="add-form-name"
        id="register-login-input"
        placeholder="Логин"
      />
      <input
        type="text"
        class="add-form-name"
        id="register-name-input"
        placeholder="Имя"
      />
      <input
        type="password"
        class="add-form-name"
        id="register-password-input"
        placeholder="Пароль"
      />
      ${errorMessage ? `<p class="auth-error">${errorMessage}</p>` : ""}
      <div class="add-form-row">
        <button class="add-form-button" id="register-button" ${isLoading ? "disabled" : ""}>Зарегистрироваться</button>
      </div>
      <p class="auth-switch">Уже есть аккаунт? <a href="#" id="go-to-login">Войдите</a></p>
    </div>
  `;

  container.querySelector("#register-button").addEventListener("click", () => {
    const login = container.querySelector("#register-login-input").value.trim();
    const name = container.querySelector("#register-name-input").value.trim();
    const password = container.querySelector("#register-password-input").value.trim();

    onRegister({ login, name, password });
  });

  container.querySelector("#go-to-login").addEventListener("click", (event) => {
    event.preventDefault();
    onGoToLogin();
  });
};
