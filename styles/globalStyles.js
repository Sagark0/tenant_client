import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    pressableButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black',
      marginLeft: 20,
      marginTop: 10

    },
    pressableText: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });