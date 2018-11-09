import React, { Component } from 'react';
import { View, TextInput, ScrollView, Share, TouchableOpacity, StatusBar, Image, KeyboardAvoidingView } from 'react-native';
import { Text, Button } from 'native-base';
import esp from 'esoftplay';
import Expo from 'expo'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal';
import { CameraRoll } from 'react-native';
const EsocialLogin = esp.mod('lib/sociallogin');
const { colorPrimary, STATUSBAR_HEIGHT, isIphoneX, width } = esp.mod('lib/style');
const config = esp.config();

/* 

  <EuserLogin
    setUser={(user)=>{}}
    user={user}
    onPressCancel={()=>{}}

*/

class EuserLogin extends Component {

  state = {
    sosmed: '',
    username: '',
    password: '',
    email: '',
    isLoading: false
  }

  onSuccessLogin(user) {
    const Eclass = esp.mod('user/class');
    Eclass.create(user)
  }

  onFailedLogin(msg) {

  }

  attemptLogin() {
    this.setState({ isLoading: true })
    const crypt = esp.mod('lib/crypt');
    const Curl = esp.mod('lib/curl');
    const uri = 'user/mlogin'
    const config = esp.config();
    var post = {}
    const { username, password, email } = this.state
    if (username != '' && password != '') {
      post = {
        username: crypt.encode(username),
        password: crypt.encode(password),
      }
    }
    if (email != '') {
      post = {
        email: crypt.encode(email)
      }
    }
    if (post.hasOwnProperty('email') || post.hasOwnProperty('username') || post.hasOwnProperty('password')) {
      new Curl(config.content + uri, post,
        (res, msg) => {
          esp.log(res, 'pesan');
          console.log(res)
          this.onSuccessLogin(res)
          this.inputUsername.setNativeProps({ text: '' })
          this.inputPassword.setNativeProps({ text: '' })
          this.setState({
            isLoading: false,
            email: ''
          })
        },
        (msg) => {
          console.log('gagal => ' + msg, email)
          this.onFailedLogin(msg)
          this.setState({ isLoading: false, email: '' })
        }, 1
      )
    }
  }

  async componentDidMount() {

  }

  render = () => {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={20} >
        <StatusBar barStyle={'dark-content'} />
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: STATUSBAR_HEIGHT, paddingBottom: isIphoneX ? 30 : 0, alignItems: 'center', justifyContent: 'center' }} >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }} >
            <Image source={esp.assets('logo.png')} style={{ width: 130, height: 130, resizeMode: 'contain', marginVertical: 30 }} />
            <View style={{ width: width * 0.81, marginHorizontal: width * 0.095 }} >
              <TextInput
                ref={(e) => this.inputUsername = e}
                onChangeText={(e) => this.setState({ username: e })}
                style={{ fontSize: 16, marginBottom: 10, paddingVertical: 10, paddingHorizontal: 5 }}
                returnKeyType={'next'}
                onSubmitEditing={() => this.inputPassword.focus()}
                blurOnSubmit={false}
                placeholder='username'
                keyboardType='email-address'
                underlineColorAndroid={colorPrimary}
                selectionColor={colorPrimary} />
              <TextInput
                ref={(e) => this.inputPassword = e}
                onChangeText={(e) => this.setState({ password: e })}
                style={{ fontSize: 16, marginBottom: 40, paddingVertical: 10, paddingHorizontal: 5 }}
                underlineColorAndroid={colorPrimary}
                secureTextEntry={true}
                placeholder='password'
                blurOnSubmit={true}
                returnKeyType={'go'}
                onSubmitEditing={() => this.attemptLogin()}
                selectionColor={colorPrimary} />
              <Button onPress={() => this.attemptLogin()} block style={{ backgroundColor: colorPrimary, marginHorizontal: 3 }} >
                <Text>LOGIN</Text>
              </Button>
            </View>
            <Text note style={{ margin: 20, textAlign: 'center' }} >atau login dengan</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: width * 0.6 }} >
              <TouchableOpacity onPress={() => this.setState({ sosmed: 'google' })} ><Ionicons name="logo-google" size={40} color={'#F34A38'} /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ sosmed: 'facebook' })} ><Ionicons name="logo-facebook" size={40} color={'#475993'} /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ sosmed: 'twitter' })} ><Ionicons name="logo-twitter" size={40} color={'#76A9EA'} /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ sosmed: 'instagram' })} ><Ionicons name="logo-instagram" size={40} color={'#0C5589'} /></TouchableOpacity>
            </View>
            <Modal
              isVisible={this.state.sosmed != ''}
              onBackButtonPress={() => this.setState({ sosmed: '' })}
              onBackdropPress={() => this.setState({ sosmed: '' })} >
              <View style={{ margin: 24, flex: 1, backgroundColor: 'white', borderRadius: 4 }} >
                <EsocialLogin
                  url={config.content + 'user/commentlogin/' + this.state.sosmed}
                  onResult={(user) => {
                    this.inputUsername.setNativeProps({ text: '' })
                    this.inputPassword.setNativeProps({ text: '' })
                    this.setState(
                      {
                        username: '',
                        password: '',
                        sosmed: '',
                        email: user.email
                      },
                      () => {
                        this.attemptLogin()
                      })
                  }}
                />
              </View>
            </Modal>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
module.exports = EuserLogin 
 export default  EuserLogin;