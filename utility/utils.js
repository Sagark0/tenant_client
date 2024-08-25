import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      return true;  // Dues were generated within the last 12 hours
    }
  }
  return false;  // Dues were not generated or more than 12 hours have passed
};

