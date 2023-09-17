import React, { useContext } from 'react';
import { Button, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import ZenContext from '../contextProvider/ZenContext';

// This component displays the home page of this application
const Home = () => {
    const navigate = useNavigate();
    const {logoutMessage} = useContext(ZenContext);

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
                <Button className='home-page-Button-class' color='primary' size='sm' onClick={() => navigate('/login')}>Login</Button>
            </NavItem>
            <NavItem>
                <Button className='home-page-Button-class' color='info' size='sm' onClick={()=>navigate('/signup')}>Signup</Button>
            </NavItem>
          </Nav>
    </Navbar>

    
    <p className='app-suggestion-p'><b style={{color : "blue"}}>The server of this application is deployed on a Render's free tier account</b>. Due to Render's <b style={{color : "blue"}}>"spinning down on idle"</b> issue, the server may (sometimes) take a little longer to start (when it is opened after a long time).</p>
    <p className='app-suggestion-p'>When you open this application's link for the <b style={{color : "blue"}}>first time</b>, please wait 15-30 seconds <b style={{color : "blue"}}>after submitting the requests for login, signup, or forgot password</b>.</p>
    <p className='app-suggestion-p'>If it takes much longer to respond <b style={{color : "blue"}}>(for the first time only)</b>, try closing and opening the app link one or two times.</p>
    
    <br />

        <h5 style={{color: "blue"}}>Welcome to Zen application </h5>
        <p className='blue-color-p-class'>(zen student dashboard)</p>
        {/* A message will be displayed when an student logged out successfully */}
        <h5 style={{color : "green"}}>{logoutMessage}</h5>


        <br />

        {/* Application usage suggestions */}


        <h6>Instructions</h6>
            <p className='app-suggestion-p'><b style={{color : "blue"}}>Demo credentials</b> are given in the login page.</p>
        <div className='home-page-suggestion-flex'>
          <div className='home-page-suggestion-divs'>
            <ul>
               <li><p className='home-page-suggestion-p-red'>This application is a demo student dashboard with complete authentication, where student can register and perform actions such as attending the online classes, watch the recordings, submit the source code links of tasks and capstone, submit the portfolio link etc. </p></li>
            
              <li><p className='home-page-suggestion-p-green'><b>This page will monitor the localStorage (for access token) every 2 minutes. So, during login, signup, forgot-password operations, please fill the details in less than 2 minutes. Otherwise, it will reload the login page again.</b></p></li>
              <li><p className='home-page-suggestion-p-red'>For using pages which do not need authentcation, logout from your account first.</p></li>
              <li><p className='home-page-suggestion-p-green'>The "Forgot password" or "Reset password" link is given in the login page.</p></li>
              
              <li><p className='home-page-suggestion-p-red'><b>After submitting signup, forgot-password, reset-password pages, kindly wait for some time. It may take some time for processing and giving confirmation message.</b></p></li>
              
            </ul>
           
          </div>

          <div className='home-page-suggestion-divs'>
            <ul>
              <li><p className='home-page-suggestion-p-red'>The student during SIGNUP, should give valid and working email id. An account-activation link will be sent to the registered email id.</p></li>

              <li><p className='home-page-suggestion-p-green'><b>Here, it is considered that when student clicks a bubble button (in the session roadmap) i.e. checked, that class will be marked as conducted or completed. </b></p></li>

              <li><p className='home-page-suggestion-p-red'><b>When student clicks the "Join Class" button, it will be considered that he/she attended that class. </b></p></li>

              <li><p className='home-page-suggestion-p-green'>After submitting any data (task or webcode etc.), if the proper data is not displayed, then kindly refresh the page once.</p></li>                   
            </ul>           
          </div>

        </div>

        <br />
        <div style={{textAlign:'left', fontSize : "small"}}>
            <ul>
                <li>Source code url: <a href="https://github.com/SkMdSufiyan/SufiyanCvZenDashboardAppFullstack.git" target='_blank' rel="noopener noreferrer">https://github.com/SkMdSufiyan/SufiyanCvZenDashboardAppFullstack.git</a></li>
            </ul>
          </div>


      <br />
      <br />
      <br />

    </div>
  )
}

export default Home;



