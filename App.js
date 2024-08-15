import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { BottomNavigation, Text } from "react-native-paper";

import { PaperProvider } from "react-native-paper";
import HomeStack from "./routes/homeStack";
import RecentsRoute from "./screens/recent";
import NotificationsRoute from "./screens/notifications";

export default function App() {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeStack,
    recents: RecentsRoute,
    notifications: NotificationsRoute,
  });

  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
}

