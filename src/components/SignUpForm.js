import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ setIsLoggedIn, setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  const fetchAndSetUser = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/premium/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user after login", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (login) {
        res = await axios.post("http://localhost:3000/login", formData);
      } else {
        await axios.post("http://localhost:3000/signup", formData);
        res = await axios.post("http://localhost:3000/login", {
          email: formData.email,
          password: formData.password,
        });
      }

      const token = res.data.token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      await fetchAndSetUser(token);

      setFormData({ name: '', email: '', password: '' });
      navigate("/expense");
    } catch (error) {
      if (!login && error.response?.status === 409) {
        alert("User already exists");
      } else if (login && error.response?.status === 401) {
        alert("Invalid email or password");
      } else {
        alert("Something went wrong");
        console.error(error);
      }
    }
  };

  const handleLoginToggle = () => setLogin((prev) => !prev);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        {!login && (
          <>
            <label htmlFor="name">Name:</label>
            <input id="name" value={formData.name} onChange={handleChange} required />
          </>
        )}
        <label htmlFor="email">Email:</label>
        <input id="email" value={formData.email} onChange={handleChange} type="email" required />

        <label htmlFor="password">Password:</label>
        <input id="password" value={formData.password} onChange={handleChange} type="password" required />

        <button type="submit">{login ? 'Login' : 'Sign Up'}</button>
      </form>

      <button onClick={handleLoginToggle}>
        {login ? 'New User? Sign Up' : 'Existing User? Login'}
      </button>
    </>
  );
};

export default SignUpForm;
