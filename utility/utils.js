import moment from "moment";

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
} 