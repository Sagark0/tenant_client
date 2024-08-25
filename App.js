import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { BottomNavigation, Text } from "react-native-paper";
import { apiURL } from "./utility/constants";

import { PaperProvider } from "react-native-paper";
import HomeStack from "./routes/homeStack";
import NotificationsRoute from "./screens/notifications";

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import DueAndPaymentStack from "./routes/duesAndPaymentStack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLastDueGenerated } from "./utility/utils";
import moment from "moment";

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
    // minimumInterval: 60, // 24 hours
    minimumInterval: 60 * 60 * 12, // 12 hours
    stopOnTerminate: false,
    startOnBoot: true,
  });
};



export default function App() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    registerBackgroundFetch();
  }, []);

  useEffect(() => {
    const generateDuesIfNeeded = async () => {
      const alreadyGenerated = await checkLastDueGenerated();
      if (!alreadyGenerated) {
        fetch(`${apiURL}/payments/generateDues`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not OK");
            }
            AsyncStorage.setItem(
              "last_due_generated_time",
              moment().toISOString()
            );
            console.log("Dues generated successfully");
          })
          .catch((err) => {
            console.log("Error while generating dues:", err.message || err);
          });
      }
    };
  
    generateDuesIfNeeded();
  }, []);
  

  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeStack,
    recents: DueAndPaymentStack,
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

