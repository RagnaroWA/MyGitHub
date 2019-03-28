import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { AppRegistry, StyleSheet, View, Image, Linking, ScrollView } from 'react-native';
import { Button, List, withTheme, type Theme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Dimensions from 'Dimensions';

class Home extends Component {
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
      followers : -1,
      following : -1,
      followers_url : "",
      following_url : "",
      name : "",
      public_repos : "",
      repos_url : "",
      url : "",
    };
    this.replaceNbsps = this.replaceNbsps.bind(this);
    this.state['orientation'] = isPortrait() ? 'portrait' : 'landscape';

    this.changeStyle = this.changeStyle.bind(this);
    var {height, width} = Dimensions.get('window');
    this.state['styles'] = this.changeStyle(width, height);
  }

  replaceNbsps(str) {
    let re = new RegExp(String.fromCharCode(160), "g");
    return str.replace(re, " ");
  }

  changeStyle(width, height) {
    const styles = StyleSheet.create({
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
    });
    return styles;
  }

  componentWillMount() {
    // axios.defaults.headers.common['Authorization'] = auth;
    // getUsers = async () => {
    //   let result = await axios.get('https://api.github.com/users/' + 'RagnaroWA');
    //   let data = result.data;
    //   // console.log(data);
    //   let createDate = new Date(Date.parse(data['created_at']));
    //   let month = createDate.getUTCMonth() + 1;
    //   let day = createDate.getUTCDate();
    //   let year = createDate.getUTCFullYear();
    //   let createDateFinal = createDate.toISOString().split('T')[0];
    //   this.setState({
    //     login : data['login'],
    //     id : data['id'],
    //     node_id : data['node_id'],
    //     avatar_url : data['avatar_url'],
    //     bio : this.replaceNbsps(data['bio']),
    //     blog : data['blog'],
    //     created_at : createDateFinal,
    //     email : data['email'],
    //     followers : data['followers'],
    //     following : data['following'],
    //     followers_url : data['followers_url'],
    //     following_url : data['following_url'],
    //     name : data['name'],
    //     public_repos : data['public_repos'],
    //     repos_url : data['repos_url'],
    //     url : data['url'],
    //     company : data['company'],
    //   });
    // };
    // getUsers();
    // console.log(this.props.children);
    // this.forceUpdate();
  }

  componentDidMount() {
    if(this.props['children'] != undefined) {
      // console.log(this.props['children']['App']);
      let data = this.props['children']['App'];
      if(data['bio'] === null) {
        data['bio'] = 'N/A';
      }
      if(data['company'] === null) {
        data['company'] = 'N/A';
      }
      console.log(data);
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
      });
    }
  }

  render() {
    let numberFollowers = `Followers: ${this.state['followers'].toString()}`;
    let numberFollowings = `Followings: ${this.state['following'].toString()}`;
    let numberRepos = `Repositories: ${this.state['public_repos'].toString()}`;
    let email = this.state['email'];
    if (email == null) {
      email = "zzhan147@illinois.edu"
    }
    var {height, width} = Dimensions.get('window');
    if(this.state['orientation'] === "portrait") {
      this.state['styles'] = this.changeStyle(width, height);
    }
    else {
      this.state['styles'] = this.changeStyle(width, height);
    }
    const styles = this.state['styles'];
      return (
        <ScrollView style={styles.background}>
          <Text style={styles.centerText1}>{this.state['name']}</Text>
          <Text style={styles.centerText2}>{this.state['login']}</Text>
          <Button style={styles.website} color="#4f4f4f" onPress={ ()=>{ Linking.openURL('mailto:'+email)}}>{email}</Button>
          <Button style={styles.website} color="black" onPress={ ()=>{ Linking.openURL(this.state['blog'])}}>{this.state['blog']}</Button>
          <Image style={styles.avatar} source={{uri: this.state['avatar_url']}}></Image>
          <Text style={styles.company}>{this.state['company']}</Text>
          <Text style={styles.bio}>{this.state['bio']}</Text>
          <Button style={styles.follower} icon="person-add" onPress={() => this.props.children.changeFollower()} color="black">{numberFollowers}</Button>
          <Button style={styles.following} icon="person" onPress={() => this.props.children.changeFollowing()} color="black">{numberFollowings}</Button>
          <Button style={styles.repo} icon="folder" onPress={() => this.props.children.changeRepo()} color="black">{numberRepos}</Button>
          <Text style={styles.create}>Created on: {this.state['created_at']}</Text>
          <View style={styles.empty}></View>
        </ScrollView>
      );
  }
}

export default Home;
