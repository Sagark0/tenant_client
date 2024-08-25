import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

const SnackView = ({ visible, setVisible, message }) => {
  const onDismissSnackBar = () => setVisible(false);

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Close',
        onPress: () => {
          // Do something
        },
      }}
      style={styles.snackbar} // Added styles for positioning
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SnackView;
