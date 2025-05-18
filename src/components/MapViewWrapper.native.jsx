import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

/**
 * Native platform implementation of MapViewWrapper
 * Uses react-native-maps directly
 */
export function MapViewWrapper(props) {
  const { 
    style, 
    initialRegion, 
    region,
    onRegionChangeComplete,
    showsUserLocation,
    showsMyLocationButton,
    showsCompass,
    ref,
    onError,
    children 
  } = props;

  try {
    return (
      <MapView
        style={style}
        initialRegion={initialRegion || region}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={showsMyLocationButton}
        showsCompass={showsCompass}
        ref={ref}
        onError={onError}
      >
        {children}
      </MapView>
    );
  } catch (error) {
    console.error('地图加载失败:', error);
    
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', padding: 16 }]}>
        <Text style={{ color: '#d32f2f', textAlign: 'center', marginBottom: 10 }}>
          地图组件加载失败，请确保安装了正确的依赖。
        </Text>
        {children}
      </View>
    );
  }
}

/**
 * Native implementation of map marker wrapper
 * Uses react-native-maps Marker component directly
 */
export function MapMarkerWrapper(props) {
  return <Marker {...props} />;
} 