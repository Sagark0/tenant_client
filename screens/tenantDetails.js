import { FlatList, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";
import { tenantEditFormData } from "../utility/formData/tenantFormData";
import { globalStyles } from "../styles/globalStyles";

const TenantDetails = ({ route }) => {
  const { tenant } = route.params;
  console.log("tenant details", tenant);
  return (
    <FlatList
      data={tenantEditFormData}
      keyExtractor={(item) => item.formTitle}
      renderItem={({ item }) => (
        <Surface style={globalStyles.container}>
          <Text style={styles.titleText}>{item.formLabel}:</Text>
          <Text style={styles.dataText} selectable>{tenant[item.formTitle] || "Not Available"}</Text>
        </Surface>
      )}
    />
  );
};

export default TenantDetails;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dataText: {
    fontSize: 16,
    marginTop: 5
  }
});
