import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { AppRegistry, StyleSheet, View, Image, Linking, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Dimensions, AsyncStorage } from 'react-native';
import { Button, List, withTheme, type Theme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Divider } from 'react-native-elements';
import ProfileModal from './ProfileModal.js';

class Following extends Component {
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
      login : "",
      id : -1,
      node_id : "",
      avatar_url : "",
      bio : "",
      blog : "",
      created_at : "",
      email : "",
      followers_url : "",
      following_url : "",
      name : "",
      public_repos : "",
      repos_url : "",
      url : "",
      followings : [],
      modal_visible: false,
      modal_following: null,
    };
    this.replaceNbsps = this.replaceNbsps.bind(this);
    this.openUrl = this.openUrl.bind(this);
    this.changeStyle = this.changeStyle.bind(this);

    var {height, width} = Dimensions.get('window');
    if(this.state['orientation'] === "portrait") {
      this.state['styles'] = this.changeStyle(width, height);
    }
    else {
      this.state['styles'] = this.changeStyle(width, height);
    }

    this.openModal = this.openModal.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteFollowing = this.deleteFollowing.bind(this);
    this.updateFollower = this.updateFollower.bind(this);
  }

  deleteFollowing(following) {
    let token = this.state['token'];
    deleteFollowing = async () => {
      console.log("delete:"+"https://api.github.com/user/following/" + following['login']);
      let result_following = await axios.delete("https://api.github.com/user/following/" + following['login'], token);
      if(result_following !== null) {
        let followings = this.state['followings'];
        for(let i=0; i<followings.length; i++) {
          if(followings[i]['id'] === following['id']) {
            followings.splice(i, 1);
          }
        }
        this.setState({
          followings: followings,
        });
      }
    }
    deleteFollowing();
  }

  setModalVisible(visible) {
    this.setState({modal_visible: visible});
  }

  closeModal() {
    this.setState({
      modal_visible: false,
    });
  }

  openModal(following) {
    let obj = {"follower": following, "closeFunc": this.closeModal}
    this.setState({
      modal_visible: true,
      modal_following: obj,
    });
  }

  changeStyle(width, height) {
    var styles = StyleSheet.create({
      container : {
    		marginTop: height * 0.02,
    		backgroundColor: '#F6F8FA',
    		width: width,
        flexGrow: 1,
        flex: 2
    	},

      titlebutton : {
        marginTop: height * 0.04,
        marginBottom: height * 0.03,
        borderRadius: 19,
        borderColor: "black",
        borderWidth: 1,
        alignSelf: 'flex-start',
        marginLeft: 'auto',
        marginRight: 'auto',
      },

      title : {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: height * 0.01,
        marginLeft: width * 0.05,
        marginRight: width * 0.05,
        marginBottom: height * 0.01,
        textAlign: 'center',
        color: 'black',
      },

      divider : {
        backgroundColor: 'black',
        height: 1,
      },

      follower : {
        marginTop: 5,
        width : width,
      },

      followerlogin : {
    	  fontSize: 16,
    	  marginLeft: 10,
    	  marginTop: 7,
      	fontFamily: 'Gill Sans',
      },

      company : {
        marginTop: 7,
        marginLeft: 'auto',
        marginRight: 3,
        fontSize: 17,
      },

      companyname : {
        marginTop: 6,
        marginRight: 20,
        fontSize: 16,
      },

      avatar : {
        width: 40,
        height: 40,
        marginLeft: 15,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
      },

      followername : {
      	fontSize: 15,
      	marginLeft: 15,
      	marginTop: 10,
      	fontFamily: 'Gill Sans',
        transform: [
          {
            translateY : 12.5
          }
        ],
      },

      cancelButton : {
        marginTop: 15,
        marginLeft: 'auto',
        marginRight: 20,
        fontSize: 17,
      },

      cancelIcon : {
        fontSize: 22,
      },

      usertype : {
        marginTop: 10,
        marginRight: 20,
        fontSize: 16,
      },

      bio : {
      	fontSize: 14,
      	marginLeft: 5,
      	marginBottom: 10,
      	marginTop: 0,
      	fontFamily: 'Gill Sans',
      },

      bioicon : {
      	fontSize: 16,
      	marginLeft: 15,
      	marginBottom: 10,
    	  marginTop: 0,
      },

      empty : {
        height: height * 0.05,
      },
    });
    return styles;
  }

  replaceNbsps(str) {
    let re = new RegExp(String.fromCharCode(160), "g");
    return str.replace(re, " ");
  }

  openUrl(url) {
		Linking.canOpenURL(url).then(supported => {
      		if (supported) {
        		Linking.openURL(url);
      		}
      		else {
        		console.log("Don't know how to open URI: " + url);
      		}
    	});
	}

  componentWillMount() {
    if(this.props['children'] != undefined) {
      let data = this.props['children']['App'];
      this.setState({
        login : data['login'],
        id : data['id'],
        node_id : data['node_id'],
        avatar_url : data['avatar_url'],
        bio : data['bio'],
        blog : data['blog'],
        created_at : data['created_at'],
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
        token : data['token'],
      });

      getFollower = async (url) => {
  			let result_following = await axios.get(url);
  			let followings = result_following.data;
        // console.log(result_following);
  			for(let i = 0; i<followings.length; i ++) {
  				let following = {};
  				following['id'] = followings[i]['id'];
  				following['avatar_url'] = followings[i]['avatar_url'];
  				following['type'] = followings[i]['type'];
  				following['html_url'] = followings[i]['html_url'];
  				following['login'] = followings[i]['login'];
  				following['id'] = followings[i]['id'];
          following['api_url'] = followings[i]['url'];
          let following_data = await axios.get(following['api_url']);
          following['name'] = following_data.data['name'];
          if(following['name'] === null || following['name'] === "") {
            following['name'] = following['login'];
          }
          following['company'] = following_data.data['company'];
          if(following['company'] === null) {
            following['company'] = "N/A";
          }
          if(following['company'].length > 20) {
            following['company'] = following['company'].substring(0, 17) + "...";
          }
          following['bio'] = following_data.data['bio'];
          if(following['bio'] === "" || following['bio'] === null) {
            following['bio'] = "N/A";
          }
          if(following['bio'].length > 40) {
            following['bio'] = following['bio'].substring(0, 37) + "...";
          }
          following['blog'] = following_data.data['blog'];
          if(following['blog'] === null || following['blog'] === "") {
            following['blog'] = following_data.data['html_url'];
          }
          following['created_at'] = following_data.data['created_at'];
          following['followers'] = following_data.data['followers'];
          following['following'] = following_data.data['following'];
          following['public_repos'] = following_data.data['public_repos'];
          following['html_url'] = following_data.data['html_url'];
          let createDate = new Date(Date.parse(following['created_at']));
          let month = createDate.getUTCMonth() + 1;
          let day = createDate.getUTCDate();
          let year = createDate.getUTCFullYear();
          let createDateFinal = createDate.toISOString().split('T')[0];
          following['created_at'] = createDateFinal;
          // console.log(following);
  				this.state['followings'].push(following);
  			}
        let followings_save = this.state['followings'];
        console.log(this.state['token']['auth']['username']);
        console.log(followings_save);

        const saveFollowingInfo = async followings_save => {
          try {
            await AsyncStorage.setItem(this.state['token']['auth']['username']+"followings", JSON.stringify(followings_save));
          } catch (error) {
            console.log(error.message);
          }
        }
        saveFollowingInfo(followings_save);

        const getFollowingInfo = async () => {
          let followings_load = {};
          try {
            followings_load = await AsyncStorage.getItem(this.state['token']['auth']['username']+"followings", (value) => {
              JSON.parse(value);
            });
            console.log(followings_load);
          } catch (error) {
            // Error retrieving data
            console.log(error.message);
          }
        }
        getFollowingInfo();
  			this.forceUpdate();
      }

      this.state['updateFollowing'] = getFollower;
      getFollower(data['url']+"/following");
      console.log(data['url']+"/following");
    }
	  this.forceUpdate();
  }

  updateFollower = async (url) => {
    let result_following = await axios.get(url);
    let followings = result_following.data;
    // console.log(result_following);
    let followings_new = [];
    for(let i = 0; i<followings.length; i ++) {
      let following = {};
      following['id'] = followings[i]['id'];
      following['avatar_url'] = followings[i]['avatar_url'];
      following['type'] = followings[i]['type'];
      following['html_url'] = followings[i]['html_url'];
      following['login'] = followings[i]['login'];
      following['id'] = followings[i]['id'];
      following['api_url'] = followings[i]['url'];
      let following_data = await axios.get(following['api_url']);
      following['name'] = following_data.data['name'];
      if(following['name'] === null || following['name'] === "") {
        following['name'] = following['login'];
      }
      following['company'] = following_data.data['company'];
      if(following['company'] === null) {
        following['company'] = "N/A";
      }
      if(following['company'].length > 20) {
        following['company'] = following['company'].substring(0, 17) + "...";
      }
      following['bio'] = following_data.data['bio'];
      if(following['bio'] === "" || following['bio'] === null) {
        following['bio'] = "N/A";
      }
      if(following['bio'].length > 40) {
        following['bio'] = following['bio'].substring(0, 37) + "...";
      }
      following['blog'] = following_data.data['blog'];
      if(following['blog'] === null || following['blog'] === "") {
        following['blog'] = following_data.data['html_url'];
      }
      following['created_at'] = following_data.data['created_at'];
      following['followers'] = following_data.data['followers'];
      following['following'] = following_data.data['following'];
      following['public_repos'] = following_data.data['public_repos'];
      following['html_url'] = following_data.data['html_url'];
      let createDate = new Date(Date.parse(following['created_at']));
      let month = createDate.getUTCMonth() + 1;
      let day = createDate.getUTCDate();
      let year = createDate.getUTCFullYear();
      let createDateFinal = createDate.toISOString().split('T')[0];
      following['created_at'] = createDateFinal;
      // console.log(following);
      followings_new.push(following);
    }
    this.setState({
      followings: followings_new,
    });
    this.forceUpdate();
    console.log("Update the followings from the following!!!!!!!!!");
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
        <ScrollView style={styles.container}>
          {
            this.state['url'].length > 0 ? (
              <TouchableOpacity style={styles.titlebutton} onPress={this.openUrl.bind(this, this.state['url']+"?tab=following")}>
                <Text style={styles.title}>{"Followings".toUpperCase()}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.titlebutton}>
                <Text style={styles.title}>{this.state['name']}</Text>
              </TouchableOpacity>
            )
          }
          <Divider style={styles.divider} />
          {

            this.state.modal_visible ?
           <ProfileModal>{this.state['modal_following']}</ProfileModal> :

            this.state['followings'].map((following) => (
              <View key={following['id']}>
                <View style={styles.follower}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.openModal(following)}>
                      <Text style={styles.followerlogin}>
                        {following['login'].toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                    <Icon name="work" color="black" style={styles.company} ></Icon>
                    <Text style={styles.companyname} >{following['company']}</Text>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <Image style={styles.avatar} source={{uri: following['avatar_url']}}></Image>
                    <Text style={styles.followername}>Name: {following['name']}</Text>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => this.deleteFollowing(following)}>
                      <Icon name="clear" color="black" style={styles.cancelIcon} ></Icon>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="description" style={styles.bioicon} color="black" ></Icon>
                  <Text style={styles.bio}>{following['bio']}</Text>
                </View>
                <Divider style={styles.divider} />
              </View>
            ))
          }
          <View style={styles.empty}></View>
        </ScrollView>
      );
    }
}
export default Following;
