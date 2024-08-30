import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

export const getEmptyInitData = (formData) => {
  let initData = {};
  formData.forEach((field) => {
    if (field.formType === "datepicker") {
      initData[field.formTitle] = new Date();
    } else {
      initData[field.formTitle] = "";
    }
  });
  return initData;
};

export const formatDate = (date) => {
  return moment(date).format("DD-MM-YYYY");
};

export const checkLastDueGenerated = async () => {
  const lastGenerated = await AsyncStorage.getItem("last_due_generated_time");
  console.log("last generated", lastGenerated);
  const now = moment();

  if (lastGenerated) {
    const lastGeneratedTime = moment(lastGenerated);

    // Check if more than 12 hours have passed
    if (now.diff(lastGeneratedTime, "hours") <= 12) {
      return true; // Dues were generated within the last 12 hours
    }
  }
  return false; // Dues were not generated or more than 12 hours have passed
};

export const handleCall = (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url).catch((err) => console.error("Error occurred while trying to call:", err));
};

export const handleWhatsAppMessage = (name, phoneNumber, amount) => {
  var url;
  if (amount) {
    const message = `Hi ${name}, \nYour due amount is ${amount}. \nKindly pay the dues. \n\nAccount Details: \nCurrent A/c No- 315202000000504 \nIFSC- IOBA0003152`;
    const imageUrl = encodeURIComponent("");
    url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
  } else {
    url = `whatsapp://send?phone=${phoneNumber}`;
  }
  Linking.openURL(url).catch(() => {
    alert("Make sure WhatsApp is installed on your device.");
  });
};

export const capitaliseWords = (str) => {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}