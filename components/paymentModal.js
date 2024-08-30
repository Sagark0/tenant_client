import { Keyboard, Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { screenWidth } from "../utility/constants";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import { apiURL } from "../utility/constants";
import SnackView from "./snackbar";
import { useState } from "react";
const PaymentModal = ({
  modalVisible,
  setModalVisible,
  room_id,
  electricity_reading,
  totalDues,
  setSnackbarMessage,
  setSnackbarVisible,
  fetchDues,
}) => {
  // Handling add payment
  const handleSubmit = (values) => {
    values["prev_electricity_reading"] = electricity_reading;
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
        fetchDues();
        setSnackbarMessage("Payment added successfully");
      })
      .catch((err) => {
        console.log("Error adding payment", err);
        setSnackbarMessage("Error occur while adding payment");
      })
      .finally(() => {
        setModalVisible(false);
        setTimeout(() => {
          setSnackbarVisible(true);
        }, 100);
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
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Payment</Text>
            <Text style={{marginBottom: 7}}>
              Last Electricity Reading:{" "}
              {electricity_reading || (
                  <Text style={{ marginBottom: 20, fontSize: 12, color: "red" }}>{"\n"}Last electricity reading not added!</Text>
              )}
            </Text>
            <Text>Remaining Dues: {totalDues} </Text>
            <Formik
              initialValues={{
                payment_amount: "",
                new_electricity_reading: "",
                electricity_rate: "",
              }}
              onSubmit={(values) => handleSubmit(values)}
            >
              {(props) => {
                const totalNewDues =
                  totalDues +
                  (parseFloat(props.values.new_electricity_reading || 0) -
                    parseFloat(electricity_reading)) *
                    parseFloat(props.values.electricity_rate || 0);
                return (
                  <View>
                    <TextInput
                      label="New Electricity Reading"
                      value={props.values.new_electricity_reading}
                      keyboardType="numeric"
                      onChangeText={props.handleChange("new_electricity_reading")}
                      style={{ marginTop: 15 }}
                    />
                    <TextInput
                      label="Rate"
                      value={props.values.electricity_rate}
                      keyboardType="numeric"
                      onChangeText={props.handleChange("electricity_rate")}
                      style={{ marginTop: 15 }}
                    />
                    <TextInput
                      label="Amount"
                      value={props.values.payment_amount}
                      keyboardType="numeric"
                      onChangeText={props.handleChange("payment_amount")}
                      style={{ marginTop: 15 }}
                    />
                    <Text>
                      Total Dues: {isNaN(totalNewDues) ? totalDues : totalNewDues.toFixed(2)}
                    </Text>
                    <View
                      style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }}
                    >
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
                );
              }}
            </Formik>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PaymentModal;
