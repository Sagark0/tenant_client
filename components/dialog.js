import { View } from "react-native";
import { Button, Dialog, Portal, PaperProvider, Text } from "react-native-paper";

const DialogTemplate = ({ visible, setVisible, message }) => {
  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <PaperProvider>
        <View>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Are you confirm to {message}?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={hideDialog}>Confirm</Button>
            </Dialog.Actions>
          </Dialog>
        </View>
      </PaperProvider>
    </Portal>
  );
};

export default DialogTemplate;
