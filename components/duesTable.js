import { useState, useEffect } from "react";
import { DataTable } from "react-native-paper";
import { apiURL } from "../utility/constants";
import { formatDate } from "../utility/utils";
const DuesTable = ({ room_id }) => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
const [items, setItems] = useState([]); //storing dues data
  useEffect(() => {
    fetch(`${apiURL}/payments/dues/${room_id}`)
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
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Due Date</DataTable.Title>
        <DataTable.Title>Amount</DataTable.Title>
        <DataTable.Title>Remaining</DataTable.Title>
        <DataTable.Title numeric>Status</DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item) => (
        <DataTable.Row key={item.due_id}>
          <DataTable.Cell >{formatDate(item.due_date)}</DataTable.Cell>
          <DataTable.Cell>{item.due_amount}</DataTable.Cell>
          <DataTable.Cell>{item.payment_remaining}</DataTable.Cell>
          <DataTable.Cell numeric>{item.status}</DataTable.Cell>
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
  );
};

export default DuesTable;
