// src/components/IconComponent.jsx
import React from 'react';
import { Text, Platform, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

/**
 * Cross-platform icon component with text fallbacks for web
 * 
 * @param {Object} props - Component properties
 * @param {string} props.name - Ionicons name
 * @param {number} props.size - Icon size
 * @param {string} props.color - Icon color
 * @param {Object} props.style - Additional styles for the icon
 */
export const Icon = ({ name, size, color, style = {} }) => {
  // Check if we're running on web
  const isWeb = Platform.OS === 'web';
  
  // Map from Ionicons names to text fallback (for common icons)
  const iconMap = {
    // Navigation
    'arrow-back': '←',
    'arrow-back-outline': '←',
    'arrow-forward': '→',
    'arrow-forward-outline': '→',
    'menu': '☰',
    'menu-outline': '☰',
    'close': '✕',
    'close-outline': '✕',
    'close-circle': '⊗',
    'close-circle-outline': '⊗',
    'chevron-forward': '›',
    
    // Actions
    'search': '🔍',
    'search-outline': '🔍',
    'add': '+',
    'add-outline': '+',
    'add-circle': '⊕',
    'add-circle-outline': '⊕',
    'remove': '−',
    'remove-outline': '−',
    'remove-circle': '⊖',
    'remove-circle-outline': '⊖',
    'refresh': '↻',
    'refresh-outline': '↻',
    'trash': '🗑',
    'trash-outline': '🗑',
    'options': '⋮',
    'options-outline': '⋮',
    
    // Interface elements
    'list': '☰',
    'list-outline': '☰',
    'checkbox': '☑',
    'checkbox-outline': '☑',
    'checkmark': '✓',
    'checkmark-outline': '✓',
    'checkmark-circle': '✓',
    'checkmark-circle-outline': '✓',
    
    // Communication
    'mail': '✉',
    'mail-outline': '✉',
    'chatbubble': '💬',
    'chatbubble-outline': '💬',
    'chatbubbles': '💬',
    'chatbubbles-outline': '💬',
    'call': '📞',
    'call-outline': '📞',
    'send': '⇱',
    'send-outline': '⇱',
    
    // Media
    'camera': '📷',
    'camera-outline': '📷',
    'image': '🖼',
    'image-outline': '🖼',
    'play': '▶',
    'play-outline': '▶',
    'play-circle': '⏵',
    'play-circle-outline': '⏵',
    'pause': '⏸',
    'pause-outline': '⏸',
    
    // Devices
    'phone-portrait': '📱',
    'phone-portrait-outline': '📱',
    'laptop': '💻',
    'laptop-outline': '💻',
    
    // Weather
    'sunny': '☀',
    'sunny-outline': '☀',
    'moon': '🌙',
    'moon-outline': '🌙',
    
    // Person
    'person': '👤',
    'person-outline': '👤',
    'person-circle': '👤',
    'person-circle-outline': '👤',
    'people': '👥',
    'people-outline': '👥',
    
    // Location
    'location': '📍',
    'location-outline': '📍',
    'navigate': '🧭',
    'navigate-outline': '🧭',
    'map': '🗺',
    'map-outline': '🗺',
    
    // Food
    'cafe': '☕',
    'cafe-outline': '☕',
    'restaurant': '🍽',
    'restaurant-outline': '🍽',
    'wine': '🍷',
    'wine-outline': '🍷',
    'ice-cream': '🍦',
    'ice-cream-outline': '🍦',
    
    // Objects
    'heart': '❤',
    'heart-outline': '♡',
    'star': '★',
    'star-outline': '☆',
    'bookmark': '🔖',
    'bookmark-outline': '🔖',
    'time': '⏱',
    'time-outline': '⏱',
    
    // Alerts
    'information-circle': 'ℹ',
    'information-circle-outline': 'ℹ',
    'alert-circle': '⚠',
    'alert-circle-outline': '⚠',
    
    // Other
    'language': '🌐',
    'language-outline': '🌐',
    'leaf': '🍃',
    'leaf-outline': '🍃',
    'grid': '▦',
    'grid-outline': '▦',
    'eye': '👁',
    'eye-outline': '👁',
    'eye-off': '👁‍🗨',
    'eye-off-outline': '👁‍🗨',
    'pricetag': '🏷',
    'pricetag-outline': '🏷',
    'bulb': '💡',
    'bulb-outline': '💡',
    'log-out': '🚪',
    'log-out-outline': '🚪',
    
    // 添加缺少的图标 - 根据_layout.jsx需要
    'home': '🏠',
    'home-outline': '🏠',
    'filter': '⚙️',
    'filter-outline': '⚙️',
    // 确保所有需要的导航栏图标都有映射关系
    'chatbox': '💬',
    'chatbox-outline': '💬',
    'chatbox-ellipses': '💬',
    'chatbox-ellipses-outline': '💬',
    'calendar': '📅',
    'calendar-outline': '📅',
    'settings': '⚙️',
    'settings-outline': '⚙️',
    'analytics': '📊',
    'analytics-outline': '📊',
    'flask': '🧪',
    'flask-outline': '🧪',
    'color-filter': '🔍',
    'color-filter-outline': '🔍',
    'color-wand': '✨',
    'color-wand-outline': '✨',
  };

  // On web, use text fallbacks
  if (isWeb) {
    // Get fallback text or use a default
    const fallbackText = iconMap[name] || '•';
    
    // Style for text-based icon
    const textStyle = {
      fontSize: size,
      color: color,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: size,
      ...style
    };
    
    // Log icon name and color for debugging
    console.log(`Rendering icon: ${name} with color: ${color}`);
    
    return (
      <Text style={textStyle}>{fallbackText}</Text>
    );
  }
  
  // For native, ensure the exact icon name is passed to Ionicons
  // This fixes inconsistent color changes in tabs
  return <Ionicons name={name} size={size} color={color} style={style} />;
};