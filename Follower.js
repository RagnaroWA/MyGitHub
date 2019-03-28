import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { AppRegistry, StyleSheet, View, Image, Linking, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Dimensions, AsyncStorage } from 'react-native';
import { Button, List, withTheme, type Theme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Divider } from 'react-native-elements';
import ProfileModal from './ProfileModal.js';

class Follower extends Component {
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
      followers : [],
      modal_visible: false,
      modal_follower: null,
    };
    this.replaceNbsps = this.replaceNbsps.bind(this);
    this.openUrl = this.openUrl.bind(this);

    this.changeStyle = this.changeStyle.bind(this);
    var {height, width} = Dimensions.get('window');
    this.state['styles'] = this.changeStyle(width, height);
    this.openModal = this.openModal.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addFollowing = this.addFollowing.bind(this);
  }

  addFollowing(follower) {
    let token = this.state['token'];
    putFollowing = async () => {
      let result_following = await axios.put("https://api.github.com/user/following/" + follower['login'], {}, token);
      if(result_following !== null) {
        console.log("Start get following !!!");
        this.props.children.getFollowing();
      }
    };
    putFollowing();
  }

  setModalVisible(visible) {
    this.setState({modal_visible: visible});
  }

  closeModal() {
    this.setState({
      modal_visible: false,
    });
  }

  openModal(follower) {
    let obj = {"follower": follower, "closeFunc": this.closeModal}
    this.setState({
      modal_visible: true,
      modal_follower: obj,
    });
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
  			let result_follower = await axios.get(url);
  			let followers = result_follower.data;
        // console.log(result_follower);
  			for(let i = 0; i<followers.length; i ++) {
  				let follower = {};
  				follower['id'] = followers[i]['id'];
  				follower['avatar_url'] = followers[i]['avatar_url'];
  				follower['type'] = followers[i]['type'];
  				follower['html_url'] = followers[i]['html_url'];
  				follower['login'] = followers[i]['login'];
  				follower['id'] = followers[i]['id'];
          follower['api_url'] = followers[i]['url'];
          let follower_data = await axios.get(follower['api_url']);
          console.log(follower_data);
          follower['name'] = follower_data.data['name'];
          if(follower['name'] === null || follower['name'] === "") {
            follower['name'] = follower['login'];
          }
          follower['company'] = follower_data.data['company'];
          if(follower['company'] === null) {
            follower['company'] = "N/A";
          }
          if(follower['company'].length > 20) {
            follower['company'] = follower['company'].substring(0, 17) + "...";
          }
          follower['bio'] = follower_data.data['bio'];
          if(follower['bio'] === "" || follower['bio'] === null) {
            follower['bio'] = "N/A";
          }
          if(follower['bio'].length > 40) {
            follower['bio'] = follower['bio'].substring(0, 37) + "...";
          }
          follower['blog'] = follower_data.data['blog'];
          if(follower['blog'] === null || follower['blog'] === "") {
            follower['blog'] = follower_data.data['html_url'];
          }
          follower['created_at'] = follower_data.data['created_at'];
          follower['followers'] = follower_data.data['followers'];
          follower['following'] = follower_data.data['following'];
          follower['public_repos'] = follower_data.data['public_repos'];
          follower['html_url'] = follower_data.data['html_url'];
          let createDate = new Date(Date.parse(follower['created_at']));
          let month = createDate.getUTCMonth() + 1;
          let day = createDate.getUTCDate();
          let year = createDate.getUTCFullYear();
          let createDateFinal = createDate.toISOString().split('T')[0];
          follower['created_at'] = createDateFinal;
  				this.state['followers'].push(follower);
  			}
        let followers_save = this.state['followers'];
        console.log(this.state['token']['auth']['username']);
        console.log(followers_save);

        const saveFollowerInfo = async followers_save => {
          try {
            await AsyncStorage.setItem(this.state['token']['auth']['username']+"followers", JSON.stringify(followers_save));
          } catch (error) {
            console.log(error.message);
          }
        }
        saveFollowerInfo(followers_save);

        const getFollowerInfo = async () => {
          let followers_load = {};
          try {
            followers_load = await AsyncStorage.getItem(this.state['token']['auth']['username']+"followers", (value) => {
              JSON.parse(value);
            });
            console.log(followers_load);
          } catch (error) {
            // Error retrieving data
            console.log(error.message);
          }
        }
        getFollowerInfo();
  			this.forceUpdate();
	    };
	    getFollower(data['url']+"/followers");
      console.log(data['url']+"/followers");
	    this.forceUpdate();
  	}
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
              <TouchableOpacity style={styles.titlebutton} onPress={this.openUrl.bind(this, this.state['url']+"?tab=followers")}>
                <Text style={styles.title}>{"Followers".toUpperCase()}</Text>
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
             <ProfileModal>{this.state['modal_follower']}</ProfileModal> :

             this.state['followers'].map((follower) => (
               <View key={follower['id']}>
                 <View style={styles.follower}>
                   <View style={{flexDirection: 'row'}}>
                     <TouchableOpacity onPress={() => this.openModal(follower)}>
                       <Text style={styles.followerlogin}>
                         {follower['login'].toUpperCase()}
                       </Text>
                     </TouchableOpacity>
                     <Icon name="work" color="black" style={styles.company} ></Icon>
                     <Text style={styles.companyname} >{follower['company']}</Text>
                   </View>

                   <View style={{flexDirection: 'row'}}>
                     <Image style={styles.avatar} source={{uri: follower['avatar_url']}}></Image>
                     <Text style={styles.followername}>Name: {follower['name']}</Text>
                       <TouchableOpacity style={styles.cancelButton} onPress={() => this.addFollowing(follower)}>
                         <Icon name="done" color="black" style={styles.cancelIcon} ></Icon>
                       </TouchableOpacity>
                   </View>
                 </View>
                 <View style={{flexDirection: 'row'}}>
                   <Icon name="description" style={styles.bioicon} color="black" ></Icon>
                   <Text style={styles.bio}>{follower['bio']}</Text>
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
export default Follower;
