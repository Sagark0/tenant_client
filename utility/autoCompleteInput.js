import { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

const AutocompleteInput = ({ label, value, onChange, options=[] }) => {
  const [query, setQuery] = useState(value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
  console.log("Filtered", filteredOptions)
  return (
    <View>
      <Text>{label}</Text>
      <Autocomplete
        data={filteredOptions}
        defaultValue={query}
        onChangeText={(text) => {
          setQuery(text);
          onChange(text);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setQuery(item.label);
              onChange(item.value);
            }}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AutocompleteInput;
