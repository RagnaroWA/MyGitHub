import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { AppRegistry, StyleSheet, View, Image, Linking, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Dimensions, AsyncStorage } from 'react-native';
import { Button, List, withTheme, type Theme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Divider } from 'react-native-elements';

class Repo extends Component {
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
	      repos : [],
				star_repos : [],
				token: null,
	    };
      this.replaceNbsps = this.replaceNbsps.bind(this);
      this.state['orientation'] = isPortrait() ? 'portrait' : 'landscape';
      // console.log(this.state['orientation']);

      this.changeStyle = this.changeStyle.bind(this);
      var {height, width} = Dimensions.get('window');
      this.state['styles'] = this.changeStyle(width, height);
			this.checkRepoId = this.checkRepoId.bind(this);
			this.putStar = this.putStar.bind(this);
	}

	putStar(repo) {
		if(this.checkRepoId(repo) === true) {
			let token = this.state['token'];
			console.log(token);
			deleteStar = async () => {
				console.log("delete:"+"https://api.github.com/user/starred/" + repo['owner_name'] + "/" + repo['name']);
				let result_repo = await axios.delete("https://api.github.com/user/starred/" + repo['owner_name'] + "/" + repo['name'], token);
				if(result_repo !== null) {
					// getStarredRepo(this.state['url']+'/starred');
					let star_repos = this.state['star_repos'];
					for(let i=0; i<star_repos.length; i++) {
						if(star_repos[i]['id'] === repo['id']) {
							star_repos.splice(i, 1);
						}
					}
					this.setState({
						star_repos: star_repos,
					});
				}
			}
			deleteStar();
			console.log('delete a star');
		}
		else {
			let token = this.state['token'];
			putStar = async () => {
				let result_repo = await axios.put("https://api.github.com/user/starred/" + repo['owner_name'] + "/" + repo['name'], {}, token);
				if(result_repo !== null) {
					// getStarredRepo(this.state['url']+'/starred');
					let star_repos = this.state['star_repos'];
					let temp_repo = {'id': repo['id']};
					star_repos.push(temp_repo);
					console.log('pushed' + star_repos.length);
					this.setState({
						star_repos: star_repos,
					});
				}
			};
			putStar();
			console.log('post a star');
		}
	}

	checkRepoId(repo) {
		let this_repo_id = repo['id'];
		for(let i=0; i<this.state['star_repos'].length; i++) {
			if(this_repo_id === this.state['star_repos'][i]['id']) {
				console.log(this_repo_id);
				return true;
			}
		}
		return false;
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

      star : {
        marginTop: 7,
        marginLeft: 'auto',
        marginRight: 3,
        fontSize: 17,
      },

			starButton : {
				marginLeft: 'auto',
        marginRight: 3,
			},

      starcount : {
        marginTop: 6,
        marginRight: 20,
        fontSize: 16,
      },

      watch : {
        marginTop: 7,
        marginRight: 15,
        fontSize: 17,
      },

      repo : {
    	   marginTop: 5,
    	    width : width,
      },

      reponame : {
    	  fontSize: 16,
    	  marginLeft: 10,
    	  marginTop: 7,
      	fontFamily: 'Gill Sans',
      },

      ownername : {
      	fontSize: 15,
      	marginLeft: 5,
      	marginTop: 10,
      	fontFamily: 'Gill Sans',
      },

      ownericon : {
    	fontSize: 17,
    	marginLeft: 10,
    	marginTop: 10,
      },

      description : {
    	fontSize: 14,
    	marginLeft: 10,
      marginRight: 10,
    	marginBottom: 10,
    	marginTop: 10,
      	fontFamily: 'Gill Sans',
      },

      descriptionicon : {
      	fontSize: 16,
    	marginLeft: 11,
    	marginBottom: 10,
    	marginTop: 10,
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
				getStarredRepo = async (url) => {
					let star_repos = []
					for(let i=1; i<11; i++) {
						let starred_repo = await axios.get(url+"?page="+i);
						console.log(url+"?page="+i);
						let data = starred_repo.data;
						if(data === []) {
							break;
						}
						else {
							star_repos = star_repos.concat(data);
						}
					}
					this.setState({
						star_repos: star_repos,
					});
					this.forceUpdate();
				}
				getStarredRepo(data['url']+'/starred');
				getInfo = async () => {
					let result_repo = await axios.get(data['repos_url']);
					let repos = result_repo.data;
					// console.log(repos);
		      var {height, width} = Dimensions.get('window');
					for(let i = 0; i<repos.length; i ++) {
						let repo = {};
						repo['id'] = repos[i]['id'];
						repo['name'] = repos[i]['name'];
						if(width <= 320 && repo['name'].length >= 20) {
							repo['name'] = repo['name'].substring(0, 20) + "...";
						}
						repo['owner_name'] = repos[i]['owner']['login'];
						repo['stars'] = repos[i]['stargazers_count'];
						repo['description'] = repos[i]['description'];
		        if(repo['description'].length > 60) {
		          repo['description'] = repo['description'].substring(0, 60) + "...";
		        }
						repo['html_url'] = repos[i]['html_url'];
						repo['forks_count'] = repos[i]['forks_count'];
						repo['watches'] = repos[i]['watchers_count'];
						this.state['repos'].push(repo);
					}
					let repos_save = this.state['repos'];
					console.log(this.state['token']['auth']['username']);
					console.log(repos_save);
					const saveRepoInfo = async repos_save => {
						try {
							await AsyncStorage.setItem(this.state['token']['auth']['username']+"repos", JSON.stringify(repos_save));
						} catch (error) {
							console.log(error.message);
						}
					}
					saveRepoInfo(repos_save);

					const getRepoInfo = async () => {
						let repos_load = {};
						try {
							repos_load = await AsyncStorage.getItem(this.state['token']['auth']['username']+"repos", (value) => {
								JSON.parse(value);
							});
							console.log(repos_load);
						} catch (error) {
							// Error retrieving data
							console.log(error.message);
						}
					}
					getRepoInfo();
					this.forceUpdate();
			  };
		    getInfo();
		    this.forceUpdate();
			}
  	}

  	render() {
      // console.log(this.state['orientation']);
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
    			<ScrollView style={styles.container}>
            {
              this.state['url'].length > 0 ? (
                <TouchableOpacity style={styles.titlebutton} onPress={this.openUrl.bind(this, this.state['url']+"?tab=repositories")}>
                  <Text style={styles.title}>{"Repositories".toUpperCase()}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.titlebutton}>
                  <Text style={styles.title}>{this.state['name']}</Text>
                </TouchableOpacity>
              )
            }
            <Divider style={styles.divider} />
    				{
    					this.state['repos'].map((repo) => (
								<View key={repo['id']}>
    							<View style={styles.repo}>
            				<View style={{flexDirection: 'row'}}>
											<TouchableOpacity onPress={this.openUrl.bind(this, repo['html_url'])}>
    									<Text style={styles.reponame}>
    										{repo['name'].toUpperCase()}
    									</Text>
											</TouchableOpacity>
												<TouchableOpacity style={styles.starButton} onPress={() => this.putStar(repo)}>
													{
														this.checkRepoId(repo) === true ? (
															<Icon name="star" color="#f7b602" style={styles.star} ></Icon>
														) : (
															<Icon name="star" color="grey" style={styles.star} ></Icon>
														)
													}
												</TouchableOpacity>
              					{
              						repo['watches'] > 0 ? (
              							<Icon name="visibility" style={styles.watch} color="black" ></Icon>
              						) : (
              							<Icon name="visibility-off" style={styles.watch} color="black" ></Icon>
              						)
              					}
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="person" style={styles.ownericon} color="black" ></Icon>
                      <Text style={styles.ownername}>{repo['owner_name'].toUpperCase()}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                    	<Icon name="description" style={styles.descriptionicon} color="black" ></Icon>
                    	<Text style={styles.description}>{repo['description']}</Text>
                    </View>
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

export default Repo;
