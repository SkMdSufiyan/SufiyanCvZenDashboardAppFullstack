import React, { useContext, useEffect } from 'react';
import { Button, Navbar, Nav, NavItem, Table } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import ZenContext from '../contextProvider/ZenContext';

const Leaderboard = () => {
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

    // Taking the required data from the student profile
    const numberOfTotalTasks = studentProfile.numOfTotalClasses;
    const numberOfSubmittedTasks = studentProfile.submittedTasks.length;
    const taskCompletion = (numberOfSubmittedTasks / numberOfTotalTasks *100).toFixed(2);




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

{/* Just displaying the student name along with the task completion percentage */}
        <p className='blue-color-p-class'>Leaderboard</p>

        <Table responsive style={{marginLeft : "50px"}}>
            <thead>
                <tr>
                    <th style={{backgroundColor : "transparent", color:"skyblue"}}>Rank</th>
                    <th style={{backgroundColor : "transparent", color:"skyblue"}}>Name</th>
                    <th style={{backgroundColor : "transparent", color:"skyblue"}}>Batch</th>
                    <th style={{backgroundColor : "transparent", color:"skyblue"}}>Learning</th>
                    <th style={{backgroundColor : "transparent", color:"skyblue"}}>Task completion</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td style={{backgroundColor : "transparent", color:"whitesmoke"}}>1</td>
                    <td style={{backgroundColor : "transparent", color:"whitesmoke"}}>{studentProfile.firstName +" "+ studentProfile.lastName}</td>
                    <td style={{backgroundColor : "transparent", color:"whitesmoke"}}>B37 WE English</td>
                    <td style={{backgroundColor : "transparent", color:"whitesmoke"}}>--</td>
                    <td style={{backgroundColor : "transparent", color:"whitesmoke"}}>{taskCompletion}%</td>
                </tr>
            </tbody>

        </Table>
        
        <br />
        <br />
        <br />
        <br />

</div>
  )
}

export default Leaderboard;




