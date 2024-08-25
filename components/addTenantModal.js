import { Keyboard, Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "react-native-paper";
import { apiURL, screenWidth } from "../utility/constants";
import { useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";

const AddTenantModal = ({ modalVisible, setModalVisible, room, setTenants }) => {
  const [tenantOptions, setTenantOptions] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch(`${apiURL}/tenants?room_id=null`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((tenants) => {
        const options = tenants.map((tenant) => ({
          value: `${tenant.tenant_id} - ${tenant.tenant_name}`,
          key: tenant.tenant_id,
        }));
        setTenantOptions(options);
        console.log("tenant options", options);
      })
      .catch((err) => {
        console.log("Error fetching Tenant", err);
      });
  }, [room]);

  const handleSubmit = () => {
    if (selected === "") {
      console.log("No Value Selected");
    }
    console.log(selected);
    fetch(`${apiURL}/tenants/${selected}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: room.room_id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setTenants((prev) => [...prev, data]);
      })
      .catch((err) => {
        console.log("Error adding tenant", err);
      })
      .finally(() => {
        setModalVisible(false);
      });
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
            <Text>Add Tenant to Room: {room.room_no}</Text>
            <View style={{ marginTop: 20 }}>
              <SelectList setSelected={(val) => setSelected(val)} data={tenantOptions} save="key" />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }}>
              <Button
                mode="outlined"
                onPress={() => {
                  setSelected("");
                  setModalVisible(false);
                }}
              >
                Close
              </Button>
              <Button mode="contained" style={{ marginLeft: 15 }} onPress={handleSubmit}>
                Add Tenant
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddTenantModal;
