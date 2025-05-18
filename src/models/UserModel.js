// src/models/UserModel.js - 添加 getUserProfileById 方法
import { 
  registerUser, 
  loginWithEmail, 
  logoutUser,
  observeAuthState
} from "../services/authService";
import { 
  getUserProfile, 
  updateUserNickname, 
  updateUserAvatar,
  getUserProfileById   // 导入新添加的函数
} from "../services/userProfileService";
import { resolvePromise } from "../services/resolvePromise";

export const userModel = {
  // 用户状态
  currentUser: null,
  authError: null,
  authLoading: false,
  
  // 个人资料状态
  userProfile: null,
  profileLoading: false,
  profileError: null,
  
  // Promise状态
  loginPromiseState: {},
  registerPromiseState: {},
  profilePromiseState: {},
  updateNicknamePromiseState: {},
  updateAvatarPromiseState: {},
  
  // 初始化认证监听器
  initAuth(onUserChange) {
    return observeAuthState(async (user) => {
      this.currentUser = user;
      
      // 如果用户已登录,加载其个人资料
      if (user) {
        await this.loadUserProfile();
      } else {
        this.userProfile = null;
      }
      
      if (onUserChange) {
        onUserChange(user);
      }
    });
  },
  
  // 从Firestore加载用户个人资料
  async loadUserProfile() {
    if (!this.currentUser) return;
    
    this.profileLoading = true;
    this.profileError = null;
    
    try {
      const promise = getUserProfile();
      resolvePromise(promise, this.profilePromiseState);
      
      const profile = await promise;
      this.userProfile = profile;
      this.profileLoading = false;
      return profile;
    } catch (error) {
      this.profileError = error.message;
      this.profileLoading = false;
      throw error;
    }
  },
  
  // 更新用户昵称
  async updateNickname(nickname) {
    if (!this.currentUser) {
      throw new Error("用户未登录");
    }
    
    this.profileLoading = true;
    this.profileError = null;
    
    try {
      const promise = updateUserNickname(nickname);
      resolvePromise(promise, this.updateNicknamePromiseState);
      
      await promise;
      
      // 更新本地个人资料
      if (this.userProfile) {
        this.userProfile.nickname = nickname;
      }
      
      this.profileLoading = false;
      return true;
    } catch (error) {
      this.profileError = error.message;
      this.profileLoading = false;
      throw error;
    }
  },
  
  // 更新用户头像
  async updateAvatar(imageFile) {
    if (!this.currentUser) {
      throw new Error("用户未登录");
    }
    
    this.profileLoading = true;
    this.profileError = null;
    
    try {
      const promise = updateUserAvatar(imageFile);
      resolvePromise(promise, this.updateAvatarPromiseState);
      
      const avatarUrl = await promise;
      
      // 更新本地个人资料
      if (this.userProfile) {
        this.userProfile.avatarUrl = avatarUrl;
      }
      
      this.profileLoading = false;
      return avatarUrl;
    } catch (error) {
      this.profileError = error.message;
      this.profileLoading = false;
      throw error;
    }
  },
  
  // 新增: 根据ID获取用户资料
  async getUserProfileById(userId) {
    try {
      // 调用服务函数来获取用户资料
      const profile = await getUserProfileById(userId);
      return profile;
    } catch (error) {
      console.error(`获取用户 ${userId} 资料时出错:`, error);
      throw error;
    }
  },
  
  // 注册新用户
  async register(email, password) {
    this.authLoading = true;
    this.authError = null;
    
    try {
      const promise = registerUser(email, password);
      resolvePromise(promise, this.registerPromiseState);
      
      const user = await promise;
      this.authLoading = false;
      return user;
    } catch (error) {
      this.authError = error.message;
      this.authLoading = false;
      throw error;
    }
  },
  
  // 使用邮箱和密码登录
  async login(email, password) {
    this.authLoading = true;
    this.authError = null;
    
    try {
      const promise = loginWithEmail(email, password);
      resolvePromise(promise, this.loginPromiseState);
      
      const user = await promise;
      this.authLoading = false;
      return user;
    } catch (error) {
      this.authError = error.message;
      this.authLoading = false;
      throw error;
    }
  },
  
  // 登出
  async logout() {
    this.authLoading = true;
    
    try {
      await logoutUser();
      // 明确地设置 currentUser 为 null
      this.currentUser = null;
      this.userProfile = null;
      this.authLoading = false;
      return true;
    } catch (error) {
      this.authError = error.message;
      this.authLoading = false;
      throw error;
    }
  }
};