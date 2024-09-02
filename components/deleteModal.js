import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { screenWidth } from "../utility/constants";

const DeleteModal = ({ modalVisible, setModalVisible, handleConfirm }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Portal>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                width: screenWidth * 0.9,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Text variant="titleMedium">Are you confirm to delete?</Text>
              <View style={{ flexDirection: "row-reverse", marginVertical: 15 }}>
                <Button
                  onPress={() => handleConfirm()}
                  mode="contained"
                  style={{ marginLeft: 10 }}
                >
                  Confirm
                </Button>
                <Button onPress={() => setModalVisible(false)} mode="outlined">
                  Close
                </Button>
              </View>
            </View>
          </View>
        </Portal>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteModal;
