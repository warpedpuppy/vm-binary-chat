import React from 'react';
// importing Platform and KeyboardAvoidingView to the keyboard placement issue in Android
import { View, Text, Platform, KeyboardAvoidingView} from 'react-native';
// importing Gifted Chat Library
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

// the Chat component's render function displays the chat screen of the messaging app
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        // a normal message
        {
          _id: 1,
          text: 'Hello Developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        // a system message that appears before the actual(normal) messages.
        {
          _id: 2,
          text: 'You\'ve entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    // setState is called with previousState as the parameter -> reference to the component's
    // state at the time the change is applied.
    this.setState(previousState => ({
      // the append function by Gifted chat appends the new message to the message obj.
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
          user={{
            _id: 1,
          }}
        />
        {/* a conditional statement to add the Keyboard Avoiding View if the platform OS is Android */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}
