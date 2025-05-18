// ui-components.js
import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define COLORS constant
const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色
  primaryDark: "#f7bd10",  // 深一点的主色调：深黄色
  accent: "#f7bd10",       // 强调色：深黄色
  accentLight: "#f8ca69",  // 浅一点的强调色：浅黄色
  background: "#f8ca69",   // 背景色：黄色
  cardBackground: "#f7bd10", // 卡片背景：深黄色
  text: "#333333",         // 主要文本：深灰色
  textSecondary: "#666666",// 次要文本：中灰色
  border: "#000000",       // 边框色：黑色
  success: "#4caf50",      // 成功色：绿色
  favorite: "#ff5c8d"      // 收藏色：粉红色
};

// ======================
// Bubble Component
// ======================
export const Bubble = ({ 
  text, 
  isUser = false, 
  style, 
  timestamp,
  status = 'sent' // 'sent' | 'delivered' | 'read'
}) => {
  const formattedTime = timestamp || new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const statusIcons = {
    sent: '◷',
    delivered: '✓',
    read: '✓✓'
  };

  return (
    <View style={[
      styles.bubbleContainer,
      isUser ? styles.userBubble : styles.aiBubble,
      style
    ]}>
      <Text style={isUser ? styles.userText : styles.aiText}>
        {text}
      </Text>
      
      <View style={styles.bubbleFooter}>
        <Text style={styles.timestamp}>
          {formattedTime}
        </Text>
        {isUser && (
          <Text style={styles.status}>
            {statusIcons[status]}
          </Text>
        )}
      </View>
    </View>
  );
};

// ======================
// MessageInput Component
// ======================
export const MessageInput = ({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
  isLoading = false,
  isDisabled = false,
  accessoryRight,
  submitButtonStyle,
}) => {
  const handleSubmit = () => {
    if (!isDisabled && !isLoading) {
      onSubmitEditing?.();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        multiline
        editable={!isDisabled}
        blurOnSubmit={false}
      />
      
      {accessoryRight && (
        <View style={styles.accessory}>
          {accessoryRight}
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.sendButton,
          submitButtonStyle,
          (isDisabled || isLoading) && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={isDisabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Icon name="send" size={22} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

// ======================
// Shared Styles
// ======================
const styles = StyleSheet.create({
  // Bubble Styles
  bubbleContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    elevation: 2,
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  userBubble: {
    backgroundColor: COLORS.primaryDark,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.cardBackground,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 6,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.8,
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // MessageInput Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 8,
    elevation: 3,
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primaryDark,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
  },
  accessory: {
    marginRight: 12,
  },
});

