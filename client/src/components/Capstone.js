import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import ZenContext from '../contextProvider/ZenContext';
import validator from "validator";

const Capstone = () => {

    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();
    const {studentID} = useParams();


    const {accessToken, studentProfile, apiCallError, setApiCallError, logoutStudentFun, config, setStudentProfile} = useContext(ZenContext);


    // When the component is mounted
    useEffect(() => {
      if( ! accessToken){
          // If there is no accessToken, then navigating to login page
          navigate('/login');
      }

      // eslint-disable-next-line
    }, [] );


    const todayDate = new Date().toLocaleDateString();
    const emptyCapstoneFormdata = {
      "submittedDate" : todayDate,
      "link" : ""
    };

    // Initializing states

    const [capstoneFormData, setCapstoneFormData] = useState(emptyCapstoneFormdata);
    
    const [capstoneFormErrors, setCapstoneFormErrors] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);


    const [capstoneSubmittedDate, setCapstoneSubmittedDate] = useState("");
    const [capstoneSubmittedLink, setCapstoneSubmittedLink] = useState(() => {
        if(studentProfile.capstone.length > 0){
            setCapstoneSubmittedDate(studentProfile.capstone[0].submittedDate)
            return studentProfile.capstone[0].link;
        }else{
            return "";
        }
    });


    useEffect(() => {
        setCapstoneSubmittedLink(() => {
            if(studentProfile.capstone.length > 0){
                setCapstoneSubmittedDate(studentProfile.capstone[0].submittedDate)
                return studentProfile.capstone[0].link;
            }else{
                return "";
            }
        });
        // eslint-disable-next-line
    }, [studentProfile]);


   
    const declareAllValidDataFunction = () => {
      // Checking whether any of the mandatory input fields is empty (not filled)
      const emptyInputFields = Object.values(capstoneFormData).filter(val => val === "").length;
      // Checking whether any of the fields of "profileFormErrors" contains error value
      const errorsInTheForm = capstoneFormErrors !== "";
      // Changing the state of "isAllValidData"
      if( ! emptyInputFields && ! errorsInTheForm ){
          setDisableSubmit(false);  
      }else{    
          setDisableSubmit(true);     
      }
    }


// "getStudentProfile" function gets the updated student profile data
    const getStudentProfile = async (id) => {
      try{
          await axios.get(`${serverUrl}/api/${id}/students/${id}`, config)
          .then(res => {
            const studentDat = {...res.data.data};
          //   Deleting the "hashedPassword" from the student data
            delete studentDat.hashedPassword;
          //   Storing the "studentDat" in the localStorage as new "studentProfile"
            localStorage.setItem('studentProfile', JSON.stringify(studentDat));
            setStudentProfile(studentDat);

            setApiCallError("");
          })
          .catch(err => {
            setApiCallError(err.response.data.message);
          })
      }catch(error){
        setApiCallError(error.message);
      }
    } 


// "submitStudentCapstone" function submits the capstone form data (link) to the database
    const submitStudentCapstone = async(capstoneFormData) => {
      try{
          const id = studentProfile._id;
          const alreadySubmitedCapstoneArray = studentProfile.capstone;
          alreadySubmitedCapstoneArray.push(capstoneFormData);
          const newSubmittedCapstoneField = {"capstone" : alreadySubmitedCapstoneArray}

              await axios.put(`${serverUrl}/api/${id}/students/${id}`, newSubmittedCapstoneField, config)
                  .then(res => { 

                      setCapstoneSubmittedLink(capstoneFormData.link);
                        setCapstoneFormData({...capstoneFormData, "link" : ""});
                  
                      getStudentProfile(id);
                      
                      setApiCallError("");
                  })
                  .catch(err => {
                      setApiCallError(err.response.data.message);
                  })
      }catch(error){
          setApiCallError(error.message);
      }
    }

// "handleCapstoneFormChange" function handles the changes in the input field (of capstone link)
    const handleCapstoneFormChange = (e) => {
      setCapstoneFormData({...capstoneFormData, "link" : e.target.value});
      
      if(validator.isURL(e.target.value)){
        setCapstoneFormErrors("");
      }else{
        setCapstoneFormErrors("Enter valid URL");
      }
    }


// Function for handling the onClick event of submit button
    const handleCapstoneFormSubmit = (e) => {
      e.preventDefault();
      submitStudentCapstone(capstoneFormData);
    }


    useEffect(() => {
      declareAllValidDataFunction();
      // eslint-disable-next-line
    }, [capstoneFormData, capstoneFormErrors]);



  return (
    <div>
        <Navbar  expand="md" className='Navbar-class' fixed='top'>
            <Nav className="mr-auto" navbar style={{alignItems : "center"}}>
                <NavItem>
                <h6 style={{color:"white"}}>Zen student dashboard</h6>
                </NavItem>
            </Nav>
            <Nav className='ml-auto' navbar style={{alignItems : "center"}}>
                <NavItem style={{color : "white"}}>
                {studentProfile.email}
                </NavItem>
                <NavItem>
                    <Button className='home-page-Button-class' color='warning' size='sm' onClick={logoutStudentFun}>Log Out</Button>
                </NavItem>
            </Nav>
        </Navbar>


        <div className="sidebar">
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/class`)}>Class</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/dashboard`)}>Dashboard</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/tasks`)}>Tasks</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/webcode`)}>Webcode</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/capstone`)}>Capstone</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/queries`)}>Queries</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/portfolio`)}>Portfolio</Button>
            <Button className='sidebar-buttons' size='sm' style={{backgroundColor : "rgb(211, 139, 6)", color: "rgb(49, 46, 46)"}} onClick={()=>navigate(`/${studentID}/leaderboard`)}>Leaderboard</Button>

        </div>

        <p className='blue-color-p-class'>Capstone submissions</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

                
                <div className='webcode-submission-div'>
                <p className='actvities-p'>Capstone</p>
                        <div>
                            {capstoneSubmittedLink ? 
                            // If the capstone is already submiited
                            // Displaying the submitted link
                            <div>
                                <input className='webcode-submit-input' placeholder="Enter valid link of capstone source code" type='text' disabled={true} value={capstoneSubmittedLink}/>
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' size='sm' disabled={true}>Submit</Button></div>
                                <span>Submitted link: <a href={capstoneSubmittedLink} target='_blank' rel="noopener noreferrer">{capstoneSubmittedLink}</a></span>
                                <br />
                                <span>Submitted on: {capstoneSubmittedDate}</span>
                            </div>

                            : 
                            // If the capstone is not yet submitted
                            // Displaying the form for submission
                            <div>
                                <input className='webcode-submit-input' placeholder="Enter valid link of capstone source code" type='text' value={capstoneFormData.link} onChange={handleCapstoneFormChange}/>
                                <span>{capstoneFormErrors}</span>
                                <br />
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' size='sm' onClick={handleCapstoneFormSubmit} disabled={disableSubmit}>Submit</Button></div>
                            </div>
                        }
                        </div>                  
                </div>

                <br />                                          
                <br />
                <br />
                <br />     
    </div>
  )
}


export default Capstone;


