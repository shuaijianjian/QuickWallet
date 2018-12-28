import React, { Component } from 'react';
import {Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button, Avatar } from 'react-native-elements';
import styles from './Styles/AccountScreenStyle';
import { View } from 'react-native-animatable';
import {AccountConfig} from '../Config/MineConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Metrics , Colors } from '../Themes';
import QRCode from 'react-native-qrcode-svg';
import { NavigationActions } from 'react-navigation';
import WalletActions from '../Redux/WalletRedux';
import I18n from '../I18n';
import PassphraseInputAlert from '../Components/PassphraseInputAlert';

class AccountScreen extends Component {
  static navigationOptions = {
      title:I18n.t('AccountTabTitle'),
      backgroundColor: 'red',
  }

  constructor(props){
      super(props);
      this.state={
          isInit:false,
      };
  }

  _onPressCancel=()=>{
      this.setState({ isInit:false });
  }
  _onPressConfirm=(passphrase)=>{
      this.setState({ isInit:false });
      // TODO 验证密码是否有效
      this.props.gethUnlockAccount({passphrase});
      // 判断解锁后
      this.props.navigate('ExportScreen', {passphrase});
  }

  _onPressBackup=()=>{
      this.setState({ isInit:true });
  }

  _onPressLogOut=()=>{
      console.log('===========_onPressLogOut=========================');

  }

  _onPressCopy=()=>{
      console.log('===========_onPressCopy=========================');
  }

  render () {
      const settings = {'avatar':'', 'account':'1号', 'inviteCode':'2b4a4'};
      const avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg';
      const address = '0xdadadadadmdafnanjadnajanddadad';
      const {isInit} = this.state;


      const infoView = Object.values(AccountConfig).map((config, index)=>{
          const { key='' } = config;
          config.details = settings[key];
          const { title='', type=1, details='' } = config;

          const rightView = type === 1 ? <Avatar small rounded source={{uri: avatar_url}}/> : <Text style={styles.detailsStyle}>{details}</Text>;
          return (<View key={index} style={styles.itemView}>
              <Text style={styles.titleStyle}>{title}</Text>
              {rightView}
          </View>);
      });

      return (
          <View style={styles.container}>
              <PassphraseInputAlert isInit={isInit} onPressCancel={()=>this._onPressCancel()} onPressConfirm={(password)=>this._onPressConfirm(password)}/>
              <View style={styles.topSection}>
                  {infoView}
              </View>
              <View style={styles.centerSection}>
                  <View style={styles.addressSection}>
                      <Text style={styles.address} numberOfLines={1}>{address}</Text>
                      <TouchableOpacity onPress={()=>this._onPressCopy}>
                          <FontAwesome name={'copy'} size={Metrics.icons.small} color={Colors.textColor}/>
                      </TouchableOpacity>
                  </View>
                  <QRCode value={avatar_url} size={120}/>
              </View>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBackup()}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.backupTitle}
                      title='备份此账户'/>
                  <Button onPress={()=>this._onPressLogOut()}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.logOutTitle}
                      title='退出登录'/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
