import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Me } from '../constants/me';

// Cognito用の定数
const poolData = {
  UserPoolId: 'ap-northeast-1_PxckA7qLJ',
  ClientId: '1pmlfc9pdu6l981euag6v2ja2o'
}

const userPool = new CognitoUserPool(poolData);

// 非同期に会員登録
export function signUpMe(username, email, password) {
  return function(dispatch) {
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
      userPool.signUp(username, password, attributeList, null, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).then(
      // 成功時は成功ActionをDispatch
      result => dispatch({ type: Me.SIGN_UP_SUCCESS, username: result.user.username }),
      // 失敗時は失敗ActionをDispatch
      error => dispatch({ type: Me.SIGN_UP_FAILURE, error })
    );
  }
}

export function renameMe(name) {
  return(
    {
      type: Me.RENAME,
      name
    }
  );
}
