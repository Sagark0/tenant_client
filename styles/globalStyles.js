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
    headerContainer: {
      justifyContent: 'center',
      // height: 170, // Height for the extended top bar
      width: '100%',
      backgroundColor: '#fff',
    },
    imageBackground: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      padding: 20,
      paddingRight: 5,
      paddingTop: 5
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Black tint with 50% opacity
    },
    textContainer: {
      marginTop: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    h2: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    h4: {
      color: '#fff',
      fontSize: 13,
      marginVertical: 3,
    }
  });