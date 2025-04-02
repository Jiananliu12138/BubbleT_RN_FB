// AiChatView.js
import React, { useState } from "react";
import { StyleSheet, View, FlatList, Image, ActivityIndicator, Text } from "react-native";
//import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Bubble, MessageInput } from "../AiChatUiLib.js";

export function AiChatView ({
  chatHistory,
  isLoading,
  error,
  onSend
}) {
  return <View>
    <Text>AiChat</Text>
  </View>
}
// export function AiChatView ({
//   chatHistory,
//   isLoading,
//   error,
//   onSend
// }) {
//   const [selectedType, setType] = useState(0);

//   const renderMessage = ({ item }) => (
//     <View style={[
//       styles.messageContainer,
//       item.isUser && styles.userMessage
//     ]}>
//       {item.isUser ? (
//         <Bubble
//           text={item.content}
//           style={styles.userBubble}
//         />
//       ) : (
//         <RecommendationMessage 
//           recommendation={item.content}
//           imageUrl={item.image}
//         />
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={chatHistory}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No recommendations yet. Start by describing your ideal milk tea!</Text>
//         }
//       />

//       <ChatInput 
//         onSend={onSend}
//         isLoading={isLoading}
//         selectedType={selectedType}
//         onTypeChange={setType}
//       />
      
//       {error && <ErrorToast message={error} />}
//     </View>
//   );
// };

// // 子组件保持为纯展示组件
// const RecommendationMessage = ({ recommendation, imageUrl }) => (
//   <View style={styles.recommendationContainer}>
//     {imageUrl && (
//       <Image 
//         source={{ uri: imageUrl }}
//         style={styles.previewImage}
//         resizeMode="contain"
//       />
//     )}
    
//     <View style={styles.detailsContainer}>
//       <Text style={styles.title}>{recommendation.name}</Text>
      
//       <Accordion title="Preparation">
//         {recommendation.instructions.map((step, index) => (
//           <Text key={index} style={styles.stepText}>• {step}</Text>
//         ))}
//       </Accordion>
      
//       <Accordion title="Flavor Profile">
//         <Text style={styles.flavorText}>
//           {recommendation.flavorProfile.texture.charAt(0).toUpperCase() + 
//           recommendation.flavorProfile.texture.slice(1)} | 
//           Sweetness: {recommendation.flavorProfile.sweetness}
//         </Text>
//       </Accordion>
//     </View>
//   </View>
// );

// const ChatInput = ({ onSend, isLoading, selectedType, onTypeChange }) => {
//   const [inputText, setInputText] = useState("");

//   const handleSubmit = () => {
//     if (inputText.trim()) {
//       onSend({
//         query: inputText,
//         type: ["existing_recipes", "new_creations"][selectedType]
//       });
//       setInputText("");
//     }
//   };

//   return (
//     <View style={styles.inputContainer}>
//       <SegmentedControl
//         values={["Existing Recipes", "New Creations"]}
//         selectedIndex={selectedType}
//         onChange={(event) => onTypeChange(event.nativeEvent.selectedSegmentIndex)}
//         style={styles.selector}
//         tintColor="#6366f1"
//       />
      
//       <MessageInput
//         value={inputText}
//         onChangeText={setInputText}
//         onSubmitEditing={handleSubmit}
//         placeholder="Describe your milk tea needs..."
//         placeholderTextColor="#64748b"
//         accessoryRight={isLoading ? (
//           <ActivityIndicator size="small" color="#6366f1" />
//         ) : undefined}
//         submitButtonStyle={styles.submitButton}
//       />
//     </View>
//   );
// };


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
  selector: {
    marginBottom: 16,
    height: 36,
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
  }
})