export const tenantEditFormData = [
    {
        formType: "text",
        formTitle: "tenant_id",
        formLabel: "ID",
        disabled: "true"
      },
      {
        formType: "text",
        formTitle: "tenant_name",
        formLabel: "Name",
      },
      {
        formType: "text",
        formTitle: "room_no",
        formLabel: "Room No",
        disabled: "true"
      },
      // {
      //   formType: "text",
      //   formTitle: "available_balance",
      //   formLabel: "Avail Balance(in Rs.)",
      // },
      {
        formType: "datepicker",
        formTitle: "move_in_date",
        formLabel: "Move In Date",
      },
      // {
      //   formType: "text",
      //   formTitle: "last_due_created_month",
      //   formLabel: "Last Due Created Month",
      // },
      {
        formType: "text",
        formTitle: "phone_no",
        formLabel: "Phone No",
      },
      {
        formType: "text",
        formTitle: "document_type",
        formLabel: "Document Type",
      },
      {
        formType: "text",
        formTitle: "document_number",
        formLabel: "Document Number",
      },
      {
        formType: "file",
        formTitle: "document_file_path",
        formLabel: "Upload Document"
      }

]

export const tenantAddFormData = [
  {
    formType: "text",
    formTitle: "tenant_name",
    formLabel: "Name",
  },
  {
    formType : "datepicker",
    formTitle: "move_in_date",
    formLabel : "Move In Date",
  },
  {
    formType: "text",
    formTitle: "phone_no",
    formLabel: "Phone No",
    keyboardType: "phone-pad"
  },
  {
    formType: "text",
    formTitle: "document_type",
    formLabel: "Document Type",
  },
  {
    formType: "text",
    formTitle: "document_no",
    formLabel: "Document Number",
    keyboardType: "numeric"
  },
  {
    formType: "file",
    formTitle: "document_file_path",
    formLabel: "Upload Document"
  }
]