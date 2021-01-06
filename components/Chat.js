import React from 'react';
// importing Platform and KeyboardAvoidingView to the keyboard placement issue in Android
import { View, Text, Platform, KeyboardAvoidingView} from 'react-native';
// importing Gifted Chat Library
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

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
        avatar: ''
      },
    };

    // connecting to the database
    const firebaseConfig = {
      apiKey: "AIzaSyDO4NwTi5KdslHcvz7oWIs4K7lnkkb2q2w",
      authDomain: "chat-app-cf.firebaseapp.com",
      projectId: "chat-app-cf",
      storageBucket: "chat-app-cf.appspot.com",
      messagingSenderId: "637701781406",
      appId: "1:637701781406:web:0185f85272ca90d521888f",
      measurementId: "G-Q69KD5XBYE"
    };

    if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }

    // creating a reference to the messages collection 
    this.referenceChatMessages = firebase.firestore().collection('messages');

  }

  componentDidMount() {
    // firebase.auth calls the firebase auth service for the app
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        user: {
            _id: user.uid,
            name: this.props.route.params.name,
            avatar: 'https://placeimg.com/140/140/any',
            createdAt: new Date()
        },
        // uid: user.uid,
        messages: [],
      });

      // calling the onSnapshot function to receive the updated data
      this.referenceChatMessages = firebase.firestore().collection('messages');
      this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    });

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

  render() {
    // accessing the user name
    let name  = this.props.route.params.name;
    let bgcolor = this.props.route.params.colorUser;
    // configuring the username to be display it at the top of the screen
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={{flex:1,  backgroundColor: bgcolor}}>
        {/* <Text>Hello!</Text> */}
        {/* using gifted chat library to implement the chat's functionality */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {/* a conditional statement to add the Keyboard Avoiding View if the platform OS is Android */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}
