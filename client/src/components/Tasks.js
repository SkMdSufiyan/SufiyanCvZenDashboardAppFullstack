import React, { useContext, useEffect } from 'react';
import { Button, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import ZenContext from '../contextProvider/ZenContext';


const Tasks = () => {
    // const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();
    const {studentID} = useParams();


    const {accessToken, studentProfile, logoutStudentFun} = useContext(ZenContext);

    // When the component is mounted
    useEffect(() => {
        if( ! accessToken){
            // If there is no accessToken, then navigating to login page
            navigate('/login');
        }

        // eslint-disable-next-line
    }, [] );

    // Taking required data from the student profile
    const submittedTasksList = studentProfile.submittedTasks;
    const allClassTitles = studentProfile.totalClassTitles;



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


{/* Displaying all the submitted tasks details */}
    <p className='blue-color-p-class'>Tasks submissions</p>
    {submittedTasksList.map((val, index) => (
        <div key={index} className='task-listing-div'>
        <div className='tasks-list-student-name-div'>{studentProfile.firstName +" "+ studentProfile.lastName}</div>
        <div className='tasks-list-title-date-comment-div'>
            <div className='tasks-list-class-title-div'>({allClassTitles[Number(val.submittedTaskClassNum)-1]})</div>
            <div className='tasks-list-date-div'>Submitted on: <b style={{color:'red'}}>{val.submittedDate}</b></div> 
            <div className='tasks-list-comment-div'>Yet to be graded (Task)</div>
        </div>
        <div className='tasks-list-link-div'>Submitted link: <a href={val.submittedTaskLink} target='_blank' rel="noopener noreferrer">{val.submittedTaskLink}</a></div>
        </div>
    ))}

    <br />
    <br />
    <br />
    <br />

</div>
  )
}

export default Tasks;

