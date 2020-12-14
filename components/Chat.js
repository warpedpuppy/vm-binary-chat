import React from 'react';
import { View, Text} from 'react-native';

// the Chat component's render function displays the user's name entered in the start screen
export default class Chat extends React.Component {
  render() {
    // accessing the user name
    let name  = this.props.route.params.name;
    let bgcolor = this.props.route.params.colorUser;
    // configuring the username to be display it at the top of the screen
    this.props.navigation.setOptions({ title: name });
    // this.props.navigation.setOptions({ backgroundColor: bgcolor });
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgcolor}}>
        <Text>Hello!</Text>
      </View>
    )
  }
}
