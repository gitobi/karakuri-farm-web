import { CognitoUserPool } from 'amazon-cognito-identity-js';

// Cognito用の定数
const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID
}

export const userPool = new CognitoUserPool(poolData);
