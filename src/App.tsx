import React, { useState } from "react";
import "./App.css";
import logo from "/logo.svg";

type FormData = {
  email: string;
  password: string;
};

const AuthForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Необходимо указать email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Невалидная почта.";
    }
    if (!formData.password) {
      newErrors.password = "Введите пароль.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть длиной 6 символов.";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: () =>
              Promise.resolve({ message: "Вы успешно авторизовались" }),
          });
        }, 1000)
      );

      if ((response as Response).ok) {
        const data = await (response as Response).json();
        alert(data.message);
      } else {
        alert("Почта или пароль не подходят.");
      }
    } catch (err) {}

    if (validate()) {
      console.log("Форма:", formData);
      setFormData({ email: "", password: "" });
      setErrors({});
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        aria-labelledby="auth-title"
      >
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <h2 id="auth-title" className="auth-title">
          Авторизуйтесь
        </h2>

        <div className={`form-group ${errors.email ? "error" : ""}`}>
          <label htmlFor="email">Эл. Почта</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="duh@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <div id="email-error" className="error-message">
              {errors.email}
            </div>
          )}
        </div>

        <div className={`form-group ${errors.password ? "error" : ""}`}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Введите пароль"
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <div id="password-error" className="error-message">
              {errors.password}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="auth-button"
          aria-label="Sign in to your account"
        >
          Подтвердить
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
