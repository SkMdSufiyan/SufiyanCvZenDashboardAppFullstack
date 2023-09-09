import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Navbar, Nav, NavItem} from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import ZenContext from '../contextProvider/ZenContext';
import validator from "validator";

const Portfolio = () => {

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
    const emptyPortfolioFormdata = {
      "submittedDate" : todayDate,
      "link" : ""
    };


    // Initializing states
    const [portfolioFormData, setPortfolioFormData] = useState(emptyPortfolioFormdata);
    
    const [portfolioFormErrors, setPortfolioFormErrors] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);

// If the profolio is submitted, the "portfolioSubmittedDate" will have the submitted data
    const [portfolioSubmittedDate, setPortfolioSubmittedDate] = useState("");
    // If the profolio is submitted, the "portfolioSubmittedLink" will have the submitted link
    const [portfolioSubmittedLink, setPortfolioSubmittedLink] = useState(() => {
        if(studentProfile.portfolio.length > 0){
            setPortfolioSubmittedDate(studentProfile.portfolio[0].submittedDate);
            return studentProfile.portfolio[0].link;
        }else{
            return "";
        }
    });


// Updating some states whenever the student profile changes
  useEffect(() => {
      setPortfolioSubmittedLink(() => {
          if(studentProfile.portfolio.length > 0){
              setPortfolioSubmittedDate(studentProfile.portfolio[0].submittedDate);
              return studentProfile.portfolio[0].link;
          }else{
              return "";
          }
      });
      // eslint-disable-next-line
  }, [studentProfile]);



  const declareAllValidDataFunction = () => {
    // Checking whether any of the mandatory input fields is empty (not filled)
    const emptyInputFields = Object.values(portfolioFormData).filter(val => val === "").length;
    // Checking whether any of the fields of "profileFormErrors" contains error value
    const errorsInTheForm = portfolioFormErrors !== "";
    // Changing the state of "isAllValidData"
    if( ! emptyInputFields && ! errorsInTheForm ){
        setDisableSubmit(false);  
    }else{    
        setDisableSubmit(true);     
    }
  }


// Function to get student profile when required
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


// Function for submitting the portfolio link to the database
  const submitStudentPortfolio = async(portfolioFormData) => {
    try{
        const id = studentProfile._id;
        const alreadySubmitedPortfolioArray = studentProfile.portfolio;
        alreadySubmitedPortfolioArray.push(portfolioFormData);
        const newSubmittedPortfolioField = {"portfolio" : alreadySubmitedPortfolioArray}

            await axios.put(`${serverUrl}/api/${id}/students/${id}`, newSubmittedPortfolioField, config)
                .then(res => { 

                    setPortfolioSubmittedLink(portfolioFormData.link);
                      setPortfolioFormData({...portfolioFormData, "link" : ""});
                
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


  // Function to handle the input field changes of the portfolio link
  const handlePortfolioFormChange = (e) => {
    setPortfolioFormData({...portfolioFormData, "link" : e.target.value});
    
    if(validator.isURL(e.target.value)){
      setPortfolioFormErrors("");
    }else{
      setPortfolioFormErrors("Enter valid URL");
    }
  }


// Function to handle the onClick event of the submit button
  const handlePortfolioFormSubmit = (e) => {
    e.preventDefault();
    submitStudentPortfolio(portfolioFormData);
  }


  useEffect(() => {
    declareAllValidDataFunction();
    // eslint-disable-next-line
  }, [portfolioFormData, portfolioFormErrors]);



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

        <p className='blue-color-p-class'>Portfolio submissions</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

                
                <div className='webcode-submission-div'>
                <p className='actvities-p'>Portfolio</p>
                        <div>
                            {portfolioSubmittedLink ? 
                            // If the portfolio is submitted
                            // Displaying the submitted link
                            <div>
                                <Input placeholder="Enter valid link of portfolio source code" type='text' disabled={true} value={portfolioSubmittedLink}/>
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' disabled={true}>Submit</Button></div>
                                {/* eslint-disable-next-line */}
                                <span>Submitted link: <a href={portfolioSubmittedLink} target='_blank' rel="noopener noreferrer" >{portfolioSubmittedLink}</a></span>
                                <br />
                                <span>Submitted on: {portfolioSubmittedDate}</span>
                            </div>

                            : 

                              // If the portfolio is not yet submitted
                              // Displaying the submission field
                            <div>
                                <Input placeholder="Enter valid link of portfolio source code" type='text' value={portfolioFormData.link} onChange={handlePortfolioFormChange}/>
                                <p><span>{portfolioFormErrors}</span></p>
                                <br />
                                <div className='task-submission-button-div'><Button className='task-submission-button' color='success' onClick={handlePortfolioFormSubmit} disabled={disableSubmit}>Submit</Button></div>
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


export default Portfolio;




