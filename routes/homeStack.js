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
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        // screenOptions={({ navigation, route }) => ({
        //   headerRight: () => <HeaderMenu navigation={navigation} />,
        // })}
      >
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Rooms" component={Rooms}/>
        <Stack.Screen name="Tenants" component={Tenants} />
        <Stack.Screen name="Tenant Details" component={TenantDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
