// src/views/commonComponents/loadingView.jsx
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'

export function LoadingView({ message = "" }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color='grey' />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  }
});