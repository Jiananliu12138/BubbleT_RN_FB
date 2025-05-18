// src/presenters/loginPresenter.jsx
import { observer } from "mobx-react-lite";
import { LoginView } from "../views/loginView";
import { router } from "expo-router";
import { useEffect } from "react";

export const Login = observer(function Login(props) {
  const { user } = props.model;
  
  // 使用 useEffect 处理导航，而不是在渲染过程中
  useEffect(() => {
    if (user.currentUser) {
      // 确保用户已登录时才重定向
      router.replace("/");
    }
  }, [user.currentUser]);
  
  // 如果用户已登录，仍然返回 null，但不在这里导航
  if (user.currentUser) {
    return null;
  }
  
  async function handleLoginACB(email, password) {
    try {
      await user.login(email, password);
      // 登录成功后的导航移到 useEffect 中处理
    } catch (error) {
      console.error("Login error:", error);
      // Error is already set in the model
    }
  }
  
  async function handleRegisterACB(email, password) {
    try {
      await user.register(email, password);
      // 注册成功后的导航移到 useEffect 中处理
    } catch (error) {
      console.error("Registration error:", error);
      // Error is already set in the model
    }
  }
  
  return (
    <LoginView
      onLogin={handleLoginACB}
      onRegister={handleRegisterACB}
      loading={user.authLoading}
      error={user.authError}
    />
  );
});