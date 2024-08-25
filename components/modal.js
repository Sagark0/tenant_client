import {
  View,
  Text,
  Modal,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-paper";
import { screenWidth } from "../utility/constants";
import { Formik } from "formik";
import { globalStyles } from "../styles/globalStyles";
import AutocompleteInput from "react-native-autocomplete-input";
import DateTimePicker from "@react-native-community/datetimepicker";

const ModalTemplate = ({
  title,
  initData,
  modalVisible,
  setModalVisible,
  formData,
  handleSubmit,
}) => {
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
                        <View key={input.formTitle} style={styles.datepickerView}>
                          <Text style={{ color: "#49454f", fontSize: 15, marginLeft: 5 }}>
                            {input.formLabel}
                          </Text>
                          <DateTimePicker
                            value={new Date(props.values[input.formTitle])}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              const currentDate = selectedDate || props.values[input.formTitle];
                              props.setFieldValue(input.formTitle, currentDate);
                            }}
                          />
                        </View>
                      );
                    }
                    {
                      /* if (input.formType === "autocomplete") {
                    console.log("input", input)
                    return (
                      <AutocompleteInput
                        key={input.formTitle}
                        label={input.formLabel}
                        value={(props.values[input.formTitle] || "").toString()}
                        onChange={props.handleChange(input.formTitle)}
                        options={[
                          { label: "New York", value: "new_york" },
                          { label: "Los Angeles", value: "los_angeles" },
                          { label: "Chicago", value: "chicago" },
                        ] || [] }
                      />
                    );
                  } */
                    }
                    return null;
                  })}
                  <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <Pressable
                      onPress={() => setModalVisible(false)}
                      style={globalStyles.pressableButton}
                    >
                      <Text style={globalStyles.pressableText}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={props.handleSubmit} style={globalStyles.pressableButton}>
                      <Text style={globalStyles.pressableText}>Submit</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalTemplate;

const styles = StyleSheet.create({
  datepickerView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e7e0ec",
    padding: 10,
    borderBottomColor: "#a29da5",
    borderBottomWidth: 0.5,
  },
});
