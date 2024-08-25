import { useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Avatar, Button, List, Menu } from "react-native-paper";
import { apiURL } from "../utility/constants";
import ModalTemplate from "../components/modal";
import { roomEditFormData } from "../utility/formData/roomFormData";
import { getEmptyInitData } from "../utility/utils";
import { roomAddFormData } from "../utility/formData/roomFormData";
import SnackView from "../components/snackbar";

export default function Rooms({ route, navigation }) {
  const { property } = route.params;
  const [rooms, setRooms] = useState([]);
  const [activeMenuRoomId, setActiveMenuRoomId] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null); // Track the room being edited
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const openMenu = (roomId) => setActiveMenuRoomId(roomId);
  const closeMenu = () => setActiveMenuRoomId(null);

  // Fetch rooms with property id
  useEffect(() => {
    fetch(`${apiURL}/rooms?property_id=${property.property_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [property.property_id]);

  // API to update room details
  const handleSubmit = (values) => {
    fetch(`${apiURL}/rooms/${values.room_id}`, {
      method: "PUT",
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
        setRooms((prev) =>
          prev.map((room) => (data.room_id === room.room_id ? { ...room, ...data } : room))
        );
        setEditingRoom(null); // Close modal after update
      })
      .catch((err) => {
        console.log("Error updating room:", err);
      });
  };

  // API to delete room
  const handleDelete = (id) => {
    fetch(`${apiURL}/rooms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        } else {
          setRooms((prev) => prev.filter((room) => room.room_id !== id));
          console.log(`Room deleted successfully`);
        }
      })
      .catch((err) => {
        console.log("Error deleting room:", err);
      });
  };

  // API to Add new room
  const handleAddRoomSubmit = (values) => {
    values["property_id"] = property.property_id;
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
        setRooms((prev) => [...prev, data]);
        setSnackbarMessage("Room added successfully");
      })
      .catch((err) => {
        console.log("Failed to add room", err);
        setSnackbarMessage("Failed to add room");
      })
      .finally(() => {
        setAddRoomModalVisible(false);
        setSnackbarVisible(true);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ModalTemplate
        title="Add Room Details"
        initData={getEmptyInitData(roomAddFormData)}
        modalVisible={addRoomModalVisible}
        setModalVisible={setAddRoomModalVisible}
        formData={roomAddFormData}
        handleSubmit={handleAddRoomSubmit}
      />
      <SnackView
        visible={snackbarVisible}
        setVisible={setSnackbarVisible}
        message={snackbarMessage}
      />
      <List.Section>
        <View
          style={{
            marginHorizontal: 10,
            marginBottom: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{property.property_name}</Text>
          <Button icon="plus" style={{ marginTop: 4 }} onPress={() => setAddRoomModalVisible(true)}>
            Add Room
          </Button>
        </View>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.room_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Tenants", {
                  room: item,
                  property: property,
                })
              }
            >
              <ModalTemplate
                title={`Edit Room: ${item.room_no}, ${property.property_name}`}
                initData={editingRoom || item}
                modalVisible={editingRoom?.room_id === item.room_id}
                setModalVisible={(visible) => setEditingRoom(visible ? item : null)}
                formData={roomEditFormData}
                handleSubmit={handleSubmit}
              />
              <List.Item
                title={`Room No ${item.room_no}`}
                style={{ backgroundColor: "#fff" }}
                description={`Capacity: ${item.room_capacity}  Occupied: ${item.seat_occupied}`}
                left={() => <Avatar.Icon size={40} style={{ marginLeft: 18 }} icon="home" />}
                right={() => (
                  <Menu
                    visible={activeMenuRoomId === item.room_id}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity onPress={() => openMenu(item.room_id)}>
                        <List.Icon icon="dots-vertical" />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        closeMenu();
                        setEditingRoom(item); // Set the current room as the one being edited
                      }}
                      title="Edit"
                    />
                    <Menu.Item
                      onPress={() => {
                        closeMenu();
                        handleDelete(item.room_id);
                      }}
                      title="Delete"
                    />
                  </Menu>
                )}
              />
            </TouchableOpacity>
          )}
        />
      </List.Section>
    </View>
  );
}
