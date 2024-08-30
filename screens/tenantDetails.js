import { View, ScrollView, Image } from "react-native";
import { Avatar, Button, Divider, Icon, IconButton, Surface, Text } from "react-native-paper";
import { globalStyles } from "../styles/globalStyles";
import { tenantDetailsStyles } from "../styles/tenantDetailsStyles";
import { useState } from "react";
import { formatDate, handleCall, handleWhatsAppMessage } from "../utility/utils";
import { fetchImage } from "../utility/imageUpload";

const TenantDetails = ({ route }) => {
  const { tenant, room_no } = route.params;
  const [imageUri, setImageUri] = useState(null);
  console.log(tenant);
  const avatarLabel = tenant.tenant_name
    .split(" ")
    .reduce((chars, word) => (chars += word[0][0]), "");
  return (
    <ScrollView style={globalStyles.container}>
      <Surface style={tenantDetailsStyles.surface}>
        <View style={{ alignItems: "center" }}>
          <Avatar.Text size={50} label={avatarLabel} />
          <Text variant="headlineSmall">{tenant.tenant_name}</Text>
          <Text>{`ID - ${tenant.tenant_id} | Room - ${room_no}`} </Text>
        </View>
        <Divider style={{ marginVertical: 10 }} />
        <Text>Move In Date: {formatDate(tenant.move_in_date)}</Text>

        {/* Phone No */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon source="camera" size={40} />
          <View style={{justifyContent: 'center'}}>
            <Text variant="titleMedium" style={{marginTop: 10, marginLeft: 10}}>Phone No </Text>
            {tenant.phone_no ? <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View><Text>{tenant.phone_no}</Text></View>
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="phone"
                  iconColor="blue"
                  size={20}
                  onPress={() => handleCall(tenant.phone_no)}
                />
                <IconButton
                  icon="whatsapp"
                  iconColor="green"
                  size={20}
                  onPress={() => handleWhatsAppMessage(tenant.phone_no)}
                />
              </View>
            </View> : <Text>Not Available</Text>}
          </View>
        </View>

        <Text>Document: {tenant.document_file_path || "Not Available"}</Text>
        {tenant.document_file_path && (
          <Button onPress={() => fetchImage(tenant.document_file_path, setImageUri)}>
            Preview
          </Button>
        )}
        {imageUri && (
          <View>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
            <Button>Download</Button>
          </View>
        )}
      </Surface>
    </ScrollView>
  );
};

export default TenantDetails;
