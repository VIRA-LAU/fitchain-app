import AsyncStorage from "@react-native-async-storage/async-storage";
export const storeData = async (keys: any, values: any) => {
  try {
    for (let i = 0; i < keys.length; i++) {
      await AsyncStorage.setItem(keys[i], JSON.stringify(values[i]));
    }
  } catch (e) {
    // saving error
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};
