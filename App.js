import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { BottomNavigation, Text } from "react-native-paper";
import { apiURL } from "./utility/constants";

import { PaperProvider } from "react-native-paper";
import HomeStack from "./routes/homeStack";
import RecentsRoute from "./screens/recent";
import NotificationsRoute from "./screens/notifications";

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log("Fetching Generate Dues")
    await fetch(`${apiURL}/payments/generateDues`);

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const registerBackgroundFetch = async () => {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, // 24 hours
    // minimumInterval: 60 * 60 * 24, // 24 hours
    stopOnTerminate: false,
    startOnBoot: true,
  });
};



export default function App() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    registerBackgroundFetch();
  }, []);
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

