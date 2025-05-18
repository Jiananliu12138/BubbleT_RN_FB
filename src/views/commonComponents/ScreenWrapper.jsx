// src/views/commonComponents/ScreenWrapper.jsx
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({ children, background }) => {
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top : 30;
  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: background || '#f8ca69' }}>
      {children}
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({});