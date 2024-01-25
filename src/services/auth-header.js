export default function authHeader() {
  //Grabs user data local storage
  const userProfile = JSON.parse(localStorage.getItem('auth_code'));
  //If there's a logged in user with JWT return HTTP Authorization
  if (userProfile && userProfile.auth_code) {
    return {
      'x-diyse-access-token': userProfile.auth_code,
      'Content-Type': 'application/json',
       Accept: 'application/json'
   };
  } else {
    return {};
  }
}
