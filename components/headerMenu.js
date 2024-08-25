import { useState } from "react";
import { View } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { apiURL } from "../utility/constants";
const HeaderMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View>

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        style={{ marginTop: 40 }}
        anchor={<IconButton icon="dots-vertical" color="white" onPress={openMenu} />}
      >
        <Menu.Item
          onPress={() => {
            setAddTenantModalVisible(true);
            closeMenu();
          }}
          title="New Tenant"
        />
      </Menu>
    </View>
  );
};

export default HeaderMenu;
