import axios from 'axios'
import { useState } from 'react';
import ExpenseForm from './expense/ExpenseForm';

const SignUpForm=()=>{
     const [formData, setFormData] = useState({ name: '', email: '', password: '' });
     const [login,setLogin]=useState(false)
     const [isLoggedIn,setIsLoggedIn]=useState(false)
    const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    let response;

    if (login) {
      
      response = await axios.post("http://localhost:3000/login", formData)
      alert(response.data.token)
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true)
    
    } else {
     
      response = await axios.post("http://localhost:3000/signup", formData);
      setIsLoggedIn(true)
    }

    
    setFormData({ name: '', email: '', password: '' });

  } catch (error) {
    
    if (!login && error.response && error.response.status === 409) {
      alert(" User already exists");
    } else if (login && error.response && error.response.status === 401) {
      alert(" Invalid email or password");
    } else {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  }
};


const handleLogin=()=>{
    setLogin(!login)
}

    const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
    return (
        <>
        {isLoggedIn?<ExpenseForm/>:<><form onSubmit={handleFormSubmit}>
           {!login && <><label htmlFor="name">Enter your name:</label>
            <input  value={formData.name} onChange={handleChange} id="name" type="text" required /></>}
            <label htmlFor="email">Enter your email:</label>
            <input value={formData.email} onChange={handleChange} id="email" type="email" required />
            <label htmlFor="password">Enter your password:</label>
            <input value={formData.password} onChange={handleChange} id="password" type="password" required />
            <button>{login?'LogIn':'SignUp'}</button>
        </form>
        <button onClick={handleLogin}>{login?'New User? SignUp':'Existing User - Login'}</button></>}
        
        </>
    )
}

export default SignUpForm;