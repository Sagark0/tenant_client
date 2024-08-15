import { useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import ModalTemplate from "./modal";
import { roomAddFormData } from "../utility/formData/roomFormData";
import { apiURL } from "../utility/constants";
import { getEmptyInitData } from "../utility/utils";
const HeaderMenu = ({ setNewRoom }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);


  const handleAddRoomSubmit = (values) => {
    console.log(values);
    fetch(`${apiURL}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setNewRoom(data);
        setAddRoomModalVisible(false);
      })
      .catch((err) => {
        console.log("Failed to add room", err);
        setAddRoomModalVisible(false);
      });
  };

  return (
    <View>
      <ModalTemplate
        title="Add Room Details"
        initData={getEmptyInitData(roomAddFormData)}
        modalVisible={addRoomModalVisible}
        setModalVisible={setAddRoomModalVisible}
        formData={roomAddFormData}
        handleSubmit={handleAddRoomSubmit}
      />

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        style={{ marginTop: 40 }}
        anchor={<IconButton icon="dots-vertical" color="white" onPress={openMenu} />}
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            setAddRoomModalVisible(true);
          }}
          title="Add Room"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
          }}
          title="Add Tenant"
        />
      </Menu>
    </View>
  );
};

export default HeaderMenu;
