import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/ResetPassword'; //required
import Home from './components/Home'; //required
import Signup from './components/Signup'; //required
import Login from './components/Login'; //required
import ForgotPassword from './components/ForgotPassword'; //required
import ZenProvider from './contextProvider/ZenProvider'; //required
import ProtectedRoute from './components/ProtectedRoute'; //required
import Dashboard from './components/Dashboard'; //required
import ActivateAccount from './components/ActivateAccount'; //required
import Class from './components/Class'; //required
import Tasks from './components/Tasks'; //required
import Leaderboard from './components/Leaderboard'; //required
import Webcodes from './components/Webcodes'; //required
import Capstone from './components/Capstone'; //required
import Portfolio from './components/Portfolio'; //required
import Queries from './components/Queries'; //required


function App() {
  return (
    <div className="App">
      {/* As the Navbar is given fixed='top', the following breaking lines are required in the app.js. So that it will apply sufficient bottom margin after the Navbar in all the routes. */}
        <br />
        <br />
        <br />
        <br />
      
      <br />
      <BrowserRouter>
        <ZenProvider>
          <Routes>
            {/* "Home" component displays the buttons for signup, login, forgot password */}
            <Route path="/" element={<ProtectedRoute accessBy={"not-authorized"}>< Home /></ProtectedRoute>} />
            

            {/* For registering new student */}
            <Route path="/signup" element={<ProtectedRoute accessBy={"not-authorized"}>< Signup /></ProtectedRoute>} />
            

            {/* For activating the account */}
            <Route path='/activate-account/:activationToken' element={< ActivateAccount />} />


            {/* For login */}
            <Route path="/login" element={<ProtectedRoute accessBy={"not-authorized"}>< Login /></ProtectedRoute>} />
            

            {/* For sending the password reset link through email */}
            <Route path="/forgot-password" element={<ProtectedRoute accessBy={"not-authorized"}>< ForgotPassword /></ProtectedRoute>} />
            

            {/* For resetting the password */}
            <Route path="/reset-password/:resetToken" element={< ResetPassword />} />

            {/* For student dashboard */}
            <Route path="/:studentID/dashboard" element={<ProtectedRoute accessBy={"authorized"}>< Dashboard /></ProtectedRoute>} />
            
            {/* For zen class route */}
            <Route path='/:studentID/class' element={<ProtectedRoute accessBy={"authorized"}><Class /></ProtectedRoute>} />

            {/* For tasks route */}
            <Route path='/:studentID/tasks' element={<ProtectedRoute accessBy={"authorized"}><Tasks /></ProtectedRoute>} />


            {/* For leaderboard route */}
            <Route path='/:studentID/leaderboard' element={<ProtectedRoute accessBy={"authorized"}><Leaderboard /></ProtectedRoute>} />

            {/* For webcode route */}
            <Route path='/:studentID/webcode' element={<ProtectedRoute accessBy={"authorized"}><Webcodes /></ProtectedRoute>} />

            {/* For capstone route */}
            <Route path='/:studentID/capstone' element={<ProtectedRoute accessBy={"authorized"}><Capstone /></ProtectedRoute>} />

            {/* For portfolio route */}
            <Route path='/:studentID/portfolio' element={<ProtectedRoute accessBy={"authorized"}><Portfolio /></ProtectedRoute>} />

            {/* For queries route */}
            <Route path='/:studentID/queries' element={<ProtectedRoute accessBy={"authorized"}><Queries /></ProtectedRoute>} />


          </Routes>
        </ZenProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
