import { takeLatest, all } from 'redux-saga/effects';
import API from '../Services/Api';
import FixtureAPI from '../Services/FixtureApi';
import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */
import { FoundTypes } from '../Redux/FoundRedux';
import { UserTypes } from '../Redux/UserRedux';
import { ConfigTypes } from '../Redux/ConfigRedux';
import { AssetTypes } from '../Redux/AssetRedux';
import { WalletTypes } from '../Redux/WalletRedux';

import { StartupTypes } from '../Redux/StartupRedux';
import { GithubTypes } from '../Redux/GithubRedux';


/* ------------- Sagas ------------- */
import { getBanner } from './FoundSaga';
import { register, getUserInfo } from './UserSaga';
import { getConfig } from './ConfigSaga';
import { getBalance, getTxlist } from './AssetSaga';
import { gethInit, gethNewAccount, gethImportMnemonic, gethImportPrivateKey, gethExportPrivateKey} from './WalletSaga';

import { startup } from './StartupSagas';
import { getUserAvatar } from './GithubSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
    yield all([
        takeLatest(FoundTypes.GET_BANNER_REQUEST, getBanner, api),
        takeLatest(UserTypes.GET_USER_INFO_REQUEST, register, api),
        takeLatest(UserTypes.REGISTER_REQUEST, getUserInfo, api),
        takeLatest(ConfigTypes.GET_CONFIG_REQUEST, getConfig, api),
        takeLatest(AssetTypes.GET_BALANCE_REQUEST, getBalance),
        takeLatest(AssetTypes.GET_TXLIST_REQUEST, getTxlist),
        takeLatest(WalletTypes.GETH_INIT, gethInit),
        takeLatest(WalletTypes.GETH_NEW_ACCOUNT, gethNewAccount),
        takeLatest(WalletTypes.GETH_IMPORT_MNEMONIC, gethImportMnemonic),
        takeLatest(WalletTypes.GETH_IMPORT_PRIVATE_KEY, gethImportPrivateKey),
        takeLatest(WalletTypes.GETH_EXPORT_PRIVATE_KEY, gethExportPrivateKey),


        // some sagas only receive an action
        takeLatest(StartupTypes.STARTUP, startup),
        // some sagas receive extra parameters in addition to an action
        takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api)
    ]);
}
