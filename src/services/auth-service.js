import axios from 'axios';
import settings from './settings';

//Data that will be sent to api for registering a new user.
const register = (email, password, password_repeat, over_eighteen, referral_code) => {
  return axios
  .post(settings.base_url + "register", {
    email,
    password,
    password_repeat,
    over_eighteen,
    referral_code
  }).catch(function (error) {
      throw(error.response);
    }
  );
};

// Forgot Password - send link
const forgot_password = (email) => {
  return axios
  .post(settings.base_url + "send_password_reset", {
    email,
  });

};

//Verifies the email link with a token
const accverify = (verification_code) => {
  return axios
  .get(`${settings.base_url}account_verification/${verification_code}`,
    {headers: {
      'Content-Type': 'application/json',
       Accept: 'application/json',
    },
  })
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    //console.log(error.config);
    throw(error.response);
  });
};

//Updates password for user with a valid token
const forgotverify = (email, password, password_repeat, forgot_password_code) => {
  return axios
  .post(`${settings.base_url}password_reset`, {
    email: email,
    password: password,
    password_repeat: password_repeat,
    validation_code: forgot_password_code,
  })
  .catch(function (error) {
    throw(error.response);
  });
};

const getTos = () => {
  return axios
  .get(`${settings.base_url}get_tos`);
};

const exports = {
  register,
  accverify,
  forgot_password,
  forgotverify,
  getTos
};

export default exports;
