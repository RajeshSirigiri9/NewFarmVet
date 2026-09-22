import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token, uid) => {},
  logout: () => {},
  Gmail: "",
  mailsetter: (Gmail) => {},
  otpLoginName: "",
  LoginNameSetter: (otpLoginName) => {},
  phoneNumber: "",
  phoneNumberSetter: (phoneNumber) => {},
  uid: "",
  userData: null,
  setUserData: (userData) => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [uid, setUid] = useState();
  const [mail, setMail] = useState();
  const [loginName, setLoginName] = useState();
  const [phone, setPhone] = useState();
  const [userData, setUserData] = useState(null);

  function authenticate(token, userId) {
    setAuthToken(token);
    setUid(userId);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("uid", userId);
  }

  function logout() {
    setAuthToken(null);
    setUid(null);
    setUserData(null);
    setMail(null);
    setLoginName(null);
    setPhone(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("userData");
    AsyncStorage.removeItem("displayName");
    AsyncStorage.removeItem("phoneNumber");
    AsyncStorage.removeItem("userEmail");
    AsyncStorage.removeItem("isAdmin");
  }

  function mailsetter(Gmail) {
    setMail(Gmail);
  }

  function LoginNameSetter(otpLoginName) {
    setLoginName(otpLoginName);
  }

  function phoneNumberSetter(phoneNumber) {
    setPhone(phoneNumber);
  }

  const value = {
    token: authToken,
    uid: uid,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    Gmail: mail,
    mailsetter: mailsetter,
    otpLoginName: loginName,
    LoginNameSetter: LoginNameSetter,
    phoneNumber: phone,
    phoneNumberSetter: phoneNumberSetter,
    userData: userData,
    setUserData: setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
