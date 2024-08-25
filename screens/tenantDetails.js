import {  Text, View, ScrollView } from "react-native";
import { Button, Divider, Surface, Title } from "react-native-paper";
import { tenantEditFormData } from "../utility/formData/tenantFormData";
import { globalStyles } from "../styles/globalStyles";
import { tenantDetailsStyles } from "../styles/tenantDetailsStyles";
import { useState } from "react";
import { formatDate } from "../utility/utils";

const TenantDetails = ({ route }) => {
  const { tenant } = route.params;
  return (
    <ScrollView style={globalStyles.container}>
      <Surface style={tenantDetailsStyles.surface}>
        <Title style={tenantDetailsStyles.header}>Tenant Details</Title>
        <View style={tenantDetailsStyles.detailsContainer}>
          {tenantEditFormData.map((item) => (
            <View key={item.formTitle} style={tenantDetailsStyles.itemContainer}>
              <Text style={tenantDetailsStyles.titleText}>{item.formLabel}:</Text>
              <Text style={tenantDetailsStyles.dataText} selectable>
                {item.formType === "datepicker"
                  ? formatDate(tenant[item.formTitle])
                  : tenant[item.formTitle] || "Not Available"}
              </Text>
              <Divider style={tenantDetailsStyles.divider} />
            </View>
          ))}
        </View>
      </Surface>

    </ScrollView>
  );
};

export default TenantDetails;


