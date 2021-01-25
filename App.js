import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  state = { 
    userName: '',
    userColor: '',
   };
  render() {
    return (
    <NavigationContainer>
      {/* setting the initial screen when app loads */}
      <Stack.Navigator
        initialRouteName="Start"
      >
        {/* the screens to be stacked to the app */}
        <Stack.Screen
          name="Start"
          component={Start}
          options = {{ headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  }
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
