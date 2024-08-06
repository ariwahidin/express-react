import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem('py_pos_token_access');
    const user = localStorage.getItem('py_pos_user');

    console.log('ini protected routes');

    if(!token){
        // return <Navigate to='/auth/login'/>;
    }

    return children;
};

export default ProtectedRoute;