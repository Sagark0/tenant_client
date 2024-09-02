import {
  View,
  Text,
  Modal,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Button, IconButton, Menu, TextInput } from "react-native-paper";
import { screenWidth } from "../utility/constants";
import { Formik } from "formik";
import { globalStyles } from "../styles/globalStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { captureImage, deleteImage, pickImage, uploadImage } from "../utility/imageUpload";
const ModalTemplate = ({
  title,
  initData,
  modalVisible,
  setModalVisible,
  formData,
  handleSubmit,
  isLoading = false,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{title}</Text>
            <ScrollView>
              <Formik initialValues={{ ...initData }} onSubmit={(values) => handleSubmit(values)}>
                {(props) => (
                  <View>
                    {formData?.map((input) => {
                      if (input.formType === "text") {
                        return (
                          <TextInput
                            key={input.formTitle}
                            label={input.formLabel}
                            value={(props.values[input.formTitle] || "").toString()}
                            onChangeText={props.handleChange(input.formTitle)}
                            keyboardType={input.keyboardType || "default"}
                            style={{ marginTop: 10 }}
                            disabled={input.disabled === "true"}
                          />
                        );
                      }
                      if (input.formType === "datepicker") {
                        return (
                          <View key={input.formTitle} style={styles.inputView}>
                            <Text style={{ color: "#49454f", fontSize: 15, marginLeft: 5 }}>
                              {input.formLabel}
                            </Text>
                            <TouchableOpacity onPress={showDatePicker}>
                              <Text style={{ color: "#007aff", fontSize: 17 }}>
                                {props.values[input.formTitle]
                                  ? new Date(props.values[input.formTitle]).toLocaleDateString()
                                  : "Select Date"}
                              </Text>
                            </TouchableOpacity>
                            {isDatePickerVisible && (
                              <DateTimePicker
                                value={new Date(props.values[input.formTitle])}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                  hideDatePicker();
                                  const currentDate = selectedDate || props.values[input.formTitle];
                                  props.setFieldValue(input.formTitle, currentDate);
                                }}
                                onClose={hideDatePicker} // Close picker on cancel
                              />
                            )}
                          </View>
                        );
                      }
                      if (input.formType === "file") {
                        return (
                          <View key={input.formTitle} style={styles.inputView}>
                            <Text style={{ color: "#49454f", fontSize: 15, marginLeft: 5 }}>
                              {props.values[input.formTitle]?.fileName || input.formLabel}
                            </Text>
                            {!props.values[input.formTitle]?.fileName ? (
                              <View style={{ flexDirection: "row" }}>
                                <IconButton
                                  icon="camera"
                                  size={20}
                                  onPress={async () => {
                                    const { uri, fileName } = await captureImage();
                                    props.setFieldValue(input.formTitle, {
                                      uri,
                                      fileName,
                                    });
                                  }}
                                />
                                <IconButton
                                  icon="view-gallery"
                                  size={20}
                                  onPress={async () => {
                                    const { uri, fileName } = await pickImage();
                                    props.setFieldValue(input.formTitle, {
                                      uri,
                                      fileName,
                                    });
                                  }}
                                />
                              </View>
                            ) : (
                              <View style={{ flexDirection: "row" }}>
                                <Button
                                  onPress={async () => {
                                    await deleteImage(props.values[input.formTitle]?.fileName);
                                    props.setFieldValue(input.formTitle, {
                                      uri: null,
                                      fileName: null,
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              </View>
                            )}
                          </View>
                        );
                      }
                      return null;
                    })}
                    {isLoading ? (
                      <View
                        style={{ marginTop: 15, justifyContent: "center", alignItems: "center" }}
                      >
                        <ActivityIndicator animating={true} />
                        <Text style={{ color: "#5C5C5C", marginTop: 5 }}>Please Wait! Don't close the App.</Text>
                      </View>
                    ) : (
                      <View
                        style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 15 }}
                      >
                        <Button mode="contained" onPress={() => setModalVisible(false)}>
                          Cancel
                        </Button>
                        <Button
                          mode="contained"
                          onPress={props.handleSubmit}
                          style={{ marginLeft: 10 }}
                        >
                          Submit
                        </Button>
                      </View>
                    )}
                  </View>
                )}
              </Formik>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalTemplate;

const styles = StyleSheet.create({
  inputView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e7e0ec",
    padding: 10,
    borderBottomColor: "#a29da5",
    borderBottomWidth: 0.5,
    height: 60,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
  },
});
