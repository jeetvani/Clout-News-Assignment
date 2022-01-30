import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {StatusBar} from 'react-native'
import HomeScreen from "./Screens/HomeScreen";
import UploadNews from "./Screens/UploadNews";
import { NavigationContainer } from "@react-navigation/native";
export default function App() {
  const Stack = createStackNavigator();
  return (
    <>
    <StatusBar backgroundColor={'black'} barStyle="light-content"/>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false,cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="UploadNews" component={UploadNews} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
    
  );
}
