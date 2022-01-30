import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Image from "react-native-scalable-image";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
import { AntDesign } from "../node_modules/@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { firebaseconfigkeys } from "../Data/FirebaseConfig";
const firebaseConfig = firebaseconfigkeys;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default function HomeScreen() {
  const [Loading, setLoading] = useState(true);
  const [Arr, setArr] = useState([]);
  const navigation = useNavigation();

  async function GetData() {
    try {
      const myitems = firebase.database().ref("Data");
      myitems.on("value", (datasnap) => {
        setArr(Object.values(datasnap.val()));

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function ChooseImg() {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
    }).then(async (res) => {
      if (!res.uri) return false;

      navigation.navigate("UploadNews", { ImgSrc: res.uri, blob: res.base64 });
    });
  }

  useEffect(() => {
    GetData();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {Loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={30} animating color={"#BB5EF5"} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={Arr}
            renderItem={({ item }) => (
              <>
                <View style={[Styles.card, Styles.elevation]}>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      width={300}
                      source={{
                        uri: item.Imageurl,
                      }}
                    />
                  </View>
                  <Text style={Styles.TitleTextStyle}>{item.title}</Text>
                </View>
              </>
            )}
          />
        </View>
      )}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={ChooseImg} style={Styles.UploadButtonStyle}>
          <AntDesign size={30} name="upload" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const Styles = StyleSheet.create({
  UploadButtonStyle: {
    padding: 20,
    backgroundColor: "#BB5EF5",
    alignItems: "center",
    borderRadius: 80,
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    left: Dimensions.get("window").width * 0.75,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 13,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: "90%",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  elevation: {
    elevation: 20,
    shadowColor: "#52006A",
  },
  TitleTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 6,
  },
});
