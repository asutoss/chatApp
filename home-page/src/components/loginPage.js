import React from 'react'
import { Link } from 'react-router-dom';

const LoginPage = (props) => {

    return (
        <div className='box'>
            <input type='text' />
            <Link 
                to={{
                    pathname: '/hp'
                }}
            >Enter</Link>
        </div>
    );
}

export default LoginPage;