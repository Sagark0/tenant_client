import { createClient } from "@supabase/supabase-js";
import {
  accessToken,
  bucketName,
  screenWidth,
  supabaseKey,
  supabaseUrl,
} from "../utility/constants";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal } from "react-native-paper";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {decode} from 'base64-arraybuffer';
const supabase = createClient(supabaseUrl, supabaseKey);

const ImagePickerTemplate = () => {
  const [imageUri, setImageUri] = useState(null);
  const [fileName, setFileName] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4
    });
    if (!result.canceled) {
      console.log(result);
      setImageUri(result.assets[0].uri);
      const extension = result.assets[0].uri.split("/").pop().split(".").pop();
      console.log(extension);
      setFileName(`tenant_id(1).${extension}`);
    }
  };

  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required to take photos");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
    });
    if (!result.canceled) {
        console.log(result);
      setImageUri(result.assets[0].uri);
      const extension = result.assets[0].uri.split("/").pop().split(".").pop();
      console.log(extension);
      setFileName(`tenant_id(1).png`);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`documents/${fileName}`, decode(base64), {
          cacheControl: "3600",
          upsert: true,
          contentType: 'image/png'
        });

      if (error) throw error;

      console.log("Image uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSupabase = async (fileName, setImageUri) => {
    const { data, error } = await supabase.storage.from(bucketName).download(`documents/${fileName}`);
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () =>{
        setImageUri(fr.result);
    }
    console.log("supabase", data);
    console.log("error", error);
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Button icon="view-gallery" mode="outlined" onPress={pickImage}>
          Gallery
        </Button>
        <Button icon="camera" mode="outlined" onPress={captureImage}>
          Camera
        </Button>
        <Button onPress={handleSupabase}>Supabase</Button>
      </View>

      {imageUri && (
        <View>
          <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
          <Button onPress={uploadImage}>Upload Image</Button>
          <Button onPress={() => setImageUri(null)}>Remove</Button>
        </View>
      )}
    </View>
  );
};

export default ImagePickerTemplate;
