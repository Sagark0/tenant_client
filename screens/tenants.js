import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  Avatar,
  Button,
  Menu,
  List,
  Surface,
  Title,
  IconButton,
  Divider,
} from "react-native-paper";
import { apiURL, propertyDefaultImage } from "../utility/constants";
import ModalTemplate from "../components/modal"; // Ensure this path is correct
import { tenantEditFormData } from "../utility/formData/tenantFormData";
import SnackView from "../components/snackbar";
import AddTenantModal from "../components/addTenantModal";
import PaymentModal from "../components/paymentModal";
import DuesTable from "../components/duesTable";
import { tenantDetailsStyles } from "../styles/tenantDetailsStyles";
import { tenantAddFormData } from "../utility/formData/tenantFormData";
import { capitaliseWords, formatDate, getEmptyInitData, handleWhatsAppMessage } from "../utility/utils";
import { globalStyles } from "../styles/globalStyles";
import { roomUpdateFormData } from "../utility/formData/roomFormData";
import { uploadImage } from "../utility/imageUpload";

const Tenants = ({ route, navigation }) => {
  const { property } = route.params;
  const [room, setRoom] = useState(route.params.room);
  const [tenants, setTenants] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null); // Track the tenant being edited
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addTenantModalVisible, setAddTenantModalVisible] = useState(false);
  const [updateRoomModalVisible, setUpdateRoomModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);
  const [dues, setDues] = useState([]);
  const [totalDues, setTotalDues] = useState();
  const headerMenuOpen = () => setHeaderMenuVisible(true);
  const headerMenuClose = () => setHeaderMenuVisible(false);

  const openMenu = (tenant) => {
    tenant["room_no"] = room.room_no;
    var modTenant = {...tenant};
    modTenant["document_file_path"] = null
    modTenant["document_file_path"] = { fileName: tenant.document_file_path, uri: null };
    setSelectedTenant(modTenant);
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  // fetch Dues function
  const fetchDues = () => {
    fetch(`${apiURL}/payments/dues/${room.room_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        const totalDues = data.reduce((sum, item) => {
          return sum + parseFloat(item.payment_remaining);
        }, 0);
        setTotalDues(totalDues);
        setDues(data);
      })
      .catch((err) => {
        console.log("Error fetching dues:", err);
      });
  };

  // useEffect to fetch Dues
  useEffect(() => {
    fetchDues();
  }, []);

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
  const handleAddTenantSubmit = async (values) => {
    values["tenant_name"] = capitaliseWords(values["tenant_name"]);
    values["last_due_created_month"] = values["move_in_date"];
    values["room_id"] = room.room_id;
    if (values.phone_no && !values["phone_no"].startsWith("+91")) {
      values["phone_no"] = "+91" + values["phone_no"];
    }
    if (values.document_file_path?.uri) {
      const { uri, fileName } = values.document_file_path;
      await uploadImage(uri, fileName);
      console.log("fileName", fileName);
    }
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
        setTenants((prev) => [...prev, data]);
        setSnackbarMessage("Tenant added to the room successfully");
      })
      .catch((err) => {
        console.log("Failed to add tenant", err);
        setSnackbarMessage("Failed to add new tenant");
      })
      .finally(() => {
        setAddTenantModalVisible(false);
        setSnackbarVisible(true);
      });
  };

  // api to edit tenant details
  const handleEditTenant = async (values) => {
    values["tenant_name"] = capitaliseWords(values["tenant_name"]);
    values["room_id"] = room.room_id;
    if (values.phone_no && !values["phone_no"].startsWith("+91")) {
      values["phone_no"] = "+91" + values["phone_no"];
    }
    if (values.document_file_path?.uri) {
      const { uri, fileName } = values.document_file_path;
      await uploadImage(uri, fileName);
      console.log("fileName", fileName);
    }
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
        console.log("Error updating Tenant", err);
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
      body: JSON.stringify({ room_id: room.room_id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        } else {
          setTenants((prev) => prev.filter((tenant) => tenant.tenant_id !== id));
          console.log(`Tenant deleted successfully`);
          setSnackbarMessage("Tenant Deleted Successfully");
        }
      })
      .catch((err) => {
        console.log("Error deleting tenant:", err);
        setSnackbarMessage("Error while deleting tenant");
      })
      .finally(() => {
        setSnackbarVisible(true);
      });
  };

  const handleRoomUpdateSubmit = (values) => {
    console.log("room details", values);
    fetch(`${apiURL}/rooms/${room.room_id}`, {
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
        console.log("Room data updated successfully", data);
        setRoom(data);
        setSnackbarMessage("Room updated Successfully");
      })
      .catch((err) => {
        console.log("Error updating room:", err);
        setSnackbarMessage("Error updating room details");
      })
      .finally(() => {
        setUpdateRoomModalVisible(false);
        setSnackbarVisible(true);
      });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <ModalTemplate
        title="Update Room Details"
        initData={room}
        modalVisible={updateRoomModalVisible}
        setModalVisible={setUpdateRoomModalVisible}
        formData={roomUpdateFormData}
        handleSubmit={handleRoomUpdateSubmit}
      />
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
      <View style={globalStyles.headerContainer}>
        <ImageBackground
          source={{ uri: propertyDefaultImage }}
          style={globalStyles.imageBackground}
        >
          <View style={globalStyles.overlay} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={globalStyles.h2}>Room No. {room.room_no}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={globalStyles.h2}>{property.property_name}</Text>
              <Menu
                visible={headerMenuVisible}
                onDismiss={headerMenuClose}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    iconColor="white"
                    size={24}
                    onPress={headerMenuOpen}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setUpdateRoomModalVisible(true);
                  }}
                  title="Update Room"
                />
              </Menu>
            </View>
          </View>
          <Divider style={{ marginBottom: 15, marginRight: 20 }} />
          {tenants.length != 0 && (
            <View>
              <Text style={globalStyles.h4}>Security Deposit: Rs. {room.security_deposit}</Text>
              <Text style={globalStyles.h4}>Available Balance: Rs. {room.available_balance}</Text>
              <Text style={globalStyles.h4}>
                Last Electricity Reading:{" "}
                {room.electricity_reading ? `${room.electricity_reading} Unit` : "Not Added"}
              </Text>
              <Text style={globalStyles.h4}>Move In Date: {formatDate(room.move_in_date)}</Text>
              <Text style={globalStyles.h4}>
                Last Due Created: {formatDate(room.last_due_created_month)}
              </Text>
            </View>
          )}
        </ImageBackground>
      </View>

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
          <Text>Total Dues: {totalDues}</Text>
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
          tenants.map((item) => (
            <TouchableOpacity
              key={item.tenant_id}
              onPress={() => {
                navigation.navigate("Tenant Details", { tenant: item, room_no: room.room_no });
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
                      <TouchableOpacity onPress={() => openMenu(item)}  style={{  paddingTop: 7, paddingLeft: 20}}>
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
                      title="Delete Tenant"
                    />
                    <Menu.Item
                      onPress={() => {
                        handleWhatsAppMessage(item.tenant_name, item.phone_no, totalDues);
                      }}
                      title="Remind On Whatsapp"
                    />
                  </Menu>
                )}
              />
            </TouchableOpacity>
          ))
        )}
      </List.Section>
      {tenants.length != 0 && (
        <Surface style={tenantDetailsStyles.surface} elevation={0}>
          <PaymentModal
            modalVisible={paymentModalVisible}
            setModalVisible={setPaymentModalVisible}
            room_id={room.room_id}
            electricity_reading={room.electricity_reading}
            totalDues={totalDues}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarVisible={setSnackbarVisible}
            fetchDues={fetchDues}
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
          <DuesTable items={dues} />
        </Surface>
      )}
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
    </ScrollView>
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
