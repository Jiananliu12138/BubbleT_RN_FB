// MapPresenter.jsx
import { observer } from "mobx-react-lite";
import { MapView } from "../views/MapView";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import * as Location from 'expo-location';
import { Linking, Platform, Alert } from 'react-native';

/**
 * Presenter component for Bubble Tea Map feature
 * Handles business logic and coordinates between MapView and MapModel
 * Supports both list view and map view modes
 */
export const MapPresenter = observer(function MapPresenter(props) {
  const { MapModel } = props;
  const router = useRouter();
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchAddress, setSearchAddress] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);
  
  // 位置监听器
  const locationSubscription = useRef(null);
  
  // 新增地图默认中心、Region、Ref、半径状态
  const DEFAULT_REGION = {
    latitude: 59.347519,
    longitude: 18.073992,
    latitudeDelta: 0.031,
    longitudeDelta: 0.031,
  };
  const [region, setRegion] = useState(DEFAULT_REGION);
  // 新增最新搜索位置的状态，用于在视图间保持一致性
  const [lastSearchLocation, setLastSearchLocation] = useState(null);
  const mapRef = useRef(null);
  const [mapRadius, setMapRadius] = useState(3500);
  
  // 更新Region和最新搜索位置的统一函数
  const updateLocationAndRegion = (location, skipSearch = false) => {
    if (!location) return;
    
    console.log('更新位置到:', location, skipSearch ? '(跳过搜索)' : '');
    
    // 更新最新搜索位置
    setLastSearchLocation(location);
    
    // 更新region
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: DEFAULT_REGION.latitudeDelta,
      longitudeDelta: DEFAULT_REGION.longitudeDelta
    });
    
    // 更新模型中的用户位置
    MapModel.setUserLocation(location);
    
    // 如果处于地图视图且未跳过搜索，则立即触发搜索
    if (viewMode === 'map' && !skipSearch) {
      console.log('在地图视图中更新位置，触发奶茶店搜索...');
      MapModel.searchNearbyShops({ 
        location, 
        radius: mapRadius 
      });
    }
  };
  
  // 检查并请求位置权限
  const requestAndCheckLocationPermission = async () => {
    try {
      console.log('Requesting location permission...');
      
      // 在Web平台上特殊处理
      if (Platform.OS === 'web') {
        // Web平台不需要显式请求权限，而是在获取位置时浏览器会自动请求
        setLocationPermissionRequested(true);
        setHasLocationPermission(true);
        return true;
      }
      
      // 检查现有权限
      let { status } = await Location.getForegroundPermissionsAsync();
      console.log('Current location permission status:', status);
      
      // 如果没有权限且未请求过权限
      if (status !== 'granted' && !locationPermissionRequested) {
        console.log('Requesting permission...');
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        console.log('New permission status:', newStatus);
        setLocationPermissionRequested(true);
        
        if (newStatus !== 'granted') {
          console.log('Permission denied');
          MapModel.setError('Location access is required to find bubble tea shops near you');
          setHasLocationPermission(false);
          return false;
        }
      }
      
      // 权限已获取
      if (status === 'granted' || status === 'granted') {
        console.log('Permission granted');
        setHasLocationPermission(true);
        return true;
      } else {
        console.log('No permission');
        MapModel.setError('Location access is required to find bubble tea shops near you');
        setHasLocationPermission(false);
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      MapModel.setError(`Error requesting location: ${error.message}`);
      setHasLocationPermission(false);
      return false;
    }
  };
  
  // 获取用户位置
  const getUserLocation = async () => {
    try {
      // 请求位置权限
      const hasPermission = await requestAndCheckLocationPermission();
      
      if (!hasPermission) {
        console.log('No location permission, cannot get location');
        return null;
      }
      
      // 获取位置
      console.log('Getting current position...');
      
      // Web平台特殊处理 - 使用更高的超时时间和更宽松的精度要求
      let options = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000
      };
      
      // 为Web平台设置特殊选项
      if (Platform.OS === 'web') {
        options = {
          accuracy: Location.Accuracy.Low,
          timeInterval: 10000,
          mayShowUserSettingsDialog: true  // 允许在Web上显示浏览器的位置设置对话框
        };
      }
      
      const location = await Location.getCurrentPositionAsync(options);
      console.log('Got position:', location);
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Web平台特定错误处理
      if (Platform.OS === 'web') {
        if (error.message.includes('denied') || error.message.includes('permission')) {
          MapModel.setError('Location access denied. Please allow location access in your browser settings and try again.');
        } else if (error.message.includes('timeout')) {
          MapModel.setError('Location request timed out. Please try again or search for a specific location.');
        } else {
          MapModel.setError(`Something went wrong. ${error.message}`);
        }
      } else {
        MapModel.setError(`Error getting location: ${error.message}`);
      }
      
      return null;
    }
  };
  
  // 更新用户位置并搜索附近店铺
  const updateLocationAndSearch = async () => {
    try {
      // 获取用户位置
      const location = await getUserLocation();
      
      if (!location) {
        console.log('Failed to get location');
        return;
      }
      
      // 使用统一的函数更新位置和region
      updateLocationAndRegion(location);
      
      // 进行反向地理编码以获取地址
      const address = await MapModel.reverseGeocode(location);
      setSearchAddress(address);
      
      // 使用当前位置和设定半径搜索附近商店
      await MapModel.searchNearbyShops({ location, radius: mapRadius });
    } catch (error) {
      console.error('Error updating location and searching:', error);
      MapModel.setError('Failed to update location and search');
    }
  };
  
  // 初始化 - 组件挂载时请求位置并搜索，默认回退到 KTH
  const init = async () => {
    console.log('MapPresenter mounted, initializing with DEFAULT_REGION fallback...');
    const loc = await getUserLocation() || DEFAULT_REGION;
    
    // 使用统一的函数更新位置和region
    updateLocationAndRegion(loc);
    
    await MapModel.searchNearbyShops({ location: loc, radius: mapRadius });
  };
  useEffect(() => {
    init();
  }, []);
  
  /**
   * 开始监听位置更新
   */
  const startLocationUpdates = async () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    
    try {
      // 设置位置监听
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // 至少移动 100 米才更新
          timeInterval: 60000, // 至少 60 秒才更新
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          
          // 使用统一的函数更新位置和region
          updateLocationAndRegion({
            latitude,
            longitude,
          });
          
          // 获取新地址 - 使用MapModel的reverseGeocode方法
          updateAddressFromCoords(latitude, longitude);
        }
      );
    } catch (error) {
      console.error('Error starting location updates:', error);
      // 不会影响主要功能，可以静默失败
    }
  };
  
  /**
   * 从坐标更新地址 - 使用MapModel的reverseGeocode方法
   */
  const updateAddressFromCoords = async (latitude, longitude) => {
    try {
      console.log(`尝试获取地址: 坐标(${latitude}, ${longitude})`);
      const address = await MapModel.reverseGeocode({ latitude, longitude });
      console.log('获取到地址:', address);
      
      if (address) {
        setSearchAddress(address);
      } else {
        console.warn('reverseGeocode返回空地址');
        setSearchAddress('无法获取地址');
      }
    } catch (error) {
      console.error('反向地理编码错误:', error);
      setSearchAddress('地址获取失败');
    }
  };
  
  // 处理刷新 - 重新使用当前位置搜索
  const handleRefresh = async () => {
    console.log('Refreshing...');
    MapModel.setError(null); // 清除任何现有错误
    await updateLocationAndSearch();
  };
  
  // 处理地点搜索 - 使用所选位置搜索
  const handleSearchLocation = async (location, address) => {
    console.log('Searching location:', location, address);
    MapModel.setError(null); // 清除任何错误
    
    try {
      // 设置当前搜索的地址文本
      setSearchAddress(address);
      
      // 在地图视图中，使用updateLocationAndRegion自动触发搜索
      // 在列表视图中，需要手动调用searchNearbyShops
      if (viewMode === 'map') {
        // 在地图视图中，updateLocationAndRegion会自动触发搜索
        updateLocationAndRegion(location);
      } else {
        // 在列表视图中，更新位置但不自动触发搜索
        updateLocationAndRegion(location, true); // skipSearch = true
        
        // 然后手动搜索
        await MapModel.searchNearbyShops({ location, radius: mapRadius });
      }
    } catch (error) {
      console.error('Error during location search:', error);
      
      // Web平台上特殊处理错误
      if (Platform.OS === 'web') {
        MapModel.setError('Search failed. Please try again or use a different location.');
      } else {
        MapModel.setError(`Search failed: ${error.message}`);
      }
    }
  };
  
  // 使用Google Geocoding API进行手动搜索 (用于web上备用)
  const handleManualSearch = async (searchText) => {
    const trimmedSearchText = searchText ? searchText.trim() : '';
    if (!trimmedSearchText || trimmedSearchText.length < 3) {
      MapModel.setError('Please enter at least 3 characters to search.');
      return;
    }
    
    try {
      MapModel.setLoading(true);
      MapModel.setError(null); // Clear previous errors

      console.log(`Manually searching for: ${trimmedSearchText}`);
      const location = await MapModel.geocodeAddress(trimmedSearchText);
      
      if (location) {
        console.log(`Geocoding successful:`, location);
        
        // 在地图视图中，使用updateLocationAndRegion自动触发搜索
        // 在列表视图中，需要手动调用searchNearbyShops
        if (viewMode === 'map') {
          // 在地图视图中自动触发搜索
          updateLocationAndRegion(location);
        } else {
          // 在列表视图中，更新位置但不自动触发搜索
          updateLocationAndRegion(location, true); // skipSearch = true
          
          // 然后手动搜索
          await MapModel.searchNearbyShops({ location });
        }
        
        // Update the displayed address ONLY after successful geocoding and shop search initiation
        setSearchAddress(trimmedSearchText); 
      } else {
        console.log(`Geocoding failed for: ${trimmedSearchText}`);
        // Location not found via geocoding
        MapModel.setError(`Could not find location: "${trimmedSearchText}". Please try a different search.`);
        MapModel.nearbyBubbleTeaShops = []; // Clear previous shop results
        MapModel.nextPageToken = null;
        setSearchAddress(''); // Clear the displayed address on failure
      }
    } catch (error) {
      console.error('Manual search error:', error);
      MapModel.setError('Search failed due to an error. Please try again.');
      setSearchAddress(''); // Clear the displayed address on error too
    } finally {
      MapModel.setLoading(false);
    }
  };
  
  // 处理加载更多商店
  const handleLoadMore = async () => {
    try {
      // 如果正在加载中，或者没有更多数据（无nextPageToken且已展示所有_allShops数据），则不执行加载
      if (isLoadingMore || 
         (MapModel.nearbyBubbleTeaShops.length > 0 && 
          !MapModel.nextPageToken && 
          (!MapModel._allShops || MapModel.nearbyBubbleTeaShops.length >= MapModel._allShops.length))) {
        console.log('已经没有更多商店可加载');
        return;
      }
      
      console.log('开始加载更多商店...');
      setIsLoadingMore(true);
      
      // 调用模型的加载更多方法
      const shops = await MapModel.loadMoreShops();
      console.log(`加载完成，现在共有 ${shops.length} 个商店`);
      
      // 如果加载后仍没有商店，提示用户
      if (shops.length === 0) {
        MapModel.setError('没有找到更多奶茶店');
      }
    } catch (error) {
      console.error('加载更多商店出错:', error);
      MapModel.setError('加载更多商店失败，请重试');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  /**
   * Toggle between list and map view modes
   */
  const handleToggleViewMode = () => {
    // 如果即将切换到地图视图
    if (viewMode === 'list') {
      // 先切换视图模式，这样会触发UI更新
      setViewMode('map');
      
      // 如果有最新搜索位置，使用它
      if (lastSearchLocation) {
        console.log('Using last search location for map center:', lastSearchLocation);
        
        // 如果当前没有奶茶店数据或者商店数量为0，则触发搜索
        if (!MapModel.nearbyBubbleTeaShops || MapModel.nearbyBubbleTeaShops.length === 0) {
          console.log('No shops data available, triggering search...');
          MapModel.searchNearbyShops({ 
            location: lastSearchLocation, 
            radius: mapRadius 
          });
        }
      }
      // 如果有选中的商店，优先使用商店位置
      else if (MapModel.selectedShop && MapModel.selectedShop.location) {
        // 更新最新搜索位置和region
        updateLocationAndRegion(MapModel.selectedShop.location);
        console.log('Using selected shop location for map center:', MapModel.selectedShop.location);
        
        // 没有必要重新搜索，因为已经有选中的商店数据
      }
      // 否则使用用户位置（如果有）
      else if (MapModel.userLocation) {
        // 更新最新搜索位置和region
        updateLocationAndRegion(MapModel.userLocation);
        console.log('Using user location for map center:', MapModel.userLocation);
        
        // 如果当前没有奶茶店数据，则触发搜索
        if (!MapModel.nearbyBubbleTeaShops || MapModel.nearbyBubbleTeaShops.length === 0) {
          console.log('No shops data available, triggering search with user location...');
          MapModel.searchNearbyShops({ 
            location: MapModel.userLocation, 
            radius: mapRadius 
          });
        }
      }
    } else {
      // 切换回列表视图
      setViewMode('list');
    }
  };
  
  /**
   * Handle selecting a bubble tea shop
   * @param {string} shopId - ID of the selected shop
   */
  const handleSelectShop = (shopId) => {
    console.log('选择商店:', shopId);
    
    // 更新模型中的选中商店
    MapModel.selectShop(shopId);
    
    // 如果选中了商店，更新最新搜索位置到商店位置
    if (MapModel.selectedShop && MapModel.selectedShop.location) {
      // 更新最新搜索位置和region，确保在切换视图时使用
      updateLocationAndRegion(MapModel.selectedShop.location, true); // 添加 true 参数跳过不必要的搜索
      
      // 如果当前已经在地图视图，手动调整地图中心到商店位置
      if (viewMode === 'map' && mapRef.current) {
        try {
          console.log('将地图中心调整到商店位置');
          // 对于原生应用，这里可以调整地图视图中心
          // 对于Web应用，我们已经通过更新region来影响未来的地图加载
        } catch (error) {
          console.error('调整地图中心出错:', error);
        }
      }
    }
  };
  
  /**
   * Navigate to shop location in map view
   * @param {string} shopId - ID of the shop to view on map
   */
  const handleViewOnMap = (shopId) => {
    console.log('在地图上查看商店:', shopId);
    
    // 在模型中选择该商店
    MapModel.selectShop(shopId);
    
    // 如果选中了商店，更新region到商店位置
    if (MapModel.selectedShop && MapModel.selectedShop.location) {
      // 更新最新搜索位置和region
      updateLocationAndRegion(MapModel.selectedShop.location, true); // 添加 true 参数跳过不必要的搜索
      
      // 如果当前不是地图视图，切换到地图视图
      if (viewMode !== 'map') {
        setViewMode('map');
      }
    }
  };
  
  /**
   * Open directions to the shop in external maps app
   * @param {Object} shop - The selected shop
   */
  const handleOpenDirections = (shop) => {
    if (!shop || !shop.location) return;
    
    const { latitude, longitude } = shop.location;
    const label = encodeURIComponent(shop.name);
    
    // 根据平台打开不同的地图应用
    let url;
    if (Platform.OS === 'ios') {
      // iOS 使用 Apple Maps
      url = `maps://?daddr=${latitude},${longitude}&q=${label}`;
    } else if (Platform.OS === 'android') {
      // Android 使用 Google Maps
      url = `google.navigation:q=${latitude},${longitude}&mode=d`;
    } else {
      // Web 和其他平台使用 Google Maps 网页版
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${shop.id}&travelmode=driving`;
    }
    
    // 尝试打开地图应用或网页
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // 回退到 Google Maps 网页版
          Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
        }
      })
      .catch(error => {
        console.error('Error opening maps:', error);
        Alert.alert('Error', 'Could not open maps application');
      });
  };
  
  // 如果模型中有错误，但我们有商店数据，清除错误
  // 这样可以确保即使 API 请求失败，但模拟数据可用时，不显示错误
  if (MapModel.error && MapModel.nearbyBubbleTeaShops.length > 0) {
    MapModel.setError(null);
  }
  
  // 计算是否有更多缓存商店可加载
  const hasMoreCachedShops = MapModel._allShops && 
    MapModel.nearbyBubbleTeaShops.length < MapModel._allShops.length;

  return (
    <MapView
      shops={MapModel.nearbyBubbleTeaShops}
      selectedShop={MapModel.selectedShop}
      userLocation={MapModel.userLocation}
      isLoading={MapModel.isLoading}
      isLoadingMore={isLoadingMore}
      error={MapModel.error}
      hasLocationPermission={hasLocationPermission}
      searchRadius={MapModel.searchRadius}
      viewMode={viewMode}
      searchAddress={searchAddress}
      nextPageToken={MapModel.nextPageToken}
      hasMoreCachedShops={hasMoreCachedShops}
      onSelectShop={handleSelectShop}
      onViewOnMap={handleViewOnMap}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onToggleViewMode={handleToggleViewMode}
      onOpenDirections={handleOpenDirections}
      onSearchLocation={handleSearchLocation}
      onManualSearch={handleManualSearch}
      onRequestLocationPermission={requestAndCheckLocationPermission}
      region={region}
      mapRef={mapRef}
      onRegionChangeComplete={setRegion}
      onMarkerPress={handleViewOnMap}
    />
  );
}); 