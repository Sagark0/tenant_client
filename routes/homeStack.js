import Home from "../screens/home";
import Rooms from "../screens/rooms";
import HeaderMenu from "../components/headerMenu";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tenants from "../screens/tenants";
import { useState } from "react";
import TenantDetails from "../screens/tenantDetails";
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  const [newRoom, setNewRoom] = useState({});
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation, route }) => ({
          headerRight: () => <HeaderMenu navigation={navigation} setNewRoom={setNewRoom} />,
        })}
      >
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Rooms" component={Rooms} initialParams={{newRoom: newRoom}}/>
        <Stack.Screen name="Tenants" component={Tenants} />
        <Stack.Screen name="Tenant Details" component={TenantDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
