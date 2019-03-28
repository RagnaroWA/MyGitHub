import React, { Component } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { AppRegistry, StyleSheet, View, Modal, TouchableHighlight, Text, Alert, TextInput, Image, Dimensions, AsyncStorage } from 'react-native';
import axios from 'axios';
import Home from './Home.js';
import Repo from './Repo.js';
import Follower from './Follower.js';
import Following from './Following.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, List, withTheme, type Theme } from 'react-native-paper';

var HomeRoute = () => <Home>{this.changeFollower}</Home>;
var FollowerRoute = () => <Follower>Follower</Follower>;
var FollowingRoute = () => <Following>Following</Following>;
var RepoRoute = () => <Repo>Repo</Repo>;

class App extends Component {
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

    this.state = {
      index: 0,
      routes: [
        { key: 'home', title: 'Home', icon: 'account-circle' },
        { key: 'followers', title: 'Follower', icon: 'person-add' },
        { key: 'followings', title: 'Following', icon: 'person'},
        { key: 'repos', title: 'Repository', icon: 'folder' },
      ],
      userlogin: false,
      scene: this._renderScene,
      username_login: '',
      username_password: '',
    };
    this.changeFollower = this.changeFollower.bind(this);
    this.changeFollowing = this.changeFollowing.bind(this);
    this.changeRepo = this.changeRepo.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.child = React.createRef();


    this.replaceNbsps = this.replaceNbsps.bind(this);
    this.callApi = this.callApi.bind(this);

    this.state['orientation'] = isPortrait() ? 'portrait' : 'landscape';
    this.changeStyle = this.changeStyle.bind(this);

    let {height, width} = Dimensions.get('window');
    this.state['styles'] = this.changeStyle(width, height);
  }

  getFollowing() {
    this.child.current.updateFollower(this.state['url']+"/following");
    console.log(this.state['url']+"/following");
  }

  changeStyle(width, height) {
    const styles = StyleSheet.create({
      modalContainer : {
        justifyContent: 'center',
        flexGrow: 1,
        flex: 2
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

      putusername : {
        height: 40,
        width: width * 0.7,
        transform: [
          {
            translateX : 1 * width * 0.3 * 0.5
          }
        ],
        borderColor: 'black',
        marginBottom: 20,
        borderWidth: 2,
        fontSize: 22,
        textAlign: 'center',
      },

      putuserpassword : {
        height: 40,
        width: width * 0.7,
        transform: [
          {
            translateX : 1 * width * 0.3 * 0.5
          }
        ],
        borderColor: 'black',
        marginBottom: 20,
        borderWidth: 2,
        fontSize: 22,
        textAlign: 'center',
      },

      loginButton : {
        marginTop: height * 0.015,
        width: width * 0.4,
        left: width * 0.5,
        transform: [
          {
            translateX : -1 * width * 0.4 * 0.5
          }
        ],
        marginTop: height * 0.005,
        fontSize: 13,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 2
      },
    });
    return styles;
  }

  setModalVisible(visible) {
    this.setState({userlogin: visible});
  }

  replaceNbsps(str) {
    let re = new RegExp(String.fromCharCode(160), "g");
    return str.replace(/\xA0/g,'');
  }

  changeFollower() {
    this.setState({index : 1})
  }

  changeFollowing() {
    this.setState({index : 2})
  }

  changeRepo() {
    this.setState({index : 3})
  }

  checkUser() {
    let token = {
        auth: {
            username: this.state.username_login,
            password: this.state.username_password,
        }
    };
    getValid = async () => {
      try {
        let result = await axios.get('https://api.github.com/users/' + this.state.username_login, {}, token);
        let data = result.data;
        console.log(result);
        this.setState({
          userlogin: true,
        });
        this.state['userlogin'] = true;
        this.callApi();
      }
      catch (error){
        console.log(error);
        Alert.alert("Wrong Username or Password.");
      }
    }
    getValid();
  }

  callApi() {
    // auth = {
    //   "username": 'RagnaroWA',
    //   "token": 'b0bcc9fc100ab25f5c29413f21b01d598d147879'
    // };
    // axios.defaults.headers.common['Authorization'] = auth;
    var token = {
        auth: {
            username: this.state.username_login,
            password: this.state.username_password,
        }
    };
    getUsers = async () => {
      let result = await axios.get('https://api.github.com/users/' + this.state.username_login, {}, token);
      let data = result.data;
      let createDate = new Date(Date.parse(data['created_at']));
      let month = createDate.getUTCMonth() + 1;
      let day = createDate.getUTCDate();
      let year = createDate.getUTCFullYear();
      let createDateFinal = createDate.toISOString().split('T')[0];
      if(data['bio'] === null) {
        data['bio'] = 'N/A';
      }
      console.log(data['bio']);
      if(data['company'] === null) {
        data['company'] = 'N/A';
      }
      this.setState({
        login : data['login'],
        id : data['id'],
        node_id : data['node_id'],
        avatar_url : data['avatar_url'],
        bio : this.replaceNbsps(data['bio']),
        blog : data['blog'],
        created_at : createDateFinal,
        email : data['email'],
        followers : data['followers'],
        following : data['following'],
        followers_url : data['followers_url'],
        following_url : data['following_url'],
        name : data['name'],
        public_repos : data['public_repos'],
        repos_url : data['repos_url'],
        url : data['url'],
        company : data['company'],
        token : token,
      });

      const userInfo = this.state;
      const saveUserInfo = async userInfo => {
        try {
          await AsyncStorage.setItem(this.state.username_login, JSON.stringify(userInfo));
        } catch (error) {
          console.log(error.message);
        }
      }
      saveUserInfo(data);

      const getLoginId = async () => {
        let userInfo = {};
        try {
          userInfo = await AsyncStorage.getItem(this.state.username_login, (value) => {
            JSON.parse(value);
          });
          console.log(userInfo);
        } catch (error) {
          // Error retrieving data
          console.log(error.message);
        }
      }
      getLoginId();

      let props = {
        changeFollower: this.changeFollower,
        changeFollowing: this.changeFollowing,
        changeRepo: this.changeRepo,
        getFollowing: this.getFollowing,
        "App": this.state,
      };
      HomeRoute = () => <Home>{props}</Home>;
      RepoRoute = () => <Repo>{props}</Repo>;
      FollowingRoute = () => <Following ref={this.child}>{props}</Following>
      FollowerRoute = () => <Follower>{props}</Follower>
      _renderScene = BottomNavigation.SceneMap({
          home: HomeRoute,
          followers: FollowerRoute,
          followings: FollowingRoute,
          repos: RepoRoute,
        });
        this.setState({
          scene: _renderScene,
        });
    };
    getUsers();
    _renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        followers: FollowerRoute,
        followings: FollowingRoute,
        repos: RepoRoute,
      });
      this.setState({
        scene: _renderScene,
      });
  }

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
      home: HomeRoute,
      followers: FollowerRoute,
      followings: FollowingRoute,
      repos: RepoRoute,
    });

  render() {
    var {height, width} = Dimensions.get('window');
    console.log(height);
    if(this.state['orientation'] === "portrait") {
      this.state['styles'] = this.changeStyle(width, height);
    }
    else {
      this.state['styles'] = this.changeStyle(height, width);
    }
    let styles = this.state['styles'];
    if(this.state['userlogin'] === false) {
        return (
          <View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={true}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.modalContainer}>
                <View>
                  <Image
                    style={styles.modalavatar}
                    source={require('./icon.png')}
                  />
                  <TextInput
                    style={styles.putusername}
                    onChangeText={(username_login) => this.setState({username_login})}
                    value={this.state.username_login}
                  />
                  <TextInput
                    style={styles.putuserpassword}
                    onChangeText={(username_password) => this.setState({username_password})}
                    value={this.state.username_password}
                    secureTextEntry={true}
                  />
                <Button style={styles.loginButton} color="black" onPress={ ()=>{ this.checkUser(); }}>GitHub Login</Button>
                </View>
              </View>
            </Modal>
          </View>
      );
    }
    else {
      return (
          <BottomNavigation
            navigationState={this.state}
            onIndexChange={this._handleIndexChange}
            renderScene={this.state.scene}
            barStyle={{backgroundColor: "#23292D"}}
          />
      );
    }
  }
}

export default App;
