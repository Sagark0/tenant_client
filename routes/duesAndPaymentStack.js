import HeaderMenu from "../components/headerMenu";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecentsRoute from "../screens/recent";
const Stack = createNativeStackNavigator();

export default function DueAndPaymentStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        // screenOptions={({ navigation, route }) => ({
        //   headerRight: () => <HeaderMenu navigation={navigation} />,
        // })}
      >
        <Stack.Screen name="Recents" component={RecentsRoute}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
