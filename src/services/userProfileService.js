// src/services/userProfileService.js - 添加 getUserProfileById 函数
import { auth, db, storage } from "./firebaseConfig";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

/**
 * 从Firestore获取用户资料数据
 * @returns {Promise<Object>} 用户资料数据
 */
export async function getUserProfile() {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("用户未登录");
    }
    
    // 检查用户在Firestore中是否有资料
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // 如果不存在资料,用默认值创建一个
      const defaultProfile = {
        uid: user.uid,
        email: user.email,
        nickname: user.displayName || user.email.split('@')[0], // 默认昵称
        avatarUrl: user.photoURL || null,
        phoneNumber: user.phoneNumber || null,
        createdAt: new Date()
      };
      
      // 保存默认资料
      await setDoc(userRef, defaultProfile);
      
      return defaultProfile;
    }
  } catch (error) {
    console.error("获取用户资料错误:", error);
    throw error;
  }
}

/**
 * 根据用户ID获取用户资料
 * @param {String} userId - 用户ID
 * @returns {Promise<Object|null>} 用户资料或null(如果不存在)
 */
export async function getUserProfileById(userId) {
  try {
    if (!userId) {
      throw new Error("需要提供用户ID");
    }
    
    // 从Firestore获取用户资料
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // 如果用户资料不存在,返回带有基本信息的对象
      return {
        uid: userId,
        nickname: `用户 ${userId.substring(0, 6)}`,
        avatarUrl: null
      };
    }
  } catch (error) {
    console.error(`获取用户 ${userId} 资料错误:`, error);
    throw error;
  }
}

/**
 * 在Auth和Firestore中更新用户昵称
 * @param {String} nickname - 新昵称
 * @returns {Promise<void>}
 */
export async function updateUserNickname(nickname) {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("用户未登录");
    }
    
    // 在Firebase Auth中更新
    await updateProfile(user, {
      displayName: nickname
    });
    
    // 在Firestore中更新
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      nickname: nickname
    });
    
    return true;
  } catch (error) {
    console.error("更新昵称错误:", error);
    throw error;
  }
}

/**
 * 上传并更新用户头像
 * @param {Object} imageFile - 图片文件对象(带uri)
 * @returns {Promise<String>} - 上传头像的URL
 */
export async function updateUserAvatar(imageFile) {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("用户未登录");
    }
    
    // 为头像创建唯一文件名
    const timestamp = new Date().getTime();
    const fileExtension = imageFile.uri.split('.').pop();
    const fileName = `avatars/${user.uid}_${timestamp}.${fileExtension}`;
    
    // 创建存储引用
    const storageRef = ref(storage, fileName);
    
    // 将URI转换为blob
    const response = await fetch(imageFile.uri);
    const blob = await response.blob();
    
    // 上传到Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, blob);
    
    // 等待上传完成
    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // 如果需要,跟踪上传进度
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('上传进度: ' + progress.toFixed(2) + '%');
        },
        (error) => {
          // 处理上传错误
          console.error("上传头像错误:", error);
          reject(error);
        },
        () => {
          // 上传完成
          resolve();
        }
      );
    });
    
    // 获取下载URL
    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    
    // 在Firebase Auth中更新
    await updateProfile(user, {
      photoURL: downloadUrl
    });
    
    // 在Firestore中更新
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      avatarUrl: downloadUrl
    });
    
    return downloadUrl;
  } catch (error) {
    console.error("更新头像错误:", error);
    throw error;
  }
}