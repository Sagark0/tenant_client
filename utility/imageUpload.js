import { createClient } from "@supabase/supabase-js";
import { accessToken, bucketName, supabaseKey, supabaseUrl } from "../utility/constants";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
const supabase = createClient(supabaseUrl, supabaseKey);
import * as ImageManipulator from "expo-image-manipulator";

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    // aspect: [4, 3],
    quality: 0.4,
  });
  if (!result.canceled) {
    const compressedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 200 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
    );
    const fileName = `image_${Date.now()}.png`;
    const uri = compressedImage.uri;
    return { uri, fileName };
  }
  return { uri: null, fileName: null };
};

export const captureImage = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Camera permission is required to take photos");
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    // aspect: [4, 3],
    quality: 0.4,
  });
  if (!result.canceled) {
    const compressedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 200 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
    );
    const fileName = `image_${Date.now()}.png`;
    const uri = compressedImage.uri;
    return { uri, fileName };
  }
  return { uri: null, fileName: null };
};

export const uploadImage = async (imageUri, fileName) => {
  if (!imageUri) return;
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: "base64" });
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`documents/${fileName}`, decode(base64), {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/png",
      });
    if (error) throw error;
    console.log("Image uploaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const deleteImage = async (fileName) => {
  console.log("Delete file", fileName);
  return ({ data, error } = await supabase.storage
    .from(bucketName)
    .remove([`documents/${fileName}`]));
};

export const fetchImage = async (fileName, setImageUri) => {
  const { data, error } = await supabase.storage.from(bucketName).download(`documents/${fileName}`);
  const fr = new FileReader();
  fr.readAsDataURL(data);
  fr.onload = () => {
    setImageUri(fr.result);
  };
  console.log("supabase", data);
  console.log("error", error);
  return data
};

export const downloadImage = async (fileName, data) => {
    const localUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(localUri, await data.text(), {
        encoding: FileSystem.EncodingType.Base64,
      });
}