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
        placeholderTextColor="#94a3b8"
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  userBubble: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: '#1e293b',
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
  },
  status: {
    fontSize: 12,
  },

  // MessageInput Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  accessory: {
    marginRight: 12,
  },
});

// ======================
// Component Exports
// ======================
export default { Bubble, MessageInput };