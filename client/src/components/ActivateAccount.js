import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody, Navbar, Nav, NavItem } from 'reactstrap';

const ActivateAccount = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const {activationToken} = useParams();
    const navigate = useNavigate();

    // Initialising states
    const [activationSuccessMessage, setActivationSuccessMessage] = useState('');
    const [apiCallErrorMessage, setApiCallErrorMessage] = useState('');

    // Function to make a get call to the server for verifying the token and activating the account
    const accountActivateFun = async () => {
        try{
            await axios.get(`${serverUrl}/api/activate-account/${activationToken}`)
            .then(res => {
                setActivationSuccessMessage(res.data.message);
                setApiCallErrorMessage('');
            })
            .catch(err => {
                setApiCallErrorMessage(err.response.data.message);
            })
        }catch(error){
            setApiCallErrorMessage(error.message);
        }
    }


    useEffect(() => {
        accountActivateFun();
        // eslint-disable-next-line
    }, [activationToken]);


  return (
    <div className='component-main-div'>
        <Navbar  expand="md" className='Navbar-class' fixed='top'>
          <Nav className="mx-auto" navbar style={{alignItems : "center"}}>
            <NavItem>
              <h6 style={{color:"white"}}>Zen Student Dashboard</h6>
            </NavItem>
          </Nav>
        </Navbar>

        <Card style={{width: '18rem'}}>
            <CardBody>
                <p className='blue-color-p-class'>Zen account activation</p>
                {/* Showing the "apiCallError", if any error occurs */}
                <h6 className='apiCallSuccess-h6-class'>{activationSuccessMessage}</h6>

                { ! activationSuccessMessage ? 
                <h6 className='apiCallError-h6-class'>{apiCallErrorMessage}</h6>
              : "" }
                
                
                <br />
                
                <br />
                <br />
                <Button color='primary' onClick={()=>navigate('/login')}>Login</Button>
            </CardBody>
        </Card>

    </div>
  )
}

export default ActivateAccount;


