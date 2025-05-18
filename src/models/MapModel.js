// MapModel.js
import { makeAutoObservable, action, runInAction } from 'mobx';
import axios from 'axios';

// 使用已部署的API URL
export const API_BASE_URL = 'https://api-clxkj4hfqa-uc.a.run.app/api/maps';


// 测试数据 - 当 API 调用失败时使用
const MOCK_BUBBLE_TEA_SHOPS = [
  {
    id: 'mock-id-1',
    name: 'Cha Mate 茶馬特',
    location: {
      latitude: 59.346,
      longitude: 18.001
    },
    address: 'Fleminggatan 18, Stockholm',
    rating: '4.8',
    photoUrl: 'https://lh3.googleusercontent.com/places/ANXAkqFWOLjeOv8yhQJgOtaRLV06OMIx5A2OafZfKiQ8oXskieqvf87udKZJZbonegBHkftSlX-9EUXWm5Ol3JZlk47gyV38_hDzKEE=s1600-w400',
    price_level: 2,
    open_now: true
  },
  {
    id: 'mock-id-2',
    name: 'Macao Boba Tea',
    location: {
      latitude: 59.349,
      longitude: 18.005
    },
    address: 'Odengatan 65, Stockholm',
    rating: '4.5',
    photoUrl: 'https://lh3.googleusercontent.com/places/ANXAkqGWEXxZi2e6FxL-ucH7ch7qX3JppxjZYAmh5Z3sHCdQ0_xnUyS7j26nOr9TrpJkDHTMqmvCnSSYu0kVS76JjsEa3U-e9IGkfaU=s1600-w400',
    price_level: 1,
    open_now: true
  },
  {
    id: 'mock-id-3',
    name: 'TeGo Bubble Tea',
    location: {
      latitude: 59.343,
      longitude: 18.01
    },
    address: 'Kungsgatan 12, Stockholm',
    rating: '4.7',
    photoUrl: 'https://lh3.googleusercontent.com/places/ANXAkqFz5h8tUgq4TvRmw1FfJ9Ku_BNm5JmGjkRGufcOXs0RUIbJuXWl-oHRv-TwYGw8gOgzVVkkHMo7UvY5RdNrlVw2wWvHX-WyGiA=s1600-w400',
    price_level: 2,
    open_now: true
  },
  {
    id: 'mock-id-4',
    name: 'Chatcha',
    location: {
      latitude: 59.345,
      longitude: 18.015
    },
    address: 'Sveavägen 24, Stockholm',
    rating: '4.3',
    photoUrl: 'https://lh3.googleusercontent.com/places/ANXAkqFGO93lXvnYjF9GsE5kJExrVDuzkE_V_nLnbqnRygS3JZ_hnSQK-KwYKTDGHSb78Ijs7XqRcpq8vQPY3V7RDJw8dP8tljl9tSg=s1600-w400',
    price_level: 2,
    open_now: false
  },
  {
    id: 'mock-id-5',
    name: 'Yi Fang Taiwan Fruit Tea',
    location: {
      latitude: 59.339,
      longitude: 18.006
    },
    address: 'Drottninggatan 31, Stockholm',
    rating: '4.6',
    photoUrl: 'https://lh3.googleusercontent.com/places/ANXAkqENfp-Kb6y82fYKUwlXNmspn5RTcqyllvNmrB8bCjpZrDZGxcakBtDhh-XkXaYRLilPnIa-VZFaDZB0vWiI0jmwCsZzuVtRFR0=s1600-w400',
    price_level: 2,
    open_now: true
  }
];

// 测试 API 连接
const testApiConnection = async () => {
  try {
    console.log('测试 API 连接:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/check`);
    console.log('API 连接测试结果:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('API 连接测试失败:', error);
    console.log('将使用模拟数据作为后备方案');
    return {
      success: false,
      error: error.message
    };
  }
};

// 尝试测试连接
testApiConnection();

// 计算两个坐标点之间的距离（以米为单位）
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  const R = 6371; // 地球半径，单位为 km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c * 1000; // 转换为米
  return Math.round(distance);
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// 创建 MapModel 类
class MapModelClass {
  // State properties
  /**
   * @type {Array} nearbyBubbleTeaShops - Stores nearby bubble tea shops
   * @property {Object} shop - Shop information
   * @property {string} shop.id - Unique identifier for the shop
   * @property {string} shop.name - Name of the shop
   * @property {Object} shop.location - Geographic coordinates
   * @property {number} shop.location.latitude - Latitude
   * @property {number} shop.location.longitude - Longitude
   * @property {string} shop.address - Address of the shop
   * @property {string} shop.rating - Rating of the shop (if available)
   * @property {string} shop.photoUrl - URL to shop photo (if available)
   */
  nearbyBubbleTeaShops = [];
  
  /**
   * @type {Object} selectedShop - Currently selected shop
   */
  selectedShop = null;
  
  /**
   * @type {Object} userLocation - User's current location
   * @property {number} latitude - User's latitude
   * @property {number} longitude - User's longitude
   */
  userLocation = null;
  
  isLoading = false;
  error = null;
  searchRadius = 3000; // 默认半径为3公里
  nextPageToken = null; // 用于分页加载
  isUsingMockData = false; // 记录是否使用了模拟数据
  
  constructor() {
    // 使用 MobX 使所有属性和方法成为可观察的
    makeAutoObservable(this, {
      // 将所有修改状态的方法标记为 action
      setUserLocation: action,
      setLoading: action,
      setError: action,
      setSearchRadius: action,
      selectShop: action,
      clearSelectedShop: action,
      handleError: action,
      
      // 异步操作不需要特别标记，因为它们内部使用 runInAction
      searchNearbyShops: false,
      loadMoreShops: false,
      geocodeAddress: false,
      reverseGeocode: false
    });
  }
  
  // 更新用户位置的操作
  setUserLocation(location) {
    this.userLocation = location;
  }
  
  // 搜索附近商店
  async searchNearbyShops(params = {}) {
    this.setLoading(true);
    this.setError(null);
    
    // 在此之前先重置 isUsingMockData
    runInAction(() => {
      this.isUsingMockData = false;
    });
    
    const location = params.location || this.userLocation;
    const radius = params.radius || this.searchRadius;
    const loadMore = params.loadMore || false;
    
    if (!location) {
      this.setError('用户位置不可用');
      this.setLoading(false);
      return [];
    }
    
    // 如果不是加载更多，则清空现有列表
    if (!loadMore) {
      runInAction(() => {
        this.nearbyBubbleTeaShops = [];
        this.nextPageToken = null;
      });
    }
    
    try {
      let url = '';
      let requestParams = {}; // 重命名以避免与函数参数冲突
      
      // 是否使用 nextPageToken 加载更多
      if (loadMore && this.nextPageToken) {
        url = `${API_BASE_URL}/nearby`;
        requestParams = {
          pagetoken: this.nextPageToken
        };
      } else {
        // 首次加载
        url = `${API_BASE_URL}/nearby`;
        requestParams = {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius
        };
      }
      
      // 发起 API 请求到 Firebase Functions
      console.log(`搜索商店: ${url} 参数: ${JSON.stringify(requestParams)}`);
      const response = await axios.get(url, { params: requestParams });
      const data = response.data;
      console.log('搜索结果:', data);
      
      // 使用 runInAction 包装所有状态更新
      runInAction(() => {
        // 保存下一页令牌用于分页
        this.nextPageToken = data.nextPageToken || null;
        
        // 处理并添加商店数据
        if (data.shops && Array.isArray(data.shops)) {
          // 给每个商店添加距离属性
          const shopsWithDistance = data.shops.map(shop => ({
            ...shop,
            distance: calculateDistance(
              location.latitude,
              location.longitude,
              shop.location.latitude,
              shop.location.longitude
            )
          }));
          
          // 过滤掉距离超过3公里的商店
          const filteredShops = shopsWithDistance.filter(shop => 
            shop.distance <= 3000
          );
          
          // 按距离排序
          filteredShops.sort((a, b) => a.distance - b.distance);
          
          // 只取前10个商店（分页处理）
          const shopsToAdd = filteredShops.slice(0, 10);
          
          // 添加到现有列表或替换列表
          if (loadMore) {
            this.nearbyBubbleTeaShops = [...this.nearbyBubbleTeaShops, ...shopsToAdd];
            // 如果已经没有更多商店了，清除nextPageToken
            if (shopsToAdd.length === 0 || shopsToAdd.length < 10) {
              this.nextPageToken = null;
            }
          } else {
            this.nearbyBubbleTeaShops = shopsToAdd;
            // 如果商店不足10个，清除nextPageToken
            if (shopsToAdd.length < 10) {
              this.nextPageToken = null;
            }
          }
        } else {
          // 如果没有返回shops数组，也清空当前列表
          if (!loadMore) {
            this.nearbyBubbleTeaShops = [];
          }
          // 没有更多数据
          this.nextPageToken = null;
        }
      });
      
      return this.nearbyBubbleTeaShops;
      
    } catch (error) {
      console.error('API 请求失败，尝试使用模拟数据:', error);
      
      // 使用模拟数据作为后备
      if (!loadMore && !this.isUsingMockData) {
        console.log('使用模拟的奶茶店数据');
        
        // 使用模拟数据
        const mockShopsWithDistance = MOCK_BUBBLE_TEA_SHOPS.map(shop => ({
          ...shop,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            shop.location.latitude,
            shop.location.longitude
          )
        }));
        
        // 按距离排序
        mockShopsWithDistance.sort((a, b) => a.distance - b.distance);
        
        // 使用 runInAction 包装状态更新
        runInAction(() => {
          this.nearbyBubbleTeaShops = mockShopsWithDistance;
          this.isUsingMockData = true; // 设置标志
          this.nextPageToken = null; // 模拟数据没有下一页
        });
        
        // 设置一个较轻的错误提示，但仍然显示店铺
        this.setError('使用离线数据显示商店。请检查你的网络连接。');
        
        return this.nearbyBubbleTeaShops;
      }
      
      // 如果是加载更多时发生错误，或者已经在使用模拟数据，则显示错误
      this.handleError(error);
      return this.nearbyBubbleTeaShops;
    } finally {
      this.setLoading(false);
    }
  }
  
  // 加载更多商店
  async loadMoreShops() {
    console.log('加载更多商店...');
    
    // 如果已经在使用模拟数据，不尝试加载更多
    if (this.isUsingMockData) {
      console.log('使用模拟数据，无法加载更多');
      return this.nearbyBubbleTeaShops;
    }
    
    // 如果没有下一页令牌，也不加载更多
    if (!this.nextPageToken) {
      console.log('没有更多商店可加载');
      return this.nearbyBubbleTeaShops; // 没有更多数据可加载
    }
    
    // 使用 nextPageToken 加载更多
    return this.searchNearbyShops({ loadMore: true });
  }
  
  // 地址到坐标的转换
  async geocodeAddress(address) {
    try {
      this.setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/geocode`, {
        params: { address }
      });
      return response.data.location;
    } catch (error) {
      console.error('地理编码错误:', error);
      
      // 返回斯德哥尔摩中心作为后备
      if (address.toLowerCase().includes('stockholm')) {
        return {
          latitude: 59.3293,
          longitude: 18.0686
        };
      }
      
      this.handleError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
  
  // 坐标到地址的转换
  async reverseGeocode(location) {
    try {
      this.setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reverse-geocode`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      });
      console.log('反向地理编码返回数据:', response.data);
      if (response.data && response.data.address) {
        return response.data.address;
      } else {
        console.warn('反向地理编码响应中未找到地址:', response.data);
        return '未知地址';
      }
    } catch (error) {
      console.error('反向地理编码出错:', error);
      
      // 返回一个通用地址作为后备
      if (location && location.latitude && location.longitude) {
        // 使用坐标作为后备地址
        return `位置 (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`;
      }
      
      this.handleError(error);
      return '地址获取失败';
    } finally {
      this.setLoading(false);
    }
  }
  
  // 选择商店
  selectShop(shopId) {
    this.selectedShop = this.nearbyBubbleTeaShops.find(shop => shop.id === shopId) || null;
  }
  
  // 清除商店选择
  clearSelectedShop() {
    this.selectedShop = null;
  }
  
  // 错误处理
  handleError(error) {
    let errorMessage = '发生未知错误';
    if (error.response) {
      // 服务器返回了错误状态码
      errorMessage = `服务器错误: ${error.response.status} - ${error.response.data.message || '无详情'}`;
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      // 请求已发出但没有收到响应（网络错误）
      errorMessage = '网络错误，无法连接到服务器';
      console.error('API Network Error:', error.request);
    } else {
      // 设置请求时发生错误
      errorMessage = `请求设置错误: ${error.message}`;
      console.error('API Request Setup Error:', error.message);
    }
    this.error = errorMessage;
    console.error('MapModel Error:', errorMessage);
  }
  
  // 工具方法
  setLoading(state) {
    this.isLoading = state;
  }
  
  setError(message) {
    this.error = message;
  }
  
  setSearchRadius(radius) {
    this.searchRadius = radius;
  }
}

// 创建并导出 MapModel 实例
export const MapModel = new MapModelClass();