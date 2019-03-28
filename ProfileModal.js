import React, { Component } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { AppRegistry, StyleSheet, View, Modal, TouchableHighlight, Text, Alert, TextInput, Image, ScrollView, Linking, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, List, withTheme, type Theme } from 'react-native-paper';

class ProfileModal extends Component {
  constructor(props) {
    super(props);

    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
      this.forceUpdate();
    });

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    }

    var {height, width} = Dimensions.get('window');

    this.state = {

    };

    this.state['orientation'] = isPortrait() ? 'portrait' : 'landscape';
    this.changeStyle = this.changeStyle.bind(this);
    this.state['styles'] = this.changeStyle(width, height);
  }

  componentDidMount() {
    console.log(this.props.children);
  }

  changeStyle(width, height) {
    const styles = StyleSheet.create({
      modalContainer : {
        justifyContent: 'center',
        flex: 1
      },

      modalavatar : {
        height: width * 0.35,
        width: width * 0.35,
        marginBottom: 20,
        transform: [
          {
            translateX : 1 * width * 0.65 * 0.5
          }
        ],
        borderRadius: 20,
      },

      closeButton: {
        fontSize: 20,
        marginTop: height * 0.05,
        alignItems: 'flex-end',
        marginRight: 20,
      },

      centerText1 : {
        fontWeight: 'bold',
        fontSize: 22,
        marginTop: height * 0.08,
        textAlign: 'center'
      },

      centerText2 : {
        fontSize: 19,
        marginTop: height * 0.008,
        textAlign: 'center',
        color: '#4f4f4f'
      },

      background : {
        backgroundColor: '#F6F8FA',
        flexGrow: 1,
        flex: 2
      },

      website : {
        fontSize: 13,
        color: 'black'
      },

      avatar : {
        width: width * 0.4,
        height: width * 0.4,
        marginTop: height * 0.01,
        left: width * 0.5,
        transform: [
          {
            translateX : -1 * width * 0.4 * 0.5
          }
        ],
        borderRadius: 20,
      },

      company : {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: height * 0.03,
        textAlign: 'center',
      },

      bio : {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        color: 'black',
        width: width * 0.8,
        left: width * 0.5,
        transform: [
          {
            translateX : -1 * width * 0.8 * 0.5
          }
        ],
        marginBottom: 40,
      },

      follower : {
        width: width * 0.55,
        left: width * 0.5,
        transform: [
          {
            translateX : -1 * width * 0.55 * 0.5
          }
        ],
        marginTop: height * -0.025,
        fontSize: 12,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 20,
      },

      following : {
        marginTop: height * 0.0,
        width: width * 0.55,
        left: width * 0.5,
        transform: [
          {
            translateX : -1 * width * 0.55 * 0.5
          }
        ],
        fontSize: 12,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 20,
      },

      repo : {
        marginTop: height * 0.0,
        width: width * 0.55,
        left: width * 0.5,
        transform: [
          {
            translateX : -1 * width * 0.55 * 0.5
          }
        ],
        fontSize: 12,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 20,
      },

      create : {
        fontSize: 15,
        marginTop: height * 0.03,
        textAlign: 'center',
        color: '#4f4f4f'
      },

      empty : {
        height: height * 0.05,
      },

      closeIcon : {
        fontSize: 20,
      }
    });
    return styles;
  }

  render() {
    var {height, width} = Dimensions.get('window');
    if(this.state['orientation'] === "portrait") {
      this.state['styles'] = this.changeStyle(width, height);
    }
    else {
      this.state['styles'] = this.changeStyle(width, height);
    }
    const styles = this.state['styles'];
      return (
        <View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <ScrollView style={styles.background}>
              <TouchableOpacity style={styles.closeButton} onPress={() => this.props.children.closeFunc()}>
                <Icon name="clear" color="black" style={styles.closeIcon}></Icon>
              </TouchableOpacity>
              <Text style={styles.centerText1}>{this.props.children.follower['name']}</Text>
              <Text style={styles.centerText2}>{this.props.children.follower['login']}</Text>
              <Button style={styles.website} color="black" onPress={ ()=>{ Linking.openURL(this.props.children.follower['blog'])}}>{this.props.children.follower['blog']}</Button>
              <Image style={styles.avatar} source={{uri: this.props.children.follower['avatar_url']}}></Image>
              <Text style={styles.company}>{this.props.children.follower['company']}</Text>
              <Text style={styles.bio}>{this.props.children.follower['bio']}</Text>
              <Button style={styles.follower} icon="person-add" color="black">{this.props.children.follower['followers']}</Button>
              <Button style={styles.following} icon="person" color="black">{this.props.children.follower['following']}</Button>
              <Button style={styles.repo} icon="folder" color="black">{this.props.children.follower['public_repos']}</Button>
              <Text style={styles.create}>Created on: {this.props.children.follower['created_at']}</Text>
              <View style={styles.empty}></View>
            </ScrollView>
          </Modal>
        </View>
    );
  }
}

export default ProfileModal;
