import React, { useEffect, useState } from 'react';
import { Button, Label, Card, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import validator from "validator";
import axios from "axios";

const ForgotPassword = () => {
  const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
  const navigate = useNavigate();

const emptyForgotPasswordEmailData = {
  "email" : ""
}

// Initializing the states
  const [forgotPasswordEmailData, setForgotPasswordEmailData] = useState(emptyForgotPasswordEmailData);
  const [forgotPasswordEmailFormError, setForgotPasswordEmailFormError] = useState("");
  // "isResetPwLinkSentSuccess" will be true once the reset link has been sent to the student's email id
  const [isResetPwLinkSentSuccess, setIsResetPwLinkSentSuccess] = useState(false);
  // "apiCallError" contains any errors occured during api calls or in try-catch
  const [apiCallError, setApiCallError] = useState("");

  // State for handle the disable state of the submit button
  const [disableSubmit, setDisableSubmit] = useState(true);

  // Function for making a POST call requesting the password reset link
  const sendForgotPasswordRequestFun = async (forgotPasswordEmailData) => {
    try{
      await axios.post(`${serverUrl}/api/forgot-password`, forgotPasswordEmailData)
        .then(res => {
          setIsResetPwLinkSentSuccess(true);
          setForgotPasswordEmailData(emptyForgotPasswordEmailData);
          setApiCallError("");
        })
        .catch(err => {
          setApiCallError(err.response.data.message);
          setIsResetPwLinkSentSuccess(false);
        })
    }catch(error){
      setApiCallError(error.message);
      setIsResetPwLinkSentSuccess(false);
    }
  }


  // Function to handle the state changes of "disableSubmit"
  const handleDisableSubmit = () => {
    if(forgotPasswordEmailData.email !=="" && forgotPasswordEmailFormError === ""){
      setDisableSubmit(false);
    }else{
      setDisableSubmit(true);
    }
  }

  useEffect(() => {
    // Calling the "handleDisableSubmit" to set the state of "disableSubmit"
    handleDisableSubmit();
    // eslint-disable-next-line
  }, [forgotPasswordEmailData, forgotPasswordEmailFormError])

// Function for handling the input field changes
  const handleForgotPasswordFormChange = (e) => {
    setForgotPasswordEmailData({...forgotPasswordEmailData, [e.target.name] : e.target.value});

    if(validator.isEmail(e.target.value)){
      setForgotPasswordEmailFormError("");
    }else{
      setForgotPasswordEmailFormError("Enter valid email")
    }

  }

  // Function for handling the onClick even of "Submit" button (form submission)
  const handleSubmitForgotPasswordForm = (e) => {
    e.preventDefault();
    sendForgotPasswordRequestFun(forgotPasswordEmailData);
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
                <Button className='home-page-Button-class' color='info' size='sm' onClick={()=>navigate('/signup')}>Signup</Button>
            </NavItem>
            
          </Nav>
        </Navbar>


        { ! isResetPwLinkSentSuccess ? (
          // If "isResetPwLinkSentSuccess" is false
          // i.e. when the reset link has not been sent yet
          <Card style={{width: '18rem', backgroundColor : "transparent", border : "1px solid white", fontSize: "small"}} >
            <CardBody>
                  <div className='signup-login-link-but-div'>
                    <button className='signup-link-but' onClick={()=>navigate('/signup')}>Signup</button>
                  </div>
                <p className='blue-color-p-class'>Forgot password</p>
                {/* Showing the "apiCallError", if any error occurs */}
                <h6 className='apiCallError-h6-class'>{apiCallError}</h6>


                <p className='suggestion-p-class'>Enter your email id to get a link for resetting your password</p>
                <Label className='Label-class'>Username (email id)</Label>
                <input type='text' name='email' placeholder='Enter email' value={forgotPasswordEmailData.email} onChange={handleForgotPasswordFormChange} />
                <p><span>{forgotPasswordEmailFormError}</span></p>
                
                <Button className='Button-class' size='sm' color='success' disabled={disableSubmit} onClick={handleSubmitForgotPasswordForm} >Submit</Button>
                <Button className='Button-class' size='sm' color='warning' onClick={()=>navigate('/')}>Cancel</Button>
                <br />
                <br />
                <p style={{color : "red", fontSize : "small"}}>After submitting, please wait for some time. </p> 
                <p style={{color : "red", fontSize : "small"}}>It may take some time to create the link and email it.</p>
            </CardBody>
          </Card>
        ) : "" }


      {isResetPwLinkSentSuccess ? (
        // If the "isResetPwLinkSentSuccess" is true
        // i.e. when the reset link has been successfully sent
          <Card style={{width: '18rem'}}>
            <CardBody>
              <h6 className='apiCallSuccess-h6-class'>A link for resetting your password has been sent to your email id.</h6>
              <h6 className='apiCallSuccess-h6-class'>Please click that link to reset your password.</h6>
              <br />
              <br />
              <Button color='warning' size='sm' onClick={()=>navigate('/')}>To home page</Button> 
            </CardBody>
          </Card>
        ) : "" }


    </div>
  )
}

export default ForgotPassword;

