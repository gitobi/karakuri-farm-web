import { AuthenticationDetails, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { Me } from '../constants/me';
import { userPool } from '../js/AuthUserPool';
import { parseCognitoErrorMessage } from './actionUtils'

export function getCurrentMe() {
  let isAuthenticated = false;
  let cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    isAuthenticated = true;
  }
  return ({ type: Me.GET_CURRENT, isAuthenticated });
}

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
        // console.log("signUpMe", result);
        dispatch({ type: Me.SIGN_UP_SUCCESS, username: result.user.username });
      },
      // 失敗時は失敗ActionをDispatch
      (error) => {
        dispatch({ type: Me.SIGN_UP_FAILURE, error });
        return (Promise.reject(parseCognitoErrorMessage(error.message)));
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
    dispatch({ type: Me.CONFIRM_REQUEST });

    return new Promise((resolve, reject) => {
      let cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmRegistration(pincode, false, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).then(
      (result) => {
        // console.log("confirmMe", result);
        dispatch({ type: Me.CONFIRM_SUCCESS });
      },
      (error) => {
        dispatch({ type: Me.CONFIRM_FAILURE, error });
        return (Promise.reject(parseCognitoErrorMessage(error.message)));
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
      (result) => {
        // console.log("loginMe", result);
        dispatch({ type: Me.LOGIN_SUCCESS, username: username });
      },
      (error) => {
        dispatch({ type: Me.LOGIN_FAILURE, error });
        return (Promise.reject(parseCognitoErrorMessage(error.message)));
      }
    );
  });
}

// ログアウト
export function logoutMe() {
  let cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    cognitoUser.signOut();
  }

  return ({ type: Me.LOGOUT });
}

export function renameMe(name) {
  return (
    {
      type: Me.RENAME,
      name
    }
  );
}
