import React, { useState } from "react";
import { StyleSheet, View, FlatList, Image, ActivityIndicator, Text, TouchableOpacity, Animated } from "react-native";
import { Bubble, MessageInput } from "../AiChatUiLib.js";

export function AiChatView ({
  chatHistory,
  isLoading,
  error,
  onSend
}) {
  const [selectedType, setType] = useState(0);

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser && styles.userMessage
    ]}>
      {item.isUser ? (
        <Bubble
          text={item.content}
          style={styles.userBubble}
        />
      ) : (
        <RecommendationMessage 
          recommendation={item.content}
          imageUrl={item.image}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recommendations yet. Start by describing your ideal milk tea!</Text>
        }
      />

      <ChatInput 
        onSend={onSend}
        isLoading={isLoading}
        selectedType={selectedType}
        onTypeChange={setType}
      />
      
      {error && <ErrorToast message={error} />}
    </View>
  );
};

// RecommendationMessage Component with Accordion
const RecommendationMessage = ({ recommendation, imageUrl }) => {
  const [prepExpanded, setPrepExpanded] = useState(false);
  const [flavorExpanded, setFlavorExpanded] = useState(false);
  const prepHeight = useState(new Animated.Value(0))[0];
  const flavorHeight = useState(new Animated.Value(0))[0];

  const toggleAccordion = (type) => {
    if (type === "prep") {
      Animated.timing(prepHeight, {
        toValue: prepExpanded ? 0 : 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setPrepExpanded(!prepExpanded);
    } else {
      Animated.timing(flavorHeight, {
        toValue: flavorExpanded ? 0 : 60,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setFlavorExpanded(!flavorExpanded);
    }
  };

  return (
    <View style={styles.recommendationContainer}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }}
          style={styles.previewImage}
          resizeMode="contain"
        />
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{recommendation.name}</Text>
        
        {/* Preparation Accordion */}
        <TouchableOpacity onPress={() => toggleAccordion("prep")}>
          <Text style={styles.accordionTitle}>Preparation {prepExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.accordionContent, { height: prepHeight }]}>
          {recommendation.instructions.map((step, index) => (
            <Text key={index} style={styles.stepText}>• {step}</Text>
          ))}
        </Animated.View>

        {/* Flavor Profile Accordion */}
        <TouchableOpacity onPress={() => toggleAccordion("flavor")}>
          <Text style={styles.accordionTitle}>Flavor Profile {flavorExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.accordionContent, { height: flavorHeight }]}>
          <Text style={styles.flavorText}>
            {recommendation.flavor_profile.texture.charAt(0).toUpperCase() + 
             recommendation.flavor_profile.texture.slice(1)} | 
            Sweetness: {recommendation.flavor_profile.sweetness}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

// ChatInput Component with Custom Segmented Control
const ChatInput = ({ onSend, isLoading, selectedType, onTypeChange }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSend({
        query: inputText,
        type: ["existing_recipes", "new_creations"][selectedType]
      });
      setInputText("");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segmentButton, selectedType === 0 && styles.segmentButtonActive]}
          onPress={() => onTypeChange(0)}
        >
          <Text style={[styles.segmentText, selectedType === 0 && styles.segmentTextActive]}>
            Existing Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, selectedType === 1 && styles.segmentButtonActive]}
          onPress={() => onTypeChange(1)}
        >
          <Text style={[styles.segmentText, selectedType === 1 && styles.segmentTextActive]}>
            New Creations
          </Text>
        </TouchableOpacity>
      </View>
      
      <MessageInput
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleSubmit}
        placeholder="Describe your milk tea needs..."
        placeholderTextColor="#64748b"
        accessoryRight={isLoading ? (
          <ActivityIndicator size="small" color="#6366f1" />
        ) : undefined}
        submitButtonStyle={styles.submitButton}
      />
    </View>
  );
};

// ErrorToast Component
const ErrorToast = ({ message }) => (
  <View style={styles.errorToast}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  recommendationContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366f1',
    marginVertical: 8,
  },
  accordionContent: {
    overflow: 'hidden',
  },
  stepText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginLeft: 8,
  },
  flavorText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#6366f1',
  },
  segmentText: {
    fontSize: 14,
    color: '#6366f1',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  userBubble: {
    backgroundColor: '#6366f1',
    maxWidth: '85%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    paddingHorizontal: 40,
    fontSize: 16,
    lineHeight: 24,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingVertical: 10,
  },
  errorToast: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
});