import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/MnemonicCompontStyle';
import { Button } from 'react-native-elements';
import { Colors, Metrics } from '../Themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WalletActions from '../Redux/WalletRedux';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from '../I18n';
import Toast from 'react-native-root-toast';
import {isValidMnemonic} from '../Lib/Format';

class MnemonicCompont extends Component {
    constructor (props) {
        super(props);
        this.password = '';
        this.confirm = '';
        this.mnemonic = '';

        this.state = {
            isCanPress:false,
            isShowPassword:false,
        };
    }

  _onPressBtn=()=>{
      if (!isValidMnemonic(this.mnemonic)) {
          const error = '请输入有效的助记词';
          Toast.show(error, {
              shadow:true,
              position: Toast.positions.CENTER,
          });
          return;
      }
      if (this.password.length < 8 ||  this.confirm.length < 8) {
          const error = '密码不少于8位字符';
          Toast.show(error, {
              shadow:true,
              position: Toast.positions.CENTER,
          });
          return;
      }
      if (this.password !== this.confirm) {
          const error = '密码输入不一致';
          Toast.show(error, {
              shadow:true,
              position: Toast.positions.CENTER,
          });
          return;
      }

      this.props.gethImportMnemonic({mnemonic:this.mnemonic, passphrase:this.password});
  }

  _onChangeMnemonic=(text)=>{
      this.mnemonic = text;
      this._checkInputIsValid();
  }

  _onChangePassword=(text)=>{
      this.password = text;
      this._checkInputIsValid();
  }

  _onChangeConfirm=(text)=>{
      this.confirm = text;
      this._checkInputIsValid();
  }

  _onPressNext=()=>console.log();

  _onPressEyeImg = ()=>{
      const {isShowPassword} = this.state;
      this.setState({
          isShowPassword:!isShowPassword
      });
  }

  componentDidMount=()=>{
      this.props.setLoading({loading:false});
      this.mnemonic = 'tag fee recycle palace nominee van dawn mail approve crash opinion scheme';
      this._checkInputIsValid();
  }

  _checkInputIsValid=()=>{
      if (this.mnemonic.length && this.password.length &&  this.confirm.length) {
          this.setState({isCanPress:true});
          return;
      }
      this.setState({isCanPress:false});
  }

  render () {
      const path = 'm/44’/60‘/0’/0';

      const {isCanPress, isShowPassword} = this.state;
      const {loading} = this.props;

      const eyeImg = (
          <TouchableOpacity onPress={()=>this._onPressEyeImg()} style={{justifyContent:'center'}}>
              {isShowPassword ? <Ionicons name={'md-eye'} size={Metrics.icons.small} color={Colors.separateLineColor}/> : <Ionicons name={'md-eye-off'} size={Metrics.icons.small} color={Colors.separateLineColor}/>}
          </TouchableOpacity>);

      return (
          <View style={styles.container}>
              <Spinner visible={loading} cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}/>
              <ScrollView style={styles.container}>
                  <View style={styles.container}>
                      <View style={styles.remindView}>
                          <Text style={styles.remindText}>{I18n.t('ImportMnemonicRemind')}</Text>
                          <Text style={styles.remind002}>{I18n.t('ImportRemind')}</Text>
                      </View>
                      <View style={styles.mnemonicView}>
                          <TextInput
                              multiline
                              placeholder={ I18n.t('EnterMnemonicRemind')}
                              placeholderTextColor={ Colors.separateLineColor }
                              underlineColorAndroid={ 'transparent' }
                              style={ styles.mnemonicInput }
                              value={ this.mnemonic }
                              onChangeText={(text) => this._onChangeMnemonic(text)}/>
                      </View>
                      <View style={styles.infoView}>
                          <View style={ styles.sectionView }>
                              <View style={ styles.section }>
                                  <Text style={[styles.pathText, {lineHeight:Metrics.icons.tiny}]}>{I18n.t('SetPassword')}</Text>
                                  <AntDesign name={'warning'} size={Metrics.icons.tiny} color={Colors.separateLineColor} style={styles.warning}/>
                              </View>
                              <View style={styles.section}>
                                  <TextInput style={styles.passwordInput}
                                      placeholder={I18n.t('WalletPassword')}
                                      placeholderTextColor={ Colors.separateLineColor }
                                      underlineColorAndroid={ 'transparent' }
                                      clearButtonMode='while-editing'
                                      secureTextEntry={!isShowPassword}
                                      maxLength={ 20 }
                                      onChangeText={(text) => this._onChangePassword(text)}/>
                              </View>

                          </View>
                          <View style={styles.confirmView}>
                              <TextInput style={styles.section}
                                  placeholder={I18n.t('RepeatPassword')}
                                  placeholderTextColor={ Colors.separateLineColor }
                                  underlineColorAndroid={ 'transparent' }
                                  clearButtonMode='while-editing'
                                  secureTextEntry={!isShowPassword}
                                  maxLength={ 20 }
                                  onChangeText={(text) => this._onChangeConfirm(text)}/>
                              {eyeImg}
                          </View>
                      </View>
                  </View>
                  <View style={styles.botttomSection}>
                      <Button onPress={()=>this._onPressBtn()}
                          textStyle={styles.btnTitle}
                          backgroundColor={isCanPress ? Colors.textColor : Colors.separateLineColor}
                          disabled={!isCanPress}
                          title={I18n.t('Import')}/>
                  </View>
              </ScrollView>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{loading}
    } = state;
    return {
        loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (params) => dispatch(WalletActions.setLoading(params)),
    gethImportMnemonic: (params) => dispatch(WalletActions.gethImportMnemonic(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MnemonicCompont);
