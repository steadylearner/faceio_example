import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import faceIO from '@faceio/fiojs';

import { FIO_APPLICATION_PUBLIC_ID } from "../environment";
import { apiLogin, apiLogout } from "../api/v1/user";

const AuthenticationContext = createContext({});

const handleFioError = (error) => {
  // Log all possible error codes during user interaction..
  // Refer to https://faceio.net/integration-guide#error-codes, https://faceio.net/getting-started
  
  switch (error) {
  case error.PERMISSION_REFUSED:
    return "Access to the Camera stream was denied by the end user";
  case error.NO_FACES_DETECTED:
    return "No faces were detected during the enroll or authentication process";
  case error.UNRECOGNIZED_FACE:
    return "Unrecognized face on this application's Facial Index";
  case error.MANY_FACES:
    return "Two or more faces were detected during the scan process";
  case error.FACE_DUPLICATION:
    return "User enrolled previously (facial features already recorded). Cannot enroll again!";
  case error.PAD_ATTACK:
    return "Presentation (Spoof) Attack (PAD) detected during the scan process";
  case error.FACE_MISMATCH:
    return "Calculated Facial Vectors of the user being enrolled do not matches";
  case error.WRONG_PIN_CODE:
    return "Wrong PIN code supplied by the user being authenticated";
  case error.PROCESSING_ERR:
    return "Server side error";
  case error.UNAUTHORIZED:
    return "Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information";
  case error.TERMS_NOT_ACCEPTED:
    return "Terms & Conditions set out by FACEIO/host application rejected by the end user";
  case error.UI_NOT_READY:
    return "The FACEIO Widget could not be (or is being) injected onto the client DOM";
  case error.SESSION_EXPIRED:
    return "Client session expired. The first promise was already fulfilled but the host application failed to act accordingly";
  case error.TIMEOUT:
    return "Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)";
  case error.TOO_MANY_REQUESTS:
    return "Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications";
  case error.EMPTY_ORIGIN:
    return "Origin or Referer HTTP request header is empty or missing";
  case error.FORBIDDDEN_ORIGIN:
    return "Domain origin is forbidden from instantiating fio.js";
  case error.FORBIDDDEN_COUNTRY:
    return "Country ISO-3166-1 Code is forbidden from instantiating fio.js";
  case error.SESSION_IN_PROGRESS:
    return "Another authentication or enrollment session is in progress";
  case error.NETWORK_IO:
  default:
    return "Error while establishing network connection with the target FACEIO processing node";
  }
};

export const AuthenticationProvider = ({ children }) => {
  const router = useRouter();

  const [fio, setFio] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setFio(new faceIO(FIO_APPLICATION_PUBLIC_ID));
    // alert(process.env.NEXT_PUBLIC_FIO_APPLICATION_PUBLIC_ID);

    toast.info("Connected to faceio");
  }, []);

  async function restartSession() {
    const restarted = await fio.restartSession({});
    return restarted;
  }

  async function enrollNewUser(name, email) {
    // alert(JSON.stringify({
    //   name,
    //   email,
    // }));

    try {
      const userInfo = await fio.enroll({
        "locale": "auto", // Default user locale

        // This will be from userData at authenticateUser
        // No need for this part?
        "payload": {
          name,
          email,
        }
      });

      // Send this to queries?
      // Use userInfo.facialId (this is equal to the payload) and save details at the database
      const message = `
        User Successfully Enrolled! Details:
        Unique Facial ID: ${userInfo.facialId} 
        Enrollment Date: ${userInfo.timestamp}
        Gender: ${userInfo.details.gender}
        Age Approximation: ${userInfo.details.age}
      `;

      toast.info(message);

    } catch (error) {
      console.error(error);
      toast.error(handleFioError(error));

      const restarted = await restartSession();
    }

  }

  async function authenticateUser() {
    try {
      const userData = await fio.authenticate({
        "locale": "auto", // Default user locale
      });
      
      const { facialId } = userData;
      const { user, error } = await apiLogin(facialId);

      // alert(facialId);

      if (error) {
        toast.error(error);
        return;
      }

      if (user) {
        // alert(JSON.stringify(user));
        setUser(user);
      }

      // console.log("response");
      // console.log(response);
      // alert(JSON.stringify(response));

      // console.log("Success, user identified");
      // // Grab the facial ID linked to this particular user which will be same
      // // for each of his successful future authentication. FACEIO recommend 
      // // that your rely on this Facial ID if you plan to uniquely identify 
      // // all enrolled users on your backend for example.
      // console.log("Linked facial Id: " + userData.facialId);
      // // Grab the arbitrary data you have already linked (if any) to this particular user
      // // during his enrollment via the payload parameter of the enroll() method.
      // console.log("Payload: " + JSON.stringify(userData.payload)); // {"whoami": 123456, "email": "john.doe@example.com"} from the enroll() example above

    } catch (error) {
      console.error(error);
      toast.error(handleFioError(error));

      const restarted = await restartSession();
    }
    
  }

  async function logout () {
    try {
      await apiLogout();
  
      setUser(null);
      const restarted = await restartSession();

      router.push("/");

    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  }

  // There should be api to delete the app after login also
  // remove user?

  return (
    <AuthenticationContext.Provider value={{
      restartSession, 

      enrollNewUser, // sign in
      authenticateUser, // sign up

      user,
      setUser,
      
      logout
    }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);