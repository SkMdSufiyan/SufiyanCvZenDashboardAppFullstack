import React, { useEffect, useState } from 'react';
import ZenContext from './ZenContext';
import { useNavigate } from 'react-router-dom';

const ZenProvider = (props) => {
    const navigate = useNavigate();
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const monitorTimeInterval = 2*60*1000; // The time interval after which this application monitor the localStorage for accessToken


    // "apiCallError" contains any errors occured during api calls or in try-catch
    const [apiCallError, setApiCallError] = useState("");

    const [logoutMessage, setLogoutMessage] = useState("");


    // Once the student is logged in, the accessToken, studentProfile will be stored in localStorage (login component will do that once the student signed in)
    // After that the this "ZenProvider" will monitor the localStorage for accessToken
    // That accessToken will be maintined in this "accessToken" state
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "" );

    // "studentProfile" will have the student data once the student is logged in successfully
    const [studentProfile, setStudentProfile] = useState(JSON.parse(localStorage.getItem("studentProfile")) || {});


// A function to update the "accessToken" as well as "studentProfile" from localStorage
    const updateAccessToken = () => {
      const token = localStorage.getItem("accessToken");
      if(! token) {
        navigate('/login');
      }
      setAccessToken(token);
      setStudentProfile(JSON.parse(localStorage.getItem("studentProfile")));
     
    }


    useEffect(() => {
        // setInterval to monitor access token (by calling the "updateAccessToken" function in regular intervals)
        const interval = setInterval(updateAccessToken, monitorTimeInterval);                

        // Now set interval to run the update function after every few minutes
        // Here do NOT give the parenthesis after the function; needs to give just reference of the function
              
      // Clearing the interval (when the "ZenProvider" component is unmounted)
        return () => clearInterval(interval);
        
        // eslint-disable-next-line
    }, []);


    
// "config" for sending the access token in headers for the API calls (for server side authentication)
const config = {
  "headers" : {
    "Authorization" : `Bearer ${accessToken}`
  }
};


// Function for logout (this function will clear the "accessToken" and "studentProfile" from the localStorage)
const logoutStudentFun = () => {
      try{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('studentProfile');

        setAccessToken("");
        setStudentProfile({});
 

        // Setting the successful logout message
        setLogoutMessage("Signed out successfully");
        setApiCallError("");
        navigate('/');
        
      }catch(error){
        setApiCallError(error.message);
      }
}



  return (
    <ZenContext.Provider value={{accessToken, setAccessToken, studentProfile, setStudentProfile, apiCallError, setApiCallError, logoutMessage, setLogoutMessage, logoutStudentFun, config, serverUrl}}>
        {props.children}
    </ZenContext.Provider>
  )
}

export default ZenProvider;


