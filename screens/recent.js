import { useState } from "react";
import { ActivityIndicator, Button, DataTable, Surface } from "react-native-paper";
import { useEffect } from "react";
import { apiURL } from "../utility/constants";
import { formatDate } from "../utility/utils";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnackView from "../components/snackbar";
import moment from "moment";

const RecentsRoute = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 4, 6]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[1]);
  const [items, setItems] = useState([]); //storing dues data
  const [lastDuesChecked, setLastDueChecked] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  // check last dues checked
  const fetchLastGenerated = async () => {
    const lastGenerated = await AsyncStorage.getItem("last_due_generated_time");
    if (lastGenerated) {
      setLastDueChecked(lastGenerated);
    } else {
      setLastDueChecked("Never");
    }
  };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  const handleRunNewDuesCheck = () => {
    setIsLoading(true);
    fetch(`${apiURL}/payments/generateDues`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not OK");
        }
        AsyncStorage.setItem("last_due_generated_time", moment().toISOString());
        console.log("Dues generated successfully");
        setSnackbarMessage("Dues checked successfully")
      })
      .catch((err) => {
        console.log("Error while generating dues:", err.message || err);
        setSnackbarMessage("Error while generating dues")
      })
      .finally(() => {
        setIsLoading(false);
        fetchLastGenerated();
        setSnackbarVisible(true);
      });
  };

  return (
    <View>
      <SnackView
        visible={snackbarVisible}
        setVisible={setSnackbarVisible}
        message={snackbarMessage}
      />
      {/* All Dues */}
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text>All Dues</Text>
          {isLoading ? (
            <ActivityIndicator animating={true} style={{ marginRight: 30 }} />
          ) : (
            <Button onPress={handleRunNewDuesCheck}>Run new dues check</Button>
          )}
        </View>
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
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <Text>Last Due Checked: {lastDuesChecked} </Text>
        {!lastDuesChecked && <Button onPress={fetchLastGenerated}>Check</Button>}
      </View>
      {/* Recent Payments */}
    </View>
  );
};

export default RecentsRoute;
