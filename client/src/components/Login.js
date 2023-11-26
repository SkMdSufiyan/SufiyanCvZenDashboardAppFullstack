import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Card, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import ZenContext from '../contextProvider/ZenContext';


const Login = () => {
  const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
  const navigate = useNavigate();

  // "studentProfile" will have the student profile data once the student is logged in successfully
  // This state is being maintined in "ZenContext.js"
   // "apiCallError" contains any errors occured during api calls or in try-catch
   

  const {setAccessToken, setStudentProfile, apiCallError, setApiCallError, setLogoutMessage} = useContext(ZenContext);


  const emptyLoginFormData = {
    "email" : "",
    "password" : ""
  };

  const demoCredentials = {
    "email" : "sufiyanguvicourse9216@gmail.com",
    "password" : "00000000"
  };

  const emptyLoginFormErrors = {
    "emailError" : ""
  }

   // Initializing the states
  const [loginFormData, setLoginFormData] = useState(emptyLoginFormData);
  const [loginFormErrors, setLoginFormErrors] = useState(emptyLoginFormErrors);
  const [disableSubmit, setDisableSubmit] = useState(true);
   

// Function for making a POST call for login
  const loginStudentFun = async (loginFormData) => {
    try{
      await axios.post(`${serverUrl}/api/login`, loginFormData)
          .then(res => {
            
            localStorage.setItem("accessToken", res.data.accessToken);
              setAccessToken(res.data.accessToken);
              
              localStorage.setItem("studentProfile", JSON.stringify(res.data.studentProfile));            
              setStudentProfile(res.data.studentProfile);
              
              setLoginFormData(emptyLoginFormData);
              setApiCallError("");
                           
              setLogoutMessage("");
              navigate(`/${res.data.studentProfile._id}/dashboard`);
          })
          .catch(err => {
              setApiCallError(err.response.data.message);
          })

    }catch(error){
      setApiCallError(error.message);
    }
  }

// Function to decide the value of "disableSubmit" state
  const handleDisableSubmit = () => {
    // Checking whether any of the mandatory input fields is empty (not filled)
    const emptyInputFields = Object.values(loginFormData).filter(val => val === "" ).length;
    // Checking whether any of the fields of "loginFormErrors" contains error value
    const errorsInTheForm = Object.values(loginFormErrors).filter(val => val !== "" ).length;

    // Changing the state of "disableSubmit"
    if( ! emptyInputFields && ! errorsInTheForm ){
      setDisableSubmit(false);
    }else{
      setDisableSubmit(true);
    }
  }


useEffect(() => {
  // Whenever "loginFormData", "loginFormErrors" changes
  // Calling the "handleDisableSubmit" to set the state of "disableSubmit"
  handleDisableSubmit();
  // eslint-disable-next-line
}, [loginFormData, loginFormErrors]);


// Function for handling the input field changes
  const handleLoginFormChange = (e) => {
    setLoginFormData({...loginFormData, [e.target.name] : e.target.value});

    // Just for validating the email FORMAT
    if(e.target.name === "email"){
      if(validator.isEmail(e.target.value)){
        setLoginFormErrors({...loginFormErrors, "emailError" : ""});
      }else{
        setLoginFormErrors({...loginFormErrors, "emailError" : "Enter valid email" });
      }
    }
    
  }

  // Function for handling the onClick event of submit button (form submission)
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    loginStudentFun(loginFormData);       
  }



  return (
    <div className='component-main-div'>
      <Navbar  expand="md" className='Navbar-class' fixed='top'>
          <Nav className="mr-auto" navbar style={{alignItems : "center"}}>
            <NavItem>
              <h6 style={{color:"white"}}>Zen Student Dashboard</h6>
            </NavItem>
          </Nav>
          <Nav className='ml-auto' navbar style={{alignItems : "center"}}>
            <NavItem>
                <Button className='home-page-Button-class' color='primary' size='sm' onClick={() => navigate('/')}>Home</Button>
            </NavItem>
            
            <NavItem>
                <Button className='home-page-Button-class' color='primary' size='sm' onClick={() => navigate('/forgot-password')}>Reset password</Button>
            </NavItem>
          </Nav>
        </Navbar>
      
      <div className='login-suggestion-div'>
      <p className='app-suggestion-p'>Click the button below for demo credentials !</p>
      <Button className='home-page-Button-class' size='sm' color='warning' onClick={()=>setLoginFormData(demoCredentials)}>Demo Credentials</Button>
      </div>


            <Card style={{width: '18rem', backgroundColor : "transparent", border : "1px solid white", fontSize: "small"}}>
            <br />
                    <span>After submitting the login form, kindly wait for some time, it may take some time to process.</span>
                <CardBody>
                
                  <div className='signup-login-link-but-div'>
                    <button className='signup-link-but' onClick={()=>navigate('/signup')}>Signup</button>
                  </div>
                    <p className='blue-color-p-class'>Login</p>
                    {/* Showing the "apiCallError", if any error occurs */}
                    <h6 className='apiCallError-h6-class'>{apiCallError}</h6>


                    <Label className='Label-class'>Email</Label><span>*</span>
                    <input type="text" name='email' placeholder='Enter email' value={loginFormData.email} onChange={handleLoginFormChange} />
                    <p><span>{loginFormErrors.emailError}</span></p>

                    
                    <Label className='Label-class'>Password</Label><span>*</span>
                    <input type="password" name='password' placeholder='Enter password' value={loginFormData.password} onChange={handleLoginFormChange} />
                    <br />
                    <br />

                    <Button className='Button-class' size='sm' color='success' disabled={disableSubmit} onClick={handleSubmitLogin}>Submit</Button>
                    <Button className='Button-class' size='sm' color='warning' onClick={()=>navigate('/')}>Cancel</Button>
                    <button className='forgot-pw-link-but' onClick={()=>navigate('/forgot-password')}>Forgot password?</button>
                </CardBody>
            </Card>
        

        <br />
        <br />

    </div>
  )
}

export default Login;

