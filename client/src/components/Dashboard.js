import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Input, Navbar, Nav, NavItem, Card, CardBody } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import ZenContext from '../contextProvider/ZenContext';

const Dashboard = () => {
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

// Taking required data from the student profile
    const numberOfClassesConducted = studentProfile.conductedClassNumbers.length; // Clicked (checked) the class bubles
    const numberOfClassesAttended = studentProfile.attendedClassNumbers.length; // Joined the class
    const numOfTotalClasses = studentProfile.numOfTotalClasses;
    const classCompletion = (numberOfClassesConducted / numOfTotalClasses *100).toFixed(2);
    const attendancePercentage = (numberOfClassesAttended / numberOfClassesConducted *100).toFixed(2);

    const numberOfTotalTasks = numOfTotalClasses;
    const numberOfSubmittedTasks = studentProfile.submittedTasks.length;
    const numberOfPendingTasks = numberOfTotalTasks - numberOfSubmittedTasks;
    const taskCompletion = (numberOfSubmittedTasks / numberOfTotalTasks *100).toFixed(2);

    const numberOfWebcodesSubmitted = studentProfile.webcodes.length;
    const isCapstoneSubmitted = studentProfile.capstone.length > 0;
                        


    // Intialising the states related to profile button
    const [viewProfile, setViewProfile] = useState(false); // Related to "View your profile" button
    const [isEditProfile, setIsEditProfile] = useState(false); // Related to "Edit" button in profile


    const emptyProfileFormErrors = {
        "firstNameError" : "",
        "lastNameError" : ""
    }

    const initialProfileFormData = {
        "email" : studentProfile.email,
        "firstName" : studentProfile.firstName,
        "lastName" : studentProfile.lastName,
        "_id" : studentProfile._id
    };

    const [profileFormData, setProfileFormData] = useState(initialProfileFormData);
    const [profileFormErrors, setProfileFormErrors] = useState(emptyProfileFormErrors);
    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(true);


    // "getSelfProfile" function to get and store the updated studentProfile, when it is required
    // This function will be called inside "updateStudentProfileFun"
    const getSelfProfile = async (id) => {
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


// Function for updating the student profile
    const updateStudentProfileFun = async (profileFormData) => {
        try{       
            const id = profileFormData._id;
            // For removing the _id from the "profileFormData", taking a copy of that and deleting the _id
            const newProfile = {...profileFormData};
            delete newProfile._id;

            await axios.put(`${serverUrl}/api/${id}/students/${id}`, newProfile, config)
                .then(res => { 
                    getSelfProfile(id);
                    
                    setIsEditProfile(false);
                    setApiCallError("");
                })
                .catch(err => {
                    setApiCallError(err.response.data.message);
                    setIsEditProfile(true);
                })
        }catch(error){
            setApiCallError(error.message);
        }

    }


    
    const declareAllValidDataFunction = () => {
        // Checking whether any of the mandatory input fields is empty (not filled)
        const emptyInputFields = Object.values(profileFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "profileFormErrors" contains error value
        const errorsInTheForm = Object.values(profileFormErrors).filter(val => val !== "").length;

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
    }, [profileFormData, profileFormErrors]);



    const handleUpdateProfileChange = (e) => {
        setProfileFormData({...profileFormData, [e.target.name] : e.target.value});


        // Validating firstName field
        if(e.target.name === "firstName"){
            if(validator.isLength(e.target.value, {"min" : 3}) && ! validator.isEmpty(e.target.value)){
                setProfileFormErrors({...profileFormErrors, "firstNameError" : "" });
            }else{
                setProfileFormErrors({...profileFormErrors, "firstNameError" : "Should contain atleast 3 characters"});
            }
        }

        // Validating lastName field
        if(e.target.name === "lastName"){
            if( ! validator.isEmpty(e.target.value )){
                setProfileFormErrors({...profileFormErrors, "lastNameError" : "" });
            }else{
                setProfileFormErrors({...profileFormErrors, "lastNameError" : "Last name is required"});
            }
        }

    }

     //  Function for handling the onClick event of submit button (form submission)
     const handleSubmitProfileForm = (e) => {
        e.preventDefault();
        updateStudentProfileFun(profileFormData);
    }

 


  return (
    <div >
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




        <p className='blue-color-p-class'>Student dashboard</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

        <div className='dashboard-view-profile-button'>
            <Button className='dashboard-Button-class' color='info' onClick={()=>setViewProfile(true)}>View Your Profile</Button>
        </div>




            {viewProfile ? (
                // When the student clicks the "View profile" button
                // Displaying the profile
                <div className='dashboard-profile-card-div'>
                <Card style={{width:"20rem"}} className='profile-card'>
                    <CardBody>
                             {/* If the student clicked the "View yout profile" button */}
                             {/* Showing the student profile */}
                            <div className='profile-div'>
                                {/* Showing the "apiCallError", if any error occurs */}
                                <h6 className='apiCallError-h6-class'>{apiCallError}</h6>
                                <br />
                            <Label>Email</Label>
                            <Input name='email' type='text' value={profileFormData.email} disabled={ true } onChange={handleUpdateProfileChange} />
                            <br />
                            <Label>First name</Label>
                            <Input type='text' name='firstName' value={profileFormData.firstName} disabled={! isEditProfile} onChange={handleUpdateProfileChange} />
                            <p><span>{profileFormErrors.firstNameError} </span></p>
                            
                            <Label>Last name</Label>
                            <Input type='text' name='lastName' value={profileFormData.lastName} disabled={! isEditProfile} onChange={handleUpdateProfileChange} />
                            <p><span>{profileFormErrors.lastNameError} </span></p>
                            
                            <Label>Id</Label>
                            <Input type='text' name='_id' value={profileFormData._id} disabled={true} onChange={handleUpdateProfileChange} />
                            <br />
                            

                            {isEditProfile ? (
                                // When the student clicks the Edit button
                                <div>
                                    <Button className='dashboard-Button-class' color='success' onClick={handleSubmitProfileForm} disabled={! isAllValidData}>Update</Button>
                                    <Button className='dashboard-Button-class' color='warning' onClick={()=>{setProfileFormData(initialProfileFormData);setIsEditProfile(false)}}>Cancel</Button>
                                </div>

                            ) : (
                                <div>
                                    <Button className='dashboard-Button-class' color='info' onClick={()=>setViewProfile(false)}>Close</Button>
                                    <Button className='dashboard-Button-class' color='warning' onClick={()=>setIsEditProfile(true)}>Edit</Button>
                                </div>
                            )}
                            </div>
                    </CardBody>
                </Card>
                <br />
                <br />
                </div>
                

            ) : "" }



{/* Displaying the attendance related data */}
            <div className='attendance-card-div'>
                <div className='attendance-card'>
                    
                        <p className='attendance-card-p-blue'>Classes completed (checked): <b className='attendance-card-b-green'>{numberOfClassesConducted}</b></p>
                        
                        <p className='attendance-card-p-blue'>Class completion : <b className='attendance-card-b-green'>{classCompletion}</b>%</p>
                        
                        <p className='attendance-card-p-blue'>Classes attended (joined): <b className='attendance-card-b-green'>{numberOfClassesAttended}</b></p>
                        
                        <p className='attendance-card-p-blue'>Attendance percentage: <b className='attendance-card-b-green'>{attendancePercentage}</b>%</p>

                </div>

{/* Displaying the task submission related data */}
                <div className='attendance-card'>
                    
                        <p className='attendance-card-p-blue'>Total number of tasks: <b className='attendance-card-b-green'>{numberOfTotalTasks}</b></p>

                        <p className='attendance-card-p-blue'>Tasks submitted: <b className='attendance-card-b-green'>{numberOfSubmittedTasks}</b></p>

                        <p className='attendance-card-p-blue'>Tasks pending: <b className='attendance-card-b-green'>{numberOfPendingTasks}</b></p>

                        <p className='attendance-card-p-blue'>Task completion: <b className='attendance-card-b-green'>{taskCompletion}</b>%</p>
  
                </div>
            </div>

{/* Displaying the webcode, capstone submission related data */}
            <div className='attendance-card-div'>
        
                <div  className='attendance-card'>
                    
                        <p className='attendance-card-p-blue'>Webcodes submitted: <b className='attendance-card-b-green'>{numberOfWebcodesSubmitted}</b></p>

                        <p className='attendance-card-p-blue'>Webcodes pending: <b className='attendance-card-b-green'>{2-numberOfWebcodesSubmitted}</b></p>

                        <p className='attendance-card-p-blue'>Capstone: <b className='attendance-card-b-green'>{isCapstoneSubmitted ? "Submitted" : "Pending"}</b></p>
    
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
      
      </div>
  )
}

export default Dashboard;


