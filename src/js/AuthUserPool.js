import { CognitoUserPool } from 'amazon-cognito-identity-js';

// Cognito用の定数
const poolData = {
  UserPoolId: 'ap-northeast-1_PxckA7qLJ',
  ClientId: '1pmlfc9pdu6l981euag6v2ja2o'
}

export const userPool = new CognitoUserPool(poolData);
