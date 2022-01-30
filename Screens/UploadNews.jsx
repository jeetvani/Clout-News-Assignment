import React, { useState } from "react";
import {
  View,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import uniqid from "uniqid";
import firebase from "firebase";

import { useNavigation } from "@react-navigation/native";
import { firebaseconfigkeys } from "../Data/FirebaseConfig";
const firebaseConfig = firebaseconfigkeys;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default function UploadNews({ route }) {
  const navigation = useNavigation();
  const [title, settitle] = useState("");
  const ImgSrc = route.params.ImgSrc;
  const [loading, setloading] = useState(false);

  async function Upload() {
    setloading(true);
    let randomId = uniqid();

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request Failed "));
      };
      xhr.responseType = "blob";
      xhr.open("GET", ImgSrc, true);
      xhr.send(null);
    });
    const ref = firebase.storage().ref().child(randomId);
    const snapshot = ref.put(blob);
    snapshot
      .then(async (res) => {
        snapshot.snapshot.ref.getDownloadURL().then(async (ImageUrl) => {
          console.log(ImageUrl);

          await firebase
            .database()
            .ref("Data")
            .push()
            .set({
              id: randomId,
              title: title,
              Imageurl: ImageUrl,
            })
            .then((res) => {
              console.log(res);
              setloading(false);

              alert("Your news has been published successfully !!");
              navigation.navigate("HomeScreen");
            });
        });
      })
      .catch((err) => {
        alert(err);
        setloading(false);
      });
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={30} animating color={"#BB5EF5"} />
          <Text style={{ textAlign: "center", padding: 12, fontSize: 16 }}>
            Please wait as it may take some time....
          </Text>
        </View>
      ) : (
        <>
          <View style={{ alignItems: "center", margin: 20 }}>
            <Image source={{ uri: ImgSrc }} style={Styles.ImgStyle} />
          </View>
          <View style={{ alignItems: "center" }}>
            <TextInput
              onChangeText={(text) => {
                settitle(text);
              }}
              value={title}
              placeholder="Write the title Here..."
              multiline
              style={Styles.TextInputStyle}
            />
          </View>
          <View>
            <TouchableOpacity onPress={Upload}>
              <Text style={Styles.UploadBtnStyle}>Upload News</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
const Styles = StyleSheet.create({
  TextInputStyle: {
    width: Dimensions.get("window").width * 0.7,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
  },
  ImgStyle: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
  },
  UploadBtnStyle: {
    textAlign: "center",
    padding: 15,
    margin: 10,
    backgroundColor: "#BB5EF5",
    color: "white",
    fontWeight: "bold",
  },
});
