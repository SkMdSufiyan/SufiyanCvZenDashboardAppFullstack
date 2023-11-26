import React, { useEffect, useState } from 'react';
import { Button, Label, Card, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import validator from "validator";
import axios from "axios";

// This component displays the signup page
const Signup = () => {

    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();

    const emptySignupFormData = {
        "email" : "",
        "firstName" : "",
        "lastName" : "",
        "password" : ""
    };

    const emptySignupFormErrors = {
        "emailError" : "",
        "firstNameError" : "",
        "lastNameError" : "",
        "passwordError" : ""
    }

    // Initializing the states
    const [signupFormData, setSignupFormData] = useState(emptySignupFormData);
    const [signupFormErrors, setSignupFormErrors] = useState(emptySignupFormErrors);
    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(false);

    // "isSignupSuccess" will be true if the student registration is successfull
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);
    // "apiCallError" contains any errors occured during api calls or in try-catch
    const [apiCallError, setApiCallError] = useState("");


    // Function for making a post request to add a new student
    const addNewStudentFun = async (signupFormData) => {
        try{
            await axios.post(`${serverUrl}/api/signup`, signupFormData)
                .then(res => {
                    setIsSignupSuccess(true);
                    setSignupFormData(emptySignupFormData);
                    setApiCallError("");
                })
                .catch(err => {
                    setApiCallError(err.response.data.message);
                    setIsSignupSuccess(false);
                })
        }catch(error){
            setApiCallError(error.message);
            setIsSignupSuccess(false);
        }
    }


    // Function for handling the state of "isAllValidData"
    const declareAllValidDataFunction = () => {
        // Checking whether any of the mandatory input fields is empty (not filled)
        const emptyInputFields = Object.values(signupFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "signupFormErrors" contains error value
        const errorsInTheForm = Object.values(signupFormErrors).filter(val => val !== "").length;

        // Changing the state of "isAllValidData"
        if( ! emptyInputFields && ! errorsInTheForm ){
            setIsAllValidData(true);  
        }else{
            setIsAllValidData(false);
        }

    }


    useEffect(() => {
         // Calling the function "declareAllValidDataFunction" to set the state of "isAllValidData", based on which submit button will be disabled or enabled
        declareAllValidDataFunction();
        // eslint-disable-next-line
    }, [signupFormData, signupFormErrors]);


    // Function for handling the input field changes
    const handleSignupFormChange = (e) => {
        setSignupFormData({...signupFormData, [e.target.name] : e.target.value});


        // Validating email field
        if(e.target.name === "email"){
            if(validator.isEmail(e.target.value)){
                setSignupFormErrors({...signupFormErrors, "emailError" : ""});
            }else{
                setSignupFormErrors({...signupFormErrors, "emailError" : "Enter a valid email id"});
            }
        }

        // Validating firstName field
        if(e.target.name === "firstName"){
            if(validator.isLength(e.target.value.trim(), {"min" : 3}) && ! validator.isEmpty(e.target.value)){
                setSignupFormErrors({...signupFormErrors, "firstNameError" : "" });
            }else{
                setSignupFormErrors({...signupFormErrors, "firstNameError" : "Should contain atleast 3 characters"});
            }
        }

        // Validating lastName field
        if(e.target.name === "lastName"){
            if( ! validator.isEmpty(e.target.value )){
                setSignupFormErrors({...signupFormErrors, "lastNameError" : "" });
            }else{
                setSignupFormErrors({...signupFormErrors, "lastNameError" : "Last name is required"});
            }
        }

        // Validating password field
        if(e.target.name === "password"){
            if(validator.isLength(e.target.value.trim(), {"min" : 8}) && ! validator.isEmpty(e.target.value)){
                setSignupFormErrors({...signupFormErrors, "passwordError" : ""});
            }else{
                setSignupFormErrors({...signupFormErrors, "passwordError" : "Should contain minimum 8 characters (no white spaces)"});
            }
        }


    }

    //  Function for handling the onClick event of submit button (form submission)
    const handleSubmitSignupForm = (e) => {
        e.preventDefault();
        addNewStudentFun(signupFormData);
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
                <Button className='home-page-Button-class' color='info' size='sm' onClick={()=>navigate('/login')}>Login</Button>
            </NavItem>
          </Nav>
        </Navbar>
        


            
            { ! isSignupSuccess ? (
                // If the signup is not successful yet
                // Showing the signup form
                
                <Card style={{width: '20rem', backgroundColor : "transparent", border : "1px solid white", fontSize: "small"}}>
                    <br />
                    <span>After submitting the signup form, kindly wait for some time, it may take some time to process.</span>
                    <CardBody>
                        <div className='signup-login-link-but-div'>
                            <button className='login-link-but' onClick={()=>navigate('/login')}>Login</button>
                        </div>
                        <p className='blue-color-p-class'>Signup</p>
                        {/* Showing the "apiCallError", if any error occurs */}
                        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

                        {/* Signup form */}
                        
                        <Label className='Label-class'>Username (email)</Label><span>*</span>
                        <input type='text' placeholder='Enter email' name='email' value={signupFormData.email} onChange={handleSignupFormChange} />
                        <p><span>{signupFormErrors.emailError} </span></p>
                        

                        <Label className='Label-class'>First name</Label><span>*</span>
                        <input type='text' placeholder='Enter first name' name='firstName' value={signupFormData.firstName} onChange={handleSignupFormChange} />
                        <p><span>{signupFormErrors.firstNameError} </span></p>
                        

                        <Label className='Label-class'>Last name</Label><span>*</span>
                        <input type='text' placeholder='Enter last name' name='lastName' value={signupFormData.lastName} onChange={handleSignupFormChange} />
                        <p><span>{signupFormErrors.lastNameError} </span></p>
                        
                        
                        <Label className='Label-class'>Password</Label><span>*</span>
                        <input type='password' placeholder='Enter password' name='password' value={signupFormData.password} onChange={handleSignupFormChange} />
                        <p><span>{signupFormErrors.passwordError} </span></p>
                                           
                        

                        <Button className='Button-class' size='sm' color='success' disabled={ ! isAllValidData } onClick={handleSubmitSignupForm}>Submit</Button>
                        <Button className='Button-class' size='sm' color='warning' onClick={()=>navigate('/')}>Cancel</Button>
                    </CardBody>
                </Card>    
                 
            ) : "" }  


            { isSignupSuccess ? (
                // If the signup form is submitted and the student is registered successfully
                <Card style={{width: '18rem'}}>
                    <CardBody>
                        <h6 className='apiCallSuccess-h6-class'>Your are registered successfully.</h6>
                        <br />
                        <h6 className='apiCallSuccess-h6-class'>Kindly activate your account through the link sent to your registered email id.</h6>
                        <br />
                        <h6 className='apiCallSuccess-h6-class'>You will be able to login only after activating your account.</h6>
                        <br />
                        <br />
                        <Button color='primary' onClick={()=>navigate('/')}>To home page</Button>
                    </CardBody>
                </Card>
            ) : "" }

        <br />
        <br />
    </div>
  )
}

export default Signup;







