import { AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { Me } from '../constants/me';

// Cognito用の定数
const poolData = {
  UserPoolId: 'ap-northeast-1_PxckA7qLJ',
  ClientId: '1pmlfc9pdu6l981euag6v2ja2o'
}

const userPool = new CognitoUserPool(poolData);

// 会員登録
export function signUpMe(username, email, password) {
  return ((dispatch) => {
    // 非同期通信前にリクエストActionをDispatch
    dispatch({ type: Me.SIGN_UP_REQUEST });

    // Cognitoへのリクエストパラメータ郡
    let attributeList = [];
    let dataEmail = {
      Name: 'email',
      Value: email
    }
    let attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    // 使ってるCognitoのライブラリがPromise対応してないようなので、こちらでラップ
    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, attributeList, null, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).then(
      // 成功時は成功ActionをDispatch
      (result) => {
        dispatch({ type: Me.SIGN_UP_SUCCESS, username: result.user.username });
      },
      // 失敗時は失敗ActionをDispatch
      (error) => {
        dispatch({ type: Me.SIGN_UP_FAILURE, error });
        return (Promise.reject());
      }
    );
  });
}

// 登録の確認
export function confirmMe(pincode) {
  return ((dispatch, getState) => {
    let username = getState().me.get('username');
    let userData = {
      Username: username,
      Pool: userPool,
    }
    let cognitoUser = new CognitoUser(userData);
    dispatch({ type: Me.CONFIRM_REQUEST });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(pincode, true, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).then(
      (result) => {
        dispatch({ type: Me.CONFIRM_SUCCESS });
      },
      (error) => {
        dispatch({ type: Me.CONFIRM_FAILURE, error });
        return (Promise.reject());
      }
    );
  });
}

// ログイン
export function loginMe(username, password) {
  return ((dispatch) => {
    let authenticationData = {
      Username: username,
      Password: password,
    }
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
      Username: username,
      Pool: userPool,
    }
    let cognitoUser = new CognitoUser(userData);

    dispatch({ type: Me.LOGIN_REQUEST });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (error) => {
          reject(error);
        }
      });
    }).then(
      // 成功時はトークンをローカルストレージに保存して、成功ActionをDispatch
      (result) => {
        let id_token = result.getIdToken().getJwtToken();
        localStorage.setItem('id_token', id_token);
        dispatch({ type: Me.LOGIN_SUCCESS });
      },
      (error) => {
        dispatch({ type: Me.LOGIN_FAILURE, error });
        return (Promise.reject());
      }
    );
  });
}

export function renameMe(name) {
  return (
    {
      type: Me.RENAME,
      name
    }
  );
}
