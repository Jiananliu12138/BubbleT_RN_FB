// src/presenters/onboardingPresenter.jsx
import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { OnboardingView } from "../views/onboardingView";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Onboarding = observer(function Onboarding(props) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // 检查状态但不导航
  useEffect(() => {
    async function checkOnboardingStatus() {
      setIsCheckingStatus(true);
      try {
        const value = await AsyncStorage.getItem('@onboarding_complete');
        console.log("Onboarding status check:", value);
        
        // 只更新本地状态，不执行导航
        if (value === 'true') {
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    }
    
    checkOnboardingStatus();
  }, []);
  
  // 处理引导完成 - 使用 layout 提供的全局函数
  async function handleOnboardingCompleteACB() {
    console.log("引导完成被触发");
    
    // 使用 _layout.jsx 中定义的全局函数
    if (global.completeOnboarding) {
      try {
        const success = await global.completeOnboarding();
        console.log("引导完成状态:", success);
        
        // 只在本地更新状态，让 _layout 处理导航
        if (success) {
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error("完成引导出错:", error);
      }
    } else {
      console.error("未找到全局 completeOnboarding 函数");
      
      // 作为后备，直接更新 AsyncStorage
      try {
        await AsyncStorage.setItem('@onboarding_complete', 'true');
        setShowOnboarding(false);
      } catch (error) {
        console.error("直接设置 AsyncStorage 出错:", error);
      }
    }
  }
  
  // 状态检查中显示空白
  if (isCheckingStatus) {
    return null;
  }
  
  // 渲染引导视图
  return <OnboardingView onComplete={handleOnboardingCompleteACB} />;
});