import { useState } from "react";
import { DataTable, Surface } from "react-native-paper";
import { useEffect } from "react";
import { apiURL } from "../utility/constants";
import { formatDate } from "../utility/utils";
import { View, Text } from "react-native";

const RecentsRoute = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 4, 6]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [items, setItems] = useState([]); //storing dues data

  useEffect(() => {
    fetch(`${apiURL}/payments/dues`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        setItems(data);
      })
      .catch((err) => {
        console.log("Error fetching dues:", err);
      });
  }, []);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  return (
    <View>

    {/* All Dues */}
      <View
        style={{
          marginHorizontal: 10,
          marginVertical:20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>All Dues</Text>
      </View>
      <Surface>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Property Name</DataTable.Title>
            <DataTable.Title>Room No</DataTable.Title>
            <DataTable.Title>Due Date</DataTable.Title>
            <DataTable.Title>Remaining</DataTable.Title>
          </DataTable.Header>

          {items.slice(from, to).map((item) => (
            <DataTable.Row key={item.due_id}>
              <DataTable.Cell>{item.property_name}</DataTable.Cell>
              <DataTable.Cell>{item.room_no}</DataTable.Cell>
              <DataTable.Cell>{formatDate(item.due_date)}</DataTable.Cell>
              <DataTable.Cell>{item.payment_remaining}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(items.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${items.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
          />
        </DataTable>
      </Surface>

      {/* Recent Payments */}
      
    </View>
  );
};

export default RecentsRoute;
