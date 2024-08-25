import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Avatar, Button, Menu, List, Surface, Title } from "react-native-paper";
import { apiURL } from "../utility/constants";
import ModalTemplate from "../components/modal"; // Ensure this path is correct
import { tenantEditFormData } from "../utility/formData/tenantFormData";
import SnackView from "../components/snackbar";
import AddTenantModal from "../components/addTenantModal";
import PaymentModal from "../components/paymentModal";
import DuesTable from "../components/duesTable";
import { tenantDetailsStyles } from "../styles/tenantDetailsStyles";
import { tenantAddFormData } from "../utility/formData/tenantFormData";
import { getEmptyInitData } from "../utility/utils";

const Tenants = ({ route, navigation }) => {
  const { property, room } = route.params;
  const [tenants, setTenants] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null); // Track the tenant being edited
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addTenantModalVisible, setAddTenantModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const openMenu = (tenant) => {
    setSelectedTenant(tenant);
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  // fetch tenants with room id
  useEffect(() => {
    fetch(`${apiURL}/tenants?room_id=${room.room_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setTenants(data);
      });
  }, [room.room_id]);

  // api to handle tenant submit
  const handleAddTenantSubmit = (values) => {
    values["last_due_created_month"] = values["move_in_date"];
    values["room_id"] = room.room_id;
    console.log("tenant details", values);
    fetch(`${apiURL}/tenants`, {
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
        setTenants(prev => [...prev, data]);
        setSnackbarMessage("Tenant added to the room successfully");
      })
      .catch((err) => {
        console.log("Failed to add tenant", err);
        setSnackbarMessage("Failed to add new tenant")
      })
      .finally(() => {
        setAddTenantModalVisible(false);
        setSnackbarVisible(true);
      });
  };

  // api to edit tenant details
  const handleEditTenant = (values) => {
    console.log("Updated tenant details:", values);
    fetch(`${apiURL}/tenants/${values.tenant_id}`, {
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
        setTenants((prev) =>
          prev.map((tenant) =>
            tenant.tenant_id === data.tenant_id ? { ...tenant, ...data } : tenant
          )
        );
        setSnackbarMessage(`Tenant updated successfully`);
        setModalVisible(false);
      })
      .catch((err) => {
        console.log("Error udpating Tenant", err);
        setSnackbarMessage("Error occured while editing tenant");
      })
      .finally(() => {
        setSnackbarVisible(true);
      });
  };

  // API to delete tenant
  const handleTenantDelete = (id) => {
    fetch(`${apiURL}/tenants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({room_id: room.room_id})
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        } else {
          setTenants((prev) => prev.filter((tenant) => tenant.tenant_id !== id));
          console.log(`Tenant deleted successfully`);
        }
      })
      .catch((err) => {
        console.log("Error deleting room:", err);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <AddTenantModal
        modalVisible={addTenantModalVisible}
        setModalVisible={setAddTenantModalVisible}
        room={room}
        setTenants={setTenants}
      /> */}
      <ModalTemplate
        title="Add New Tenant"
        initData={getEmptyInitData(tenantAddFormData)}
        modalVisible={addTenantModalVisible}
        setModalVisible={setAddTenantModalVisible}
        formData={tenantAddFormData}
        handleSubmit={handleAddTenantSubmit}
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
          <Text>Room No. {room.room_no}</Text>
          <Button
            icon="plus"
            style={{ marginTop: 4 }}
            onPress={() => setAddTenantModalVisible(true)}
          >
            Add Tenant
          </Button>
        </View>
        {tenants.length === 0 ? (
          <Text style={{ textAlign: "center" }}> Room has 0 tenant. </Text>
        ) : (
          <FlatList
            data={tenants}
            keyExtractor={(item) => item.tenant_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Tenant Details", { tenant: item });
                }}
              >
                <List.Item
                  title={`${item.tenant_name}`}
                  description={`Tenant ID: ${item.tenant_id} `}
                  style={{ backgroundColor: "#fff" }}
                  left={() => (
                    <Avatar.Text size={40} style={{ marginLeft: 18 }} label={item.tenant_name[0]} />
                  )}
                  right={() => (
                    <Menu
                      visible={visible && selectedTenant?.tenant_id === item.tenant_id}
                      onDismiss={closeMenu}
                      anchor={
                        <TouchableOpacity onPress={() => openMenu(item)}>
                          <List.Icon icon="dots-vertical" />
                        </TouchableOpacity>
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          closeMenu();
                          setModalVisible(true); // Open the modal
                        }}
                        title="Edit Tenant"
                      />
                      <Menu.Item
                        onPress={() => {
                          closeMenu();
                          handleTenantDelete(item.tenant_id);
                        }}
                        title="Delete"
                      />
                    </Menu>
                  )}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </List.Section>
      {tenants.length != 0 && <Surface style={tenantDetailsStyles.surface} elevation={0}>
        <PaymentModal
          modalVisible={paymentModalVisible}
          setModalVisible={setPaymentModalVisible}
          room_id={room.room_id}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Title style={tenantDetailsStyles.header}>Payment Dues</Title>
          <Button
            icon="plus-circle"
            mode="outlined"
            style={styles.button}
            onPress={() => setPaymentModalVisible(true)}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Add Payment
          </Button>
        </View>
        <DuesTable room_id={room.room_id} />
      </Surface>}
      {/* Modal for Editing Tenant Details */}
      {selectedTenant && (
        <ModalTemplate
          title={`Edit Tenant: ${selectedTenant.tenant_name}`}
          initData={selectedTenant}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          formData={tenantEditFormData}
          handleSubmit={handleEditTenant}
        />
      )}
    </View>
  );
};

export default Tenants;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
  },
  button: {
    borderRadius: 25,
    paddingVertical: 1,
    paddingHorizontal: 15,
  },
  buttonContent: {
    flexDirection: "row",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
