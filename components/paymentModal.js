import { Keyboard, Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { screenWidth } from "../utility/constants";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import { apiURL } from "../utility/constants";
import SnackView from "./snackbar";
import { useState } from "react";
const PaymentModal = ({ modalVisible, setModalVisible, room_id }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Handling add payment
  const handleSubmit = (values) => {
    console.log(values);
    fetch(`${apiURL}/payments/${room_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSnackbarMessage("Payment added successfully");
      })
      .catch((err) => {
        console.log("Error adding payment", err);
        setSnackbarMessage("Error occur while adding payment");
      })
      .finally(() => {
        setModalVisible(false);
        setSnackbarVisible(true);
      });
  };
  return (
    <Modal transparent={true} animationType="slide" visible={modalVisible}>
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
            <Text> Payment </Text>
            <SnackView
              visible={snackbarVisible}
              setVisible={setSnackbarVisible}
              message={snackbarMessage}
            />
            <Formik
              initialValues={{ payment_amount: "" }}
              onSubmit={(values) => handleSubmit(values)}
            >
              {(props) => (
                <View>
                  <TextInput
                    label="Amount"
                    value={props.values.payment_amount}
                    keyboardType="numeric"
                    onChangeText={props.handleChange("payment_amount")}
                    style={{ marginTop: 15}}
                  />
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }}>
                    <Button mode="outlined" onPress={() => setModalVisible(false)}>
                      Close
                    </Button>
                    <Button
                      mode="contained"
                      style={{ marginLeft: 15 }}
                      onPress={props.handleSubmit}
                    >
                      Add Payment
                    </Button>
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

export default PaymentModal;
