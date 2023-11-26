import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import ZenContext from '../contextProvider/ZenContext';
import validator from "validator";


const Webcodes = () => {
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
    const emptyWebcode_1_Formdata = {
      "webcodeNum" : 1,
      "submittedDate" : todayDate,
      "link" : ""
    };

    const emptyWebcode_2_Formdata = {
      "webcodeNum" : 2,
      "submittedDate" : todayDate,
      "link" : ""
    }

    // Initializing the states for form data and form error for the two webcodes seperately
    const [webcode_1_FormData, setWebcode_1_FormData] = useState(emptyWebcode_1_Formdata);
    const [webcode_2_FormData, setWebcode_2_FormData] = useState(emptyWebcode_2_Formdata);
    
    const [webcode_1_FormErrors, setWebcode_1_FormErrors] = useState("");
    const [disableSubmit_1, setDisableSubmit_1] = useState(true);

    const [webcode_2_FormErrors, setWebcode_2_FormErrors] = useState("");
    const [disableSubmit_2, setDisableSubmit_2] = useState(true);

    // "alreadySubmittedWebcodesNums" will have the numbers (1 or 2) of the submitted webcodes
    const [alreadySubmittedWebcodesNums, setAlreadySubmittedWebcodesNums] = useState(studentProfile.webcodes.map(val => Number(val.webcodeNum)));

    // webcode_1_SubmittedDate, webcode_2_SubmittedDate will have the date of submission, if the webcodes are submitted
    // webcode_1_SubmittedLink, webcode_2_SubmittedLink will have the submitted links, if the webcodes are submitted
    const [webcode_1_SubmittedDate, setWebcode_1_SubmittedDate] = useState("");
    const [webcode_1_SubmittedLink, setWebcode_1_SubmittedLink] = useState(() => {
      const matchedArray = studentProfile.webcodes.filter(val => val.webcodeNum === 1);
      if(matchedArray.length > 0){
        setWebcode_1_SubmittedDate(matchedArray[0]["submittedDate"]);
        return matchedArray[0].link;
      }else{
        return "";
      }
    });


    const [webcode_2_SubmittedDate, setWebcode_2_SubmittedDate] = useState("");
    const [webcode_2_SubmittedLink, setWebcode_2_SubmittedLink] = useState(() => {
      const matchedArray = studentProfile.webcodes.filter(val => val.webcodeNum === 2);
      if(matchedArray.length > 0){
        setWebcode_2_SubmittedDate(matchedArray[0]["submittedDate"]);
        return matchedArray[0].link;
      }else{
        return "";
      }
    });


// Updating some states whenever the student profile changes
    useEffect(() => {
      setWebcode_1_SubmittedLink(() => {
        const matchedArray = studentProfile.webcodes.filter(val => val.webcodeNum === 1);
        if(matchedArray.length > 0){
          setWebcode_1_SubmittedDate(matchedArray[0]["submittedDate"]);
          return matchedArray[0].link;
        }else{
          return "";
        }
      });

      setWebcode_2_SubmittedLink(() => {
        const matchedArray = studentProfile.webcodes.filter(val => val.webcodeNum === 2);
        if(matchedArray.length > 0){
          setWebcode_2_SubmittedDate(matchedArray[0]["submittedDate"]);
          return matchedArray[0].link;
        }else{
          return "";
        }
      });

      // eslint-disable-next-line
    }, [studentProfile]);

    
  const declareAllValidDataFunction_1 = () => {
    // Checking whether any of the mandatory input fields is empty (not filled)
    const emptyInputFields = Object.values(webcode_1_FormData).filter(val => val === "").length;
    // Checking whether any of the fields of "profileFormErrors" contains error value
    const errorsInTheForm = webcode_1_FormErrors !== "";
    // Changing the state of "isAllValidData"
    if( ! emptyInputFields && ! errorsInTheForm ){
        setDisableSubmit_1(false);  
    }else{    
        setDisableSubmit_1(true);     
    }
  }


  const declareAllValidDataFunction_2 = () => {
    // Checking whether any of the mandatory input fields is empty (not filled)
    const emptyInputFields = Object.values(webcode_2_FormData).filter(val => val === "").length;
    // Checking whether any of the fields of "profileFormErrors" contains error value
    const errorsInTheForm = webcode_2_FormErrors !== "";
    // Changing the state of "isAllValidData"
    if( ! emptyInputFields && ! errorsInTheForm ){
        setDisableSubmit_2(false);  
    }else{    
        setDisableSubmit_2(true);     
    }
  }


// Function to get the student profile data when required
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


// Function to submit the webcode to the database
  const submitStudentWebcode = async(webcodeFormData) => {
    try{
        const id = studentProfile._id;
        const alreadySubmitedWebcodesArray = studentProfile.webcodes;
        alreadySubmitedWebcodesArray.push(webcodeFormData);
        const newSubmittedWebcodesField = {"webcodes" : alreadySubmitedWebcodesArray}

            await axios.put(`${serverUrl}/api/${id}/students/${id}`, newSubmittedWebcodesField, config)
                .then(res => { 
                    const newAlreadySubmittedWebcodesNums = [...alreadySubmittedWebcodesNums];
                    newAlreadySubmittedWebcodesNums.push(Number(webcodeFormData.webcodeNum));

                    setAlreadySubmittedWebcodesNums(newAlreadySubmittedWebcodesNums);

                    if(webcodeFormData.webcodeNum === 1){
                      setWebcode_1_SubmittedLink(webcodeFormData.link);
                      setWebcode_1_FormData({...webcode_1_FormData, "link" : ""});
                    }else if(webcodeFormData.webcodeNum === 2){
                      setWebcode_2_SubmittedLink(webcodeFormData.link);
                      setWebcode_2_FormData({...webcode_2_FormData, "link" : ""});
                    }       

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



// Function to handle the input field data change for webcode-1
  const handleWebcodeFormChange_1 = (e) => {
    setWebcode_1_FormData({...webcode_1_FormData, "link" : e.target.value});
    
    if(validator.isURL(e.target.value)){
      setWebcode_1_FormErrors("");
    }else{
      setWebcode_1_FormErrors("Enter valid URL");
    }
  }

  // Function to handle the input field data change for webcode-2
  const handleWebcodeFormChange_2 = (e) => {
    setWebcode_2_FormData({...webcode_2_FormData, "link" : e.target.value});
    
    if(validator.isURL(e.target.value)){
      setWebcode_2_FormErrors("");
    }else{
      setWebcode_2_FormErrors("Enter valid URL");
    }
  }

// Function to handle the onClick event of submit button for webcode-1
const handlewebcodeFormSubmit_1 = (e) => {
  e.preventDefault();
  submitStudentWebcode(webcode_1_FormData);
}

// Function to handle the onClick event of submit button for webcode-2
  const handlewebcodeFormSubmit_2 = (e) => {
    e.preventDefault();
    submitStudentWebcode(webcode_2_FormData);
  }

  useEffect(() => {
    declareAllValidDataFunction_1();
    // eslint-disable-next-line
  }, [webcode_1_FormData, webcode_1_FormErrors]);


  useEffect(() => {
    declareAllValidDataFunction_2();
    // eslint-disable-next-line
  }, [webcode_2_FormData, webcode_2_FormErrors]);


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

        <p className='blue-color-p-class'>Webcode submissions</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

                
                <div className='webcode-submission-div'>
                <p className='actvities-p'>Webcode-1</p>
                        <div>
                            {alreadySubmittedWebcodesNums.includes(1) ? 
                            // If the webcode-1 is submitted
                            // Displaying the submitted link and date
                            <div>
                                <input className='webcode-submit-input' placeholder="Enter valid link of webcode-1 source code" type='text' disabled={true} value={webcode_1_SubmittedLink}/>
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' size='sm' disabled={true}>Submit</Button></div>
                                <span>Submitted link: <a href={webcode_1_SubmittedLink} target='_blank' rel="noopener noreferrer">{webcode_1_SubmittedLink}</a></span>
                                <br />
                                <span>Submitted on: {webcode_1_SubmittedDate}</span>
                            </div>

                            : 

                            // If the webcode-1 is not yet submitted
                            // Displaying the field for submission
                            <div>
                                <input className='webcode-submit-input' placeholder="Enter valid link of webcode-1 source code" type='text' value={webcode_1_FormData.link} onChange={handleWebcodeFormChange_1}/>
                                <p><span>{webcode_1_FormErrors}</span></p>
                                <br />
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' size='sm' onClick={handlewebcodeFormSubmit_1} disabled={disableSubmit_1}>Submit</Button></div>
                            </div>
                        }
                        </div>                  
                </div>

                <br />

                
                <div className='webcode-submission-div'>
                <p className='actvities-p'>Webcode-2</p>
                
                        <div>
                            {alreadySubmittedWebcodesNums.includes(2) ? 
                            // If the webcode-2 is submitted
                            // Displaying the submitted link and date
                            <div>
                                <input className='webcode-submit-input' placeholder="Enter valid link of webcode-2 source code" type='text' disabled={true} value={webcode_2_SubmittedLink}/>
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' size='sm' disabled={true}>Submit</Button></div>

                                <span>Submitted link: <a href={webcode_2_SubmittedLink} target='_blank' rel="noopener noreferrer">{webcode_2_SubmittedLink}</a></span>
                                <br />
                                <span>Submitted on: {webcode_2_SubmittedDate}</span>
                            </div>

                            : 

                            // If the webcode-2 is not yet submitted
                            // Displaying the field for submission
                            <div>
                                <input className='webcode-submit-input' placeholder="Enter valid link of webcode-2 source code" type='text' value={webcode_2_FormData.link} onChange={handleWebcodeFormChange_2}/>
                                <span>{webcode_2_FormErrors}</span>
                                <br />
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' size='sm' onClick={handlewebcodeFormSubmit_2} disabled={disableSubmit_2}>Submit</Button></div>
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

export default Webcodes;


