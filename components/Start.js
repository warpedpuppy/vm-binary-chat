import React from 'react';
import { View, Text, Button, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';

// Start component's render function displays the initial screen elements
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      userName: '',
      userColor: '',
     };
  }


  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../Assets-images/Background-Image.png')} style={styles.image}>
          <Text style={styles.title}>Binary Chat</Text>
          <View style={styles.inner}>
            <TextInput
            style={styles.name}
            onChangeText={(userName) => this.setState({userName})}
            value={this.state.userName}
            placeholder='Your name'
            />
            <Text style={ styles.bgText}>Choose Background Color:</Text>
            {/* to display the different background theme for the chat */}
            <View style={styles.circle}>
              <TouchableHighlight style={styles.circle1} onPress={() => this.setState({userColor: '#090C08'})} value={this.state.userColor}></TouchableHighlight>
              <TouchableHighlight style={styles.circle2} onPress={() => this.setState({userColor: '#474056'})} value={this.state.userColor}></TouchableHighlight>
              <TouchableHighlight style={styles.circle3} onPress={() => this.setState({userColor: '#8A95A5'})} value={this.state.userColor}></TouchableHighlight>
              <TouchableHighlight style={styles.circle4} onPress={() => this.setState({userColor: '#B9C6AE'})} value={this.state.userColor}></TouchableHighlight>
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.userName, colorUser: this.state.userColor })}>
                <Text style={styles.btnText}>Start Chatting</Text>
              </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 250,
  },
  name: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    borderWidth: 2,
    margin: 20,
    height: 50,
  },
  inner: {
    height: '40%',
    width: '88%',
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
  },
  btn: {
    borderWidth: 2,
    backgroundColor: '#757083',
    justifyContent:'center',
    alignItems: 'center',
    borderColor: '#757083',
    height: 50,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bgText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    marginLeft: 20
  },
  circle: {
    flex: 1,
    flexDirection: 'row',
  },
  circle1: {
    width: 40,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#090C08',
    marginLeft: 20,
    marginTop: 10,
  },
  circle2: {
    width: 40,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#474056',
    marginLeft: 20,
    marginTop: 10,
  },
  circle3: {
    width: 40,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#8A95A5',
    marginLeft: 20,
    marginTop: 10,
  },
  circle4: {
    width: 40,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#B9C6AE',
    marginLeft: 20,
    marginTop: 10,
  },
});
