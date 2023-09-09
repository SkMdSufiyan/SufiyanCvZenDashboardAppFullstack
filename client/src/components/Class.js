import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Navbar, Nav, NavItem, Table } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import ZenContext from '../contextProvider/ZenContext';
import validator from "validator";


const Class = () => {
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

    // Initializing states
    // By default, class-1 is opened. So, it will be considered as checked (conducted class)
    const [openedClassNum, setOpenedClassNum] = useState(1);

    // "alreadySubmittedTaskNums" indicates the class numbers of the already submitted tasks
    const [alreadySubmittedTaskNums, setAlreadySubmittedTaskNums] = useState(studentProfile.submittedTasks.map(val=>Number(val.submittedTaskClassNum)));

    // "openedClassTaskSubmittedLink" indicates the task link submitted related to the class that is opened now
    // If the task for the opened class is submitted, then that link will be stored here, otherwise "" will be stored
    const [openedClassTaskSubmittedLink, setOpenedClassTaskSubmittedLink] = useState(() => {
        const matchedArray = studentProfile.submittedTasks.filter(val=>Number(val.submittedTaskClassNum) === openedClassNum);
        if(matchedArray.length > 0){
            return matchedArray[0].submittedTaskLink;
        }else{
            return "";
        }
    });

    // "attendedClassNumbers" are the class numbers for which the student has clicked the "Join Class" button
    const [attendedClassNumbers, setAttendedClassNumbers] = useState(studentProfile.attendedClassNumbers);
    // "conductedClassNumbers" are the class numbers of the classes for which the student has checked (by clicking the class bubble button in the session roadmap)
    const [conductedClassNumbers, setConductedClassNumbers] = useState(studentProfile.conductedClassNumbers);



    const todayDate = new Date().toLocaleDateString();
    const emptyTaskLinkFormData = {
        "submittedTaskClassNum" : openedClassNum,
        "submittedDate" : todayDate,
        "submittedTaskLink" : ""
    }

    const [taskLinkFormData, setTaskLinkFormData] = useState(emptyTaskLinkFormData);
    const [taskLinkFormErrors, setTaskLinkFormErrors] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);


    
    const declareAllValidDataFunction = () => {
        // Checking whether any of the mandatory input fields is empty (not filled)
        const emptyInputFields = Object.values(taskLinkFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "profileFormErrors" contains error value
        const errorsInTheForm = taskLinkFormErrors !== "";

        // Changing the state of "isAllValidData"
        if( ! emptyInputFields && ! errorsInTheForm ){
            setDisableSubmit(false);  
        }else{
            setDisableSubmit(true);
        }
    }


    useEffect(() => {
        // Calling the function "declareAllValidDataFunction" to set the state of "isAllValidData", based on which submit button will be disabled or enabled
    declareAllValidDataFunction();
    // eslint-disable-next-line
    }, [taskLinkFormData, taskLinkFormErrors]);


    // Function to get the updated student profile data whenever is required
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


// Function to submit the task
    const submitStudentTask = async() => {
        try{
            const id = studentProfile._id;
            const alreadySubmitedTasksArray = studentProfile.submittedTasks;
            alreadySubmitedTasksArray.push(taskLinkFormData);
            const newSubmittedTasksField = {"submittedTasks" : alreadySubmitedTasksArray}

                await axios.put(`${serverUrl}/api/${id}/students/${id}`, newSubmittedTasksField, config)
                    .then(res => { 
                        const newAlreadySubmittedTaskNums = [...alreadySubmittedTaskNums];
                        newAlreadySubmittedTaskNums.push(openedClassNum);

                        setAlreadySubmittedTaskNums(newAlreadySubmittedTaskNums);
                        setOpenedClassTaskSubmittedLink(taskLinkFormData.submittedTaskLink);
                        setTaskLinkFormData({...taskLinkFormData, "submittedTaskLink" : ""});

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


// Function to update the attended (joined the class) class numbers in the database
    const updateAttendedClassNumbers = async(openedClassNum) => {
        try{
            const id = studentProfile._id;
            const alreadyAttendedClassNumbers = studentProfile.attendedClassNumbers;
            alreadyAttendedClassNumbers.push(openedClassNum);
            const newAttendedClassNumbers = {"attendedClassNumbers" : alreadyAttendedClassNumbers}

                await axios.put(`${serverUrl}/api/${id}/students/${id}`, newAttendedClassNumbers, config)
                    .then(res => { 
                        setAttendedClassNumbers(alreadyAttendedClassNumbers);
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


// Function to handle the onClick event of "Join Class" button
    const handleJoinClassClick = (openedClassNum) => {
        if( ! attendedClassNumbers.includes(openedClassNum)){
            updateAttendedClassNumbers(openedClassNum);
        }
    }


// Function to update the conducted (checked by clicking the class bubble buttons in the session roadmap) class numbers to the database
    const updateConductedClassNumbers = async(openedClassNum) => {
        try{
            const id = studentProfile._id;
            const alreadyConductedClassNumbers = studentProfile.conductedClassNumbers;
            alreadyConductedClassNumbers.push(openedClassNum);
            const newConductedClassNumbers = {"conductedClassNumbers" : alreadyConductedClassNumbers}

                await axios.put(`${serverUrl}/api/${id}/students/${id}`, newConductedClassNumbers, config)
                    .then(res => { 
                        setConductedClassNumbers(newConductedClassNumbers);
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


// Function to handle the onClick event of class bubble button (in the session roadmap)
    const handleClassBubbleClick = (openedClassNum) => {
        if(! conductedClassNumbers.includes(openedClassNum)){
            updateConductedClassNumbers(openedClassNum);
        }
    }

    // Function for handling the input field change for the task link field
    const handleTaskLinkFormChange = (e) => {
        setTaskLinkFormData({...taskLinkFormData, "submittedTaskLink" : e.target.value, "submittedTaskClassNum" : openedClassNum});
        
        if(validator.isURL(e.target.value)){
            setTaskLinkFormErrors("");
        }else{
            setTaskLinkFormErrors("Enter valid URL");
        }
    }

// Function for handling the onClick event of the submit button
    const handleTaskLinkFormSubmit = (e) => {
        e.preventDefault();
        submitStudentTask();

    }




// updating some states whenever the values of openedClassNum and studentProfile changes
    useEffect(() => {
        setAlreadySubmittedTaskNums(studentProfile.submittedTasks.map(val=>Number(val.submittedTaskClassNum)));
        
        setOpenedClassTaskSubmittedLink(() => {
            const matchedArray = studentProfile.submittedTasks.filter(val=>Number(val.submittedTaskClassNum) === openedClassNum);
            if(matchedArray.length > 0){
                return matchedArray[0].submittedTaskLink;
            }else{
                return "";
            }
        });

        setAttendedClassNumbers(studentProfile.attendedClassNumbers);
        setConductedClassNumbers(studentProfile.conductedClassNumbers);

        // eslint-disable-next-line
    }, [openedClassNum, studentProfile]);




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
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/class`)}>Class</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/dashboard`)}>Dashboard</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/tasks`)}>Tasks</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/webcode`)}>Webcode</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/capstone`)}>Capstone</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/queries`)}>Queries</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/portfolio`)}>Portfolio</Button>
            <Button className='sidebar-buttons' size='sm' onClick={()=>navigate(`/${studentID}/leaderboard`)}>Leaderboard</Button>

        </div>

        <p className='blue-color-p-class'>Zen Classes</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>


    <div style={{display:'block', marginLeft:'50px'}}>
        <Table responsive>
            <tbody>
                <tr>
                    <td>
                    <div className='classdiv'>
                        
                        {attendedClassNumbers.includes(openedClassNum) ? (
                            // If the student has clicked the "Join Class" button of this class
                            // Then displaying the "Play recording" button
                            <div className='class-header'>
                                <h4>Please watch the recording.</h4>
                                <Button color='info'>Play recording</Button>
                            </div>
                        ) : (
                            // If the student has not clicked the "Join class" button of this class
                            // Showing the "Join class" button
                            <div className='class-header'>
                                <h4>Join the class on time!</h4>
                                <Button color='info' onClick={()=>handleJoinClassClick(openedClassNum)}>Join class</Button>
                            </div>
                        )}
                        
                        {/* Showing some session contents here */}
                        <div className='session-contents'>
                            <h5 style={{color:'blue'}}>{`Class ${openedClassNum}: ${studentProfile.totalClassTitles[Number(openedClassNum)-1]}`}</h5>
                            
                            <p>Contents</p>
                            <ul>
                                <li>{`Class ${openedClassNum} content-1`} </li>
                                <li>{`Class ${openedClassNum} content-2`} </li>
                                <li>{`Class ${openedClassNum} content-3`} </li>
                                <li>{`Class ${openedClassNum} content-4`} </li>
                            </ul>
                            
                            <p>Pre-read</p>
                            <ul>
                                <li>{`Class ${openedClassNum} pre-read 1`} </li>
                                <li>{`Class ${openedClassNum} pre-read 2`} </li>
                                <li>{`Class ${openedClassNum} pre-read 3`} </li>
                                <li>{`Class ${openedClassNum} pre-read 4`} </li>
                            </ul>
                        </div>
                    </div>

                    </td>
                    <td> 
                        {/* Displaying the session road map */}
                        <p className='sessions-roadmap-p'>Sessions Roadmap</p>
                        <div className="bubble-grid">
                        {Array.from({ length: 37 }, (_, index) => (
                            <button key={index} className="bubble" onClick={()=>{setOpenedClassNum(index+1); handleClassBubbleClick(index+1)}}>{index+1}</button>
                        ))}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                    
                        {/* Showing the "apiCallError", if any error occurs */}
                        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>
                        <p className='actvities-p'>Activities (task-{openedClassNum})</p>
                    <div className='task-submission-div'>
                            <div>
                                {alreadySubmittedTaskNums.includes(openedClassNum) ? 
                                // If the task is submitted for this opened class
                                // Displaying the submitted link
                                <div>
                                    <Input placeholder="Enter valid link of task source code" type='text' disabled={true} value={openedClassTaskSubmittedLink}/>
                                    <div className='task-submission-button-div'><Button className='task-submission-button' color='success' disabled={true}>Submit</Button></div>
                                </div>

                                : 

                                // If the task is not submitted for this opened class
                                // Displaying the input field for submission
                                <div>
                                    <Input placeholder="Enter valid link of task source code" type='text' value={taskLinkFormData.submittedTaskLink} onChange={handleTaskLinkFormChange}/>
                                    <span>{taskLinkFormErrors}</span>
                                    <br />
                                    <div className='task-submission-button-div'><Button className='task-submission-button' color='success' onClick={handleTaskLinkFormSubmit} disabled={disableSubmit}>Submit</Button></div>
                                </div>
                            }

                            </div>                           

                        </div>
                    </td>
                </tr>
            </tbody>

        </Table>

        <br />
        <br />
        <br />
        <br />
        
        </div>
</div>
  )
}

export default Class;




