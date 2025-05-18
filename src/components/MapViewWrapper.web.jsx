import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const COLORS = {
  primary: "#f8ca69",
  accent: "#f7bd10",
  text: "#333333"
};

/**
 * Web platform implementation of MapViewWrapper
 */
export function MapViewWrapper(props) {
  const { 
    style, 
    mapUrl, 
    loading, 
    children, 
    loadingError 
  } = props;
  
  if (loading) {
    return (
      <View style={[style, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{marginTop: 10, color: COLORS.text}}>正在加载地图...</Text>
      </View>
    );
  }

  if (loadingError) {
    return (
      <View style={[style, {justifyContent: 'center', alignItems: 'center', padding: 16}]}>
        <Text style={{color: '#d32f2f', marginBottom: 10}}>
          地图加载失败，请稍后再试。
        </Text>
        {children}
      </View>
    );
  }
  
  return (
    <View style={style}>
      {mapUrl ? (
        <iframe 
          src={mapUrl}
          style={{border: 0, width: '100%', height: '100%'}}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>未能加载地图</Text>
        </View>
      )}
      {children}
    </View>
  );
}

/**
 * Marker component is not used in web implementation
 */
export function MapMarkerWrapper() {
  return null;
} 