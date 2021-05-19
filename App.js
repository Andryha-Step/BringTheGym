// App.js

import  React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import Login from './src/Login';
import Signup from './src/SignUp';
import Dashboard from './src/Dashboard';
import CustomerRegister from "./src/screens/CustomerRegister";
import SellerRegister from "./src/screens/TrainerRegister";


import ProfileScreen from "./src/screens/ProfileScreen";
import AddressScreen from "./src/screens/AddressScreen";



const Stack = createStackNavigator();

function MyStack({initialRouteName}) {
    console.log(initialRouteName)
  return (
      <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            headerShown: false,
          }}>
        {/*<Stack.Screen*/}
        {/*  name="Signup"*/}
        {/*  component={Signup}*/}
        {/*  options={({ navigation }) => ({*/}
        {/*    title: 'Awesome app',*/}
        {/*    headerLeft: () => (*/}
        {/*      <DrawerButton onPress={() => navigation.goBack()} />*/}
        {/*    ),*/}
        {/*  })}*/}
        {/*/>*/}
        <Stack.Screen
            name="Login"
            component={Login}
        />
        <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
        />
        <Stack.Screen
            name="Dashboard"
            component={Dashboard}
        />
        <Stack.Screen
            name="CustomerRegister"
            component={CustomerRegister}
        />

        <Stack.Screen
            name="TrainerRegister"
            component={SellerRegister}
        />
          <Stack.Screen
              name="AddressScreen"
              component={AddressScreen}
          />


      </Stack.Navigator>
  );
}

export default function App() {
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [initialRouteName, setInitialRouteName] = useState('None')
    useEffect(() => {
        setActiveUser()
    }, [])

   const  setActiveUser = async (denied) => {
        const token = await AsyncStorage.getItem('token');
        console.log(token, 'token')
       if(token === null) {
           setInitialRouteName('Dashboard')
       } else {
           token  ? setUserLoggedIn(true) : setUserLoggedIn(false)
           token  ? setInitialRouteName('ProfileScreen') : setUserLoggedIn('Dashboard')
       }

    }
    if (initialRouteName === 'None') return null
  return (
      <NavigationContainer>
        <MyStack initialRouteName={initialRouteName} />
      </NavigationContainer>
  );
}
