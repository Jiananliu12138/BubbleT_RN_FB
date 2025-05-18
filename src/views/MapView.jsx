// MapView.jsx
import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Keyboard
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from '../components/IconComponent';
import { API_BASE_URL } from '../models/MapModel';
// 导入平台特定版本的组件，Metro打包器将自动选择正确的文件
import { MapViewWrapper, MapMarkerWrapper } from '../components/MapViewWrapper';

const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色
  primaryDark: "#f7bd10",  // 深一点的主色调：深黄色
  accent: "#f7bd10",       // 强调色：深黄色
  accentLight: "#f8ca69",  // 浅一点的强调色
  background: "#f8ca69",   // 背景色：黄色
  cardBackground: "#fff",  // 卡片背景：白色
  text: "#333333",         // 主要文本：深灰色
  textSecondary: "#666666",// 次要文本：中灰色
  border: "#000000",       // 边框色：黑色
  highlight: "#24c960",    // 高亮色：绿色
};

/**
 * View component for Bubble Tea Map feature
 * Supports both list view and map view modes
 */
export function MapView(props) {
  const {
    shops = [],
    selectedShop,
    userLocation,
    isLoading,
    isLoadingMore,
    error,
    hasLocationPermission,
    searchRadius,
    viewMode,
    searchAddress,
    googleApiKey,
    nextPageToken,
    hasMoreCachedShops,
    onSelectShop,
    onViewOnMap,
    onRefresh,
    onLoadMore,
    onToggleViewMode,
    onOpenDirections,
    onSearchLocation,
    onManualSearch,
    onRequestLocationPermission,
    // 以下为地图模式所需props
    region,
    mapRef,
    onRegionChangeComplete,
    onMarkerPress,
    // 搜索位置标记
    searchLocation
  } = props;

  const placesAutocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  // Map view state
  const [mapUrl, setMapUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [manualSearchText, setManualSearchText] = useState('');
  const [webSuggestions, setWebSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 构造标记点参数
  const markerParam = shops.map(shop => 
    `${shop.location?.latitude},${shop.location?.longitude}`
  ).join('|');
  
  // Map URL fetching for web platforms
  useEffect(() => {
    // Only fetch if we're in map view
    if (viewMode !== 'map') return;
    
    const fetchMapUrl = async () => {
      try {
        setLoading(true);
        setMapError(null); // 重置错误状态
        
        // 只为Web平台获取地图URL，移动平台现在直接使用MapView组件
        if (Platform.OS === 'web') {
          // 构建查询参数 - 现在我们使用普通的bubble tea搜索
          const query = 'bubble tea near ' + (searchAddress || '');
          
          console.log('地图查询:', query);
          
          // 使用服务器API获取嵌入地图链接 - 不传递shopIds参数
          const response = await fetch(
            `${API_BASE_URL}/embed?latitude=${region.latitude}&longitude=${region.longitude}&zoom=14&q=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          setMapUrl(data.url);
        }
      } catch (error) {
        console.error('获取地图URL失败:', error);
        setMapError(error); // 设置错误状态
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapUrl();
  }, [region.latitude, region.longitude, viewMode, markerParam, searchAddress]);

  // 添加一个专门用于检测商店数据变化的useEffect
  useEffect(() => {
    // 当商店数据变化且处于地图视图时，记录日志
    if (viewMode === 'map' && shops.length > 0) {
      console.log(`商店数据更新: 找到${shops.length}家奶茶店`);
    }
  }, [shops, viewMode]);

  // Loading state
  if (isLoading && !isLoadingMore) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Searching for nearby bubble tea shops...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // No location permission
  if (!hasLocationPermission) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Location Permission Required</Text>
        <Text style={styles.errorMessage}>
          We need location permission to find bubble tea shops near you.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRequestLocationPermission}>
          <Text style={styles.retryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // View mode toggle button
  const ViewModeToggle = () => (
    <TouchableOpacity 
      style={styles.viewModeToggle} 
      onPress={onToggleViewMode}
    >
      <Text style={styles.viewModeToggleText}>
        {viewMode === 'list' ? 'Switch to Map View' : 'Switch to List View'}
      </Text>
    </TouchableOpacity>
  );

  // Location search component
  const LocationSearch = () => {
    // Local state for manual search text
    const [manualSearchText, setManualSearchText] = useState('');
    
    // Handle input change for web
    const handleWebInputChange = (e) => {
      const value = e.target.value;
      setManualSearchText(value);
    };
    
    return (
    <View style={[
      styles.searchContainer,
      // Add extra padding on web to prevent overlap
      Platform.OS === 'web' ? styles.searchContainerWeb : null
    ]}>
      {/* Use GooglePlacesAutocomplete for mobile platforms */}
      {Platform.OS !== 'web' ? (
        <GooglePlacesAutocomplete
          ref={placesAutocompleteRef}
          placeholder='Search location'
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details && details.geometry) {
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              onSearchLocation(location, details.formatted_address);
            }
          }}
          query={{
            key: googleApiKey,
            language: 'zh',
            types: 'geocode',
          }}
          enablePoweredByContainer={false}
          minLength={2}
          debounce={300}
          nearbyPlacesAPI="GooglePlacesSearch"
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
          enableHighAccuracyLocation={true}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed="auto"
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 45,
              color: COLORS.text,
              fontSize: 16,
              borderWidth: 3,
              borderColor: COLORS.border,
              borderRadius: 20,
              paddingHorizontal: 15,
              backgroundColor: 'white',
            },
            predefinedPlacesDescription: {
              color: COLORS.accent,
            },
            listView: {
              position: 'absolute',
              top: 45,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: 8,
              elevation: 3,
              zIndex: 1000,
              borderWidth: 1,
              borderColor: COLORS.border,
            },
            row: {
              padding: 13,
              minHeight: 44,
              fontSize: 15,
            },
            separator: {
              height: 0.5,
              backgroundColor: COLORS.border,
            },
            description: {
              fontSize: 14,
            },
            powered: {
              height: 0,
            },
          }}
        />
      ) : (
        // Custom search input for web platforms
        <View style={styles.webSearchContainer}>
          {Platform.OS === 'web' ? (
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  ref={inputRef}
                  style={{
                    width: '100%',
                    height: 45,
                    borderWidth: 3,
                    borderColor: COLORS.border,
                    borderRadius: 20,
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: 'white',
                    fontSize: 16,
                    outline: 'none',
                    boxSizing: 'border-box',
                    border: `3px solid ${COLORS.border}`
                  }}
                  type="text"
                  placeholder="Enter location (city, address, etc.)"
                  value={manualSearchText}
                  onChange={handleWebInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // 在按下回车键时执行搜索
                      onManualSearch && onManualSearch(manualSearchText);
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <TouchableOpacity 
                style={styles.webSearchButton}
                onPress={() => onManualSearch && onManualSearch(manualSearchText)}
              >
                <Text style={styles.webSearchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TextInput
              style={styles.webSearchInput}
              placeholder="Enter location (city, address, etc.)"
              value={manualSearchText}
              onChangeText={setManualSearchText}
              onSubmitEditing={() => {
                onManualSearch && onManualSearch(manualSearchText);
                Keyboard.dismiss();
              }}
            />
          )}
        </View>
      )}
      
      <TouchableOpacity 
        style={[
          styles.currentLocationButton,
          // Add extra margin on web to prevent overlap
          Platform.OS === 'web' ? styles.currentLocationButtonWeb : null
        ]}
        onPress={() => {
          // 清空搜索框
          if (Platform.OS === 'web') {
            setManualSearchText('');
          } else if (placesAutocompleteRef.current) {
            placesAutocompleteRef.current.setAddressText('');
          }
          // 调用刷新，该函数已修改为在Web环境中处理位置权限问题
          onRefresh();
        }}
      >
        <Text style={styles.currentLocationButtonText}>Use my location</Text>
      </TouchableOpacity>
      
      {error && Platform.OS === 'web' && error.includes('Location access') ? (
        <Text style={styles.locationErrorText}>
          {error}
        </Text>
      ) : searchAddress ? (
        <Text style={styles.currentAddressText} numberOfLines={1}>
          <Icon name="location-outline" size={14} color={COLORS.text} /> {searchAddress}
        </Text>
      ) : null}
    </View>
  );};

  // Empty state
  if (shops.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.viewModeContainer}>
          <ViewModeToggle />
        </View>
        
        <LocationSearch />
        
        <View style={styles.emptyContainer}>
          <Icon name="cafe-outline" size={60} color="white" />
          <Text style={styles.emptyText}>No bubble tea shops found nearby.</Text>
          <Text style={styles.emptySubtext}>Try a different location or try again later.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // "Load More" 底部组件
  const ListFooter = () => {
    // 如果没有商店或正在初始加载，不显示footer
    if (shops.length === 0 || isLoading) {
      return null;
    }
    
    // 没有nextPageToken则表示没有更多数据可加载
    const hasMoreData = !!nextPageToken;
    
    // 没有更多数据可加载时的显示
    if (!hasMoreData) {
      return (
        <View style={styles.listFooter}>
          <Text style={styles.noMoreShopsText}>No more bubble tea shops found</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.listFooter}>
        {isLoadingMore ? (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingMoreText}>Loading more bubble tea shops...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render shop item for list view
  const renderShopItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.shopItem, 
        selectedShop?.id === item.id && styles.selectedShopItem
      ]}
      onPress={() => onSelectShop(item.id)}
    >
      <View style={styles.shopHeader}>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.name}</Text>
          <Text style={styles.shopAddress}>{item.address}</Text>
          
          {item.distance && (
            <Text style={styles.distanceText}>
              {item.distance < 1000 ? 
                `${item.distance} meters` : 
                `${(item.distance / 1000).toFixed(1)} km`} away
            </Text>
          )}
          
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              {item.price_level && (
                <Text style={styles.priceLevel}>
                  {Array(item.price_level).fill('￥').join('')}
                </Text>
              )}
            </View>
          )}
        </View>
        
        {item.photoUrl ? (
          <Image 
            source={{ uri: item.photoUrl }} 
            style={styles.shopImage} 
          />
        ) : (
          <View style={[styles.shopImage, styles.shopImagePlaceholder]}>
            <Icon name="cafe-outline" size={30} color="white" />
          </View>
        )}
      </View>
      
      <View style={styles.shopStatus}>
        {item.open_now !== undefined && (
          <Text style={[styles.openStatus, item.open_now ? styles.openNow : styles.closedNow]}>
            {item.open_now ? 'Open Now' : 'Closed'}
          </Text>
        )}
      </View>
      
      <View style={styles.shopButtons}>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => onViewOnMap(item.id)}
        >
          <Icon name="map-outline" size={16} color="white" style={styles.buttonIcon} />
          <Text style={styles.mapButtonText}>View Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={() => onOpenDirections(item)}
        >
          <Icon name="navigate-outline" size={16} color="white" style={styles.buttonIcon} />
          <Text style={styles.directionsButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // List View
  const renderListView = () => (
    <>
      <FlatList
        data={shops}
        renderItem={renderShopItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooter}
      />
    </>
  );

  // Map View (placeholder for now - will be replaced with actual map)
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {Platform.OS === 'web' ? (
        // Web平台使用MapViewWrapper配合iframe嵌入
        <MapViewWrapper
          style={styles.mapEmbedContainer}
          mapUrl={mapUrl}
          loading={loading}
          loadingError={mapError}
        >
          {/* 在地图上方显示商店标记点列表 */}
          <View style={styles.shopsOverlay}>
            <Text style={styles.shopsOverlayTitle}>Tea Shop List</Text>
            <FlatList
              data={shops}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.mapShopItem, 
                    selectedShop?.id === item.id && styles.selectedMapShopItem
                  ]}
                  onPress={() => onSelectShop(item.id)}
                >
                  <Text style={styles.mapShopName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.mapShopDistance} numberOfLines={1}>
                    {item.distance < 1000 ? 
                      `${item.distance} m` : 
                      `${(item.distance / 1000).toFixed(1)} km`}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          
          {/* 如果有选中的商店，显示详情悬浮窗 */}
          {selectedShop && (
            <View style={styles.selectedShopFloatingCard}>
              <View style={styles.selectedShopContent}>
                <View style={styles.selectedShopHeader}>
                  <Text style={styles.selectedShopName}>{selectedShop.name}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => onSelectShop(null)}
                  >
                    <Icon name="close" size={22} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.selectedShopAddress}>{selectedShop.address}</Text>
                {selectedShop.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}><Icon name="star" size={16} color="#FFD700" /> {selectedShop.rating}</Text>
                  </View>
                )}
                <View style={styles.shopButtons}>
                  <TouchableOpacity 
                    style={styles.directionsButton}
                    onPress={() => onOpenDirections(selectedShop)}
                  >
                    <Icon name="navigate-outline" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.directionsButtonText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </MapViewWrapper>
      ) : (
        // 移动平台实现
        <View style={styles.mapContainer}>
          <MapViewWrapper
            style={styles.map}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            ref={mapRef}
            onError={(error) => {
              console.error('地图加载错误:', error);
              setMapError(error);
            }}
          >
            {/* 渲染奶茶店标记点 */}
            {shops.filter(shop => 
              shop.location && 
              typeof shop.location.latitude === 'number' && 
              typeof shop.location.longitude === 'number'
            ).map(shop => (
              <MapMarkerWrapper
                key={shop.id}
                coordinate={{
                  latitude: shop.location.latitude,
                  longitude: shop.location.longitude
                }}
                title={shop.name}
                description={shop.address}
                onPress={() => onMarkerPress(shop.id)}
                pinColor={selectedShop?.id === shop.id ? COLORS.accent : COLORS.highlight}
              />
            ))}
            
            {/* 如果有搜索位置，显示搜索位置标记 */}
            {searchLocation && 
              typeof searchLocation.latitude === 'number' && 
              typeof searchLocation.longitude === 'number' && (
              <MapMarkerWrapper
                key="search-location"
                coordinate={{
                  latitude: searchLocation.latitude,
                  longitude: searchLocation.longitude
                }}
                title="搜索位置"
                pinColor="#d32f2f"
              />
            )}
          </MapViewWrapper>
          
          {/* 显示商店列表 */}
          <View style={styles.shopsOverlay}>
            <Text style={styles.shopsOverlayTitle}>奶茶店列表</Text>
            <FlatList
              data={shops}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.mapShopItem, 
                    selectedShop?.id === item.id && styles.selectedMapShopItem
                  ]}
                  onPress={() => onSelectShop(item.id)}
                >
                  <Text style={styles.mapShopName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.mapShopDistance} numberOfLines={1}>
                    {item.distance < 1000 ? 
                      `${item.distance} m` : 
                      `${(item.distance / 1000).toFixed(1)} km`}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* 如果有选中的商店，显示详情悬浮窗 */}
          {selectedShop && (
            <View style={styles.selectedShopFloatingCard}>
              <View style={styles.selectedShopContent}>
                <View style={styles.selectedShopHeader}>
                  <Text style={styles.selectedShopName}>{selectedShop.name}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => onSelectShop(null)}
                  >
                    <Icon name="close" size={22} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.selectedShopAddress}>{selectedShop.address}</Text>
                {selectedShop.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}><Icon name="star" size={16} color="#FFD700" /> {selectedShop.rating}</Text>
                  </View>
                )}
                <View style={styles.shopButtons}>
                  <TouchableOpacity 
                    style={styles.directionsButton}
                    onPress={() => onOpenDirections(selectedShop)}
                  >
                    <Icon name="navigate-outline" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.directionsButtonText}>导航前往</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
      
      {/* 加载更多按钮 */}
      {hasMoreCachedShops && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewModeContainer}>
        <ViewModeToggle />
      </View>
      
      <LocationSearch />
      
      {/* Render either list view or map view based on viewMode */}
      {viewMode === 'list' ? renderListView() : renderMapView()}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: StatusBar.currentHeight + 10 || 10,
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryDark,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.border,
  },
  viewModeToggle: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '100%',  
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  viewModeToggleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: COLORS.primary,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  // Add web-specific styles for search container
  searchContainerWeb: {
    paddingBottom: 70, // Extra padding for web to prevent overlap
    position: 'relative',
    zIndex: 10,
  },
  currentLocationButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  // Add web-specific styles for location button
  currentLocationButtonWeb: {
    marginTop: 16, // More margin on web
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 5,
  },
  currentLocationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  currentAddressText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    marginLeft: 2,
  },
  locationErrorText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100, // Space for floating button
  },
  shopItem: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  selectedShopItem: {
    borderColor: COLORS.accent,
    borderWidth: 3,
  },
  shopHeader: {
    flexDirection: 'row',
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  shopAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
  },
  priceLevel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 10,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 12,
  },
  shopImagePlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopStatus: {
    marginVertical: 8,
  },
  openStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  openNow: {
    backgroundColor: COLORS.highlight,
    color: 'white',
  },
  closedNow: {
    backgroundColor: 'rgba(200, 0, 0, 0.7)',
    color: 'white',
  },
  shopButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 6,
  },
  mapButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexGrow: 1,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  directionsButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexGrow: 1,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  floatingRefreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listFooter: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.border,
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    zIndex: 100
  },
  loadMoreButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#fff',
  },
  noMoreShopsText: {
    padding: 16,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  // Map related styles
  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    position: 'relative',
  },
  map: { 
    ...StyleSheet.absoluteFillObject 
  },
  mapEmbedContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  shopsOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
    zIndex: 5,
  },
  shopsOverlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  mapShopItem: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    width: 120,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  selectedMapShopItem: {
    borderColor: COLORS.accent,
    borderWidth: 3,
    backgroundColor: COLORS.accent,
  },
  mapShopName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  mapShopDistance: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  selectedShopFloatingCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  selectedShopContent: {
    width: '100%',
  },
  selectedShopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  selectedShopAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ff6b6b',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: 'white',
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: 'white',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  refreshButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  // Web-specific search styles
  webSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between', 
  },
  webSearchInput: {
    flex: 0.8,
    height: 45,
    borderWidth: 3,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginRight: 8,
    fontSize: 16,
  },
  webSearchButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  webSearchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  // Fallback styles for when map can't load
  fallbackShopItem: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
    width: '100%',
  },
  selectedFallbackShopItem: {
    borderColor: COLORS.accent,
    borderWidth: 3,
  },
  fallbackShopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  fallbackShopAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  fallbackShopDistance: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  selectedShopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  closeButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 