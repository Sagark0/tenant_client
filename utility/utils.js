export const getEmptyInitData = (formData) => {
    let initData = {};
    formData.forEach((field) => {
      initData[field.formTitle] = "";
    });
    return initData;
  };