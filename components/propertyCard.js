import { useState } from 'react';

import { Menu, Card, IconButton, Button, Text } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { apiURL, propertyDefaultImage } from "../utility/constants";

const PropertyCard = ({ navigation, property, setProperties }) => {
  const [modalVisible, setModalVisible] = useState(false);
 const [activeMenuPropertyId, setActiveMenuPropertyId] = useState(null);
  const openMenu = (property_id) => setActiveMenuPropertyId(property_id);
  const closeMenu = () => setActiveMenuPropertyId(null);
  console.log("Property:", property);
  handlePropertyDelete = (id) => {
    fetch(`${apiURL}/properties/${id}`,{
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json"
      }
    }).then((res) => {
      if(!res.ok){
        throw Error("Network response was not ok")
      }
      else {
        setProperties((prev) => prev.filter(property => property.property_id !== id))
        console.log(`Property deleted successfully`)};
    })
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Rooms", { property })}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: propertyDefaultImage }} />
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text variant="titleLarge" style={styles.title}>
              {property.property_name}
            </Text>
            <Text variant="bodyMedium">{property.property_address}</Text>
          </View>
          <Menu
            visible={activeMenuPropertyId === property.property_id}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-vertical"
                color="black"
                onPress={() => openMenu(property.property_id)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Edit Property"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                handlePropertyDelete(property.property_id);
              }}
              title="Delete Property"
            />
          </Menu>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginTop: 7,
  },
});

export default PropertyCard;
