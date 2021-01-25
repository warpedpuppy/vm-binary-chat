import React from 'react';
// importing Platform and KeyboardAvoidingView to the keyboard placement issue in Android
import { View, Text, Platform, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// to determine if the user is on- or offline
import NetInfo from '@react-native-community/netinfo';
// importing Gifted Chat Library
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { NavigationEvents } from 'react-navigation';
// to display the location data in a map
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

// importing and establishing a connection to Firestore
const firebase = require('firebase');
require('firebase/firestore');

// the Chat component's render function displays the chat screen of the messaging app
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
        createdAt: ''
      },
      uid: '',
      isConnected: false,
      image: null,
      location: null,
    };

    // connecting to the database
    //changed to mine
    const firebaseConfig = {
      apiKey: "AIzaSyBQ0l3BqF5b5UczVr6U4q4g2nUWoBSQ1zc",
      authDomain: "test-183b4.firebaseapp.com",
      projectId: "test-183b4",
      storageBucket: "test-183b4.appspot.com",
      messagingSenderId: "820936259648",
      appId: "1:820936259648:web:10f56afb9569c1236a07a5",
      measurementId: "G-CHMTEGV545"
    };

    if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }

    // creating a reference to the messages collection 
    this.referenceChatMessages = firebase.firestore().collection('messages');

  }

  getMessages = async() => {
    let messages = [];
    try{
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async() => {
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }


  deleteMessages = async() => {
    try{
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }


  componentDidMount() {
    
    // using NetInfo to determine if the user is on- or offline
    // this function will specify if data should be fetched from asyncStorage or Firestore.
    NetInfo.fetch().then((state) => {
      if(state.isConnected) {
        console.log('online');
        // firebase.auth calls the firebase auth service for the app
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          else {
            this.setState({
              isConnected: true,
              uid: user.uid,
              messages: [],
            });
            this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate); 
          }
        });       
      } else {
        console.log('offline');
        this.getMessages();
        this.setState({
          isConnected: false,
        });            
      }
    });
      
    // calling the onSnapshot function to receive the updated data
    this.referenceChatMessages = firebase.firestore().collection('messages');
    
  }

  componentWillUnmount() {
    // calling unsubscribe to stop receiving updates from a collection
    this.unsubscribe();
    // stop listening to authentication
    this.authUnsubscribe();
  }

  onSend(messages = []) {
    // setState is called with previousState as the parameter -> reference to the component's
    // state at the time the change is applied.
    this.setState(previousState => ({
      // the append function by Gifted chat appends the new message to the message obj.
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }


  renderBubble(props) {
    return (
      <Bubble 
        {...props}
        wrapperStyle={{
          // changing the background color of the message bubble on the right side.
          right: {
            backgroundColor: '#000',
          }
        }}
      />
    );
  }

  // to render the input bar only when the user is online
  renderInputToolbar(props) {
    if(this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props} 
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions { ...props} />;
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if(currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // accessing the user name
    console.log(this.props.route.params)
    let name  = this.props.route.params.name;
    let bgcolor = this.props.route.params.colorUser;
    // configuring the username to be display it at the top of the screen
    this.props.navigation.setOptions({ title: name, bgcolor });
    return (
      <View style={{flex:1}}>
        {/* <Text>Hello!</Text> */}
        {/* using gifted chat library to implement the chat's functionality */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        {/* a conditional statement to add the Keyboard Avoiding View if the platform OS is Android */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}

