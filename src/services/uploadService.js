import { auth } from './firebaseConfig';
import * as FileSystem from 'expo-file-system';

// 这个 URL 应该是您部署的 Firebase 函数 URL
const UPLOAD_FUNCTION_URL = 'https://getuploadurl-ivvumpm5ma-uc.a.run.app';

/**
 * 通过 Cloud Functions 生成的签名 URL 上传文件到 Firebase Storage
 * @param {Object} file - 文件对象 (包含 uri, type, name)
 * @param {String} mediaType - 'image' 或 'video'
 * @returns {Promise<string>} - 上传文件的下载 URL
 */
export async function uploadFileToFirebase(file, mediaType) {
  try {
    // 获取当前用户的 ID 令牌
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未认证');
    }
    
    const idToken = await currentUser.getIdToken();
    
    // 从我们的 Cloud Function 请求签名 URL
    const response = await fetch(UPLOAD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: file.type,
        fileName: file.name,
        mediaType
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`获取上传 URL 失败: ${errorData.error}`);
    }
    
    const { uploadUrl, downloadUrl, path } = await response.json();
    
    // 使用签名 URL 上传文件
    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    
    if (!fileInfo.exists) {
      throw new Error(`找不到文件: ${file.uri}`);
    }
    
    // 使用 FileSystem.uploadAsync 上传
    const uploadResponse = await FileSystem.uploadAsync(uploadUrl, file.uri, {
      httpMethod: 'PUT',
      headers: {
        'Content-Type': file.type
      }
    });
    
    if (uploadResponse.status !== 200) {
      throw new Error(`上传失败，状态码: ${uploadResponse.status}`);
    }
    
    console.log('文件上传成功:', path);
    
    // 返回下载 URL
    return downloadUrl;
  } catch (error) {
    console.error('uploadFileToFirebase 出错:', error);
    throw error;
  }
}