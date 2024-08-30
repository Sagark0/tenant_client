import { useEffect, useState } from "react";

import { Menu, Card, IconButton, Button, Text } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { apiURL, propertyDefaultImage } from "../utility/constants";
import DialogTemplate from "./dialog";

const PropertyCard = ({ navigation, property, setProperties, handlePropertyDelete }) => {
  const [activeMenuPropertyId, setActiveMenuPropertyId] = useState(null);
  // const [dialogVisible, setDialogVisible] = useState(true);
  const openMenu = (property_id) => setActiveMenuPropertyId(property_id);
  const closeMenu = () => setActiveMenuPropertyId(null);

  // useEffect(()=>{
  //   console.log(dialogVisible);
  // }, [dialogVisible])
  return (
    <View>
      {/* <DialogTemplate
        visible={dialogVisible}
        setVisible={setDialogVisible}
        message={`delete ${property.property_name}`}
      /> */}
      <TouchableOpacity onPress={() => navigation.navigate("Rooms", { property })}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: propertyDefaultImage }} />
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text variant="titleLarge" style={styles.title}>
                {property.property_name}
              </Text>
              <Text variant="bodyMedium" style={{ fontStyle: "italic" }}>
                {property.property_address}
              </Text>
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
                  // setDialogVisible(true);
                }}
                title="Delete Property"
              />
            </Menu>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
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
    fontWeight: "700",
    color: "#5C5C5C",
  },
});

export default PropertyCard;
