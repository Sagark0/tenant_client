import HeaderMenu from "../components/headerMenu";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import NotificationsRoute from "../screens/notifications";

export default function NotificationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Notifications"
        // screenOptions={({ navigation, route }) => ({
        //   headerRight: () => <HeaderMenu navigation={navigation} />,
        // })}
      >
        <Stack.Screen name="Notifications" component={NotificationsRoute}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
