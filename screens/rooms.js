import { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Avatar, List, Menu } from "react-native-paper";
import { apiURL } from "../utility/constants";
import ModalTemplate from "../components/modal";
import { roomEditFormData } from "../utility/formData/roomFormData";

export default function Rooms({ route, navigation }) {
  const { property } = route.params;
  const [rooms, setRooms] = useState([]);
  const [activeMenuRoomId, setActiveMenuRoomId] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null); // Track the room being edited

  const openMenu = (roomId) => setActiveMenuRoomId(roomId);
  const closeMenu = () => setActiveMenuRoomId(null);

  // Manage new room added
  useEffect(() => {
    if (route.params.newRoom?.property_id === property.property_id) {
      setRooms((prev) => [...prev, route.params.newRoom]);
    }
  }, [route.params?.newRoom]);

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
        setRooms((prev) => prev.map((room) => (data.room_id === room.room_id ? { ...room, ...data } : room)));
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

  return (
    <View>
      <List.Section>
        <List.Subheader>{property.property_name}</List.Subheader>
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
