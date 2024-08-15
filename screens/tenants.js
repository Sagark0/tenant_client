import { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Avatar, Menu, List } from "react-native-paper";
import { apiURL } from "../utility/constants";
import ModalTemplate from "../components/modal"; // Ensure this path is correct
import { tenantEditFormData } from "../utility/formData/tenantFormData";

const Tenants = ({ route, navigation }) => {
  const { property, room } = route.params;
  const [tenants, setTenants] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null); // Track the tenant being edited
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility

  const openMenu = (tenant) => {
    setSelectedTenant(tenant);
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

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
      setTenants((prev) => prev.map((tenant) => (tenant.tenant_id === data.tenant_id ? { ...tenant, ...data} : tenant)));
      setModalVisible(false);
    }).catch(err => {
      console.log("Error udpating Tenant",err);
    });
  };

  // API to delete tenant
  const handleTenantDelete = (id) => {
    fetch(`${apiURL}/tenants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
    <View>
      <List.Section>
        <List.Subheader>Room No. {room.room_no}</List.Subheader>
        <FlatList
          data={tenants}
          keyExtractor={(item) => item.tenant_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { navigation.navigate("Tenant Details", { tenant: item })}}>
              <List.Item
                title={`${item.tenant_name}`}
                description={`Tenant ID: ${item.tenant_id} `}
                style={{ backgroundColor: "#fff" }}
                left={() => <Avatar.Text size={40} style={{ marginLeft: 18 }} label={item.tenant_name[0]} />}
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
                        handleTenantDelete(item.tenant_id)
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
