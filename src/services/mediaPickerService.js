// src/services/mediaPickerService.js - 修复版本
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

/**
 * 从图库选择图片，允许自定义裁剪比例
 * @param {Object} options - 配置选项
 * @returns {Promise<Object>} 选择的图片文件
 */
export async function pickImageFromLibrary(options = {}) {
  try {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('需要相册权限才能选择图片');
    }
    
    // 默认选项
    const defaultOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // 修复：使用 MediaTypeOptions 而不是 MediaType
      allowsEditing: true,
      aspect: null, // 不强制裁剪比例，允许自由裁剪
      quality: 0.8,
    };
    
    // 合并选项
    const pickerOptions = {
      ...defaultOptions,
      ...options
    };
    
    let result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    
    if (result.canceled) {
      return null;
    }
    
    // 获取文件信息
    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
    
    // 获取URI并提取文件名
    const uri = result.assets[0].uri;
    let fileName = result.assets[0].fileName; 
    
    // 处理ImagePicker未提供fileName的情况
    if (!fileName) {
      fileName = uri.split('/').pop() || `image_${Date.now()}.jpg`;
    }
    
    // 确定文件扩展名和MIME类型
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const mimeType = result.assets[0].mimeType || getMimeType(uri) || `image/${fileExtension}`;
    
    // 创建文件对象
    const file = {
      uri: uri,
      name: fileName,
      type: mimeType,
      size: fileInfo.size,
      width: result.assets[0].width,
      height: result.assets[0].height
    };
    
    return file;
  } catch (error) {
    console.error("选择图片时出错:", error);
    throw error;
  }
}

/**
 * 从URI确定MIME类型
 * @param {String} uri - 文件URI
 * @returns {String} MIME类型
 */
function getMimeType(uri) {
  const extension = uri.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
}

/**
 * 从图库选择多张图片
 * @returns {Promise<Array>} 选择的图片文件数组
 */
export async function pickMultipleImages() {
  try {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('需要相册权限才能选择图片');
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // 修复：使用 MediaTypeOptions 而不是 MediaType
      allowsMultipleSelection: true, // 允许多选
      selectionLimit: 9, // 最多9张，类似小红书
      quality: 0.8,
    });
    
    if (result.canceled) {
      return [];
    }
    
    // 处理多个选择的图片
    const files = await Promise.all(result.assets.map(async (asset) => {
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      
      const uri = asset.uri;
      let fileName = asset.fileName || uri.split('/').pop() || `image_${Date.now()}.jpg`;
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const mimeType = asset.mimeType || getMimeType(uri) || `image/${fileExtension}`;
      
      return {
        uri: uri,
        name: fileName,
        type: mimeType,
        size: fileInfo.size,
        width: asset.width,
        height: asset.height
      };
    }));
    
    return files;
  } catch (error) {
    console.error("选择多张图片时出错:", error);
    throw error;
  }
}