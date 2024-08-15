import { Dimensions } from "react-native";
// export const apiURL = 'https://tenant-server-gx7q.onrender.com'
// export const apiURL = 'http://192.168.1.13:3000'
export const apiURL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const propertyDefaultImage = 'https://img.freepik.com/free-vector/city-skyline-concept-illustration_114360-8923.jpg?t=st=1723026203~exp=1723029803~hmac=ebe09e2215a83f4948a8090818742b50f07a994aab34abb93f8187e27ec35931&w=1380'

export const screenWidth = Dimensions.get("window").width;