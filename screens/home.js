import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { apiURL } from "../utility/constants";
import { globalStyles } from "../styles/globalStyles";
import PropertyCard from "../components/propertyCard";
import SnackView from "../components/snackbar";
import { ActivityIndicator, Button } from "react-native-paper";
import { propertyAddFormData } from "../utility/formData/propertyFormData";
import ModalTemplate from "../components/modal";
import { getEmptyInitData } from "../utility/utils";

export default function Home({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [addPropertyModalVisible, setAddPropertyModalVisible] = useState(false);

  // get property data
  useEffect(() => {
    fetch(`${apiURL}/properties`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        setProperties(data);
      })
      .catch((err) => {
        console.log("Error:", err.message || err);
        setSnackbarMessage("An error occurred while fetching properties");
        setSnackbarVisible(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddPropertySubmit = (values) => {
    console.log(values);
    fetch(`${apiURL}/properties`, {
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
        setProperties((prev) => [...prev, data]);
        setSnackbarMessage("Property Added Successfully");
        setAddPropertyModalVisible(false);
      })
      .catch((err) => {
        console.log("Failed to add property", err);
        setAddPropertyModalVisible(false);
        setSnackbarMessage("An error occured while creating property");
      })
      .finally(() => setSnackbarVisible(true));
  };

  return (
    <View style={globalStyles.container}>
      <ModalTemplate
        title="Add Property Details"
        initData={getEmptyInitData(propertyAddFormData)}
        modalVisible={addPropertyModalVisible}
        setModalVisible={setAddPropertyModalVisible}
        formData={propertyAddFormData}
        handleSubmit={handleAddPropertySubmit}
      />
      <Button
        icon="plus"
        style={{ marginBottom: 4 }}
        onPress={() => setAddPropertyModalVisible(true)}
      >
        Add Property
      </Button>
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.property_id.toString()}
          renderItem={({ item }) => (
            <PropertyCard navigation={navigation} property={item} setProperties={setProperties} />
          )}
        />
      )}

      <SnackView
        visible={snackbarVisible}
        setVisible={setSnackbarVisible}
        message={snackbarMessage}
      />
    </View>
  );
}
