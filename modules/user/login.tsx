// 

import React from 'react';
import { Component } from 'react'
import { View, TextInput, ScrollView, Share, TouchableOpacity, StatusBar, Image, KeyboardAvoidingView } from 'react-native';
import { Text, Button } from 'native-base';
import Expo from 'expo'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal';
import { CameraRoll } from 'react-native';
import {
    esp,
    UserClass,
    LibCrypt,
    LibCurl,
    LibSociallogin,
    LibComponent,
    LibStyle
} from 'esoftplay';
const config = esp.config();
/* 

  <euserLogin
    setUser={(user)=>{}}
    user={user}
    onPressCancel={()=>{}}

*/

export interface UserLoginProps {

}

export interface UserLoginState {
  sosmed: string,
  username: string,
  password: string,
  email: string,
  isLoading: boolean
}

export default class euserLogin extends LibComponent<UserLoginProps, UserLoginState> {

  inputUsername: any;
  inputPassword: any;

  state = {
    sosmed: '',
    username: '',
    password: '',
    email: '',
    isLoading: false
  }

  onSuccessLogin(user: any): void {
    UserClass.create(user)
  }

  onFailedLogin(msg: string): void {

  }

  attemptLogin(): void {
    this.setState({ isLoading: true })
    const uri = 'user/mlogin'
    const config = esp.config();
    var post = {}
    const { username, password, email } = this.state
    if (username != '' && password != '') {
      post = {
        username: new LibCrypt().encode(username),
        password: new LibCrypt().encode(password),
      }
    }
    if (email != '') {
      post = {
        email: new LibCrypt().encode(email)
      }
    }
    if (post.hasOwnProperty('email') || post.hasOwnProperty('username') || post.hasOwnProperty('password')) {
      new LibCurl(config.content + uri, post,
        (res, msg) => {
          esp.log(res, 'pesan');
          // console.log(res)
          this.onSuccessLogin(res)
          this.inputUsername.setNativeProps({ text: '' })
          this.inputPassword.setNativeProps({ text: '' })
          this.setState({
            isLoading: false,
            email: ''
          })
        },
        (msg) => {
          // console.log('gagal => ' + msg, email)
          this.onFailedLogin(msg)
          this.setState({ isLoading: false, email: '' })
        }, 1
      )
    }
  }

  render() : any {
    const { colorPrimary, STATUSBAR_HEIGHT, isIphoneX, width } = LibStyle
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={20} >
        <StatusBar barStyle={'dark-content'} />
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: STATUSBAR_HEIGHT, paddingBottom: isIphoneX ? 30 : 0, alignItems: 'center', justifyContent: 'center' }} >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }} >
            <Image source={esp.assets('logo.png')} style={{ width: 130, height: 130, resizeMode: 'contain', marginVertical: 30 }} />
            <View style={{ width: width * 0.81, marginHorizontal: width * 0.095 }} >
              <TextInput
                ref={(e: any) => this.inputUsername = e}
                onChangeText={(e: string) => this.setState({ username: e })}
                style={{ fontSize: 16, marginBottom: 10, paddingVertical: 10, paddingHorizontal: 5 }}
                returnKeyType={'next'}
                onSubmitEditing={() => this.inputPassword.focus()}
                blurOnSubmit={false}
                placeholder='username'
                keyboardType='email-address'
                underlineColorAndroid={colorPrimary}
                selectionColor={colorPrimary} />
              <TextInput
                ref={(e: any) => this.inputPassword = e}
                onChangeText={(e: string) => this.setState({ password: e })}
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
                <LibSociallogin
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