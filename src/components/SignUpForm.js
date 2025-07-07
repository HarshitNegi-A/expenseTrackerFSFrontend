import axios from 'axios'
import { useState } from 'react';

const SignUpForm=()=>{
     const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:3000/signup", formData);
    alert(response.data.message);
    setFormData({ name: '', email: '', password: '' }); // ✅ Clear form
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert("⚠️ User already exists");
    } else {
      alert("❌ Something went wrong. Please try again.");
      console.error(error); // Optional: for debugging
    }
  }
};

    const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
    return (
        <>
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="name">Enter your name:</label>
            <input  value={formData.name} onChange={handleChange} id="name" type="text" required />
            <label htmlFor="email">Enter your email:</label>
            <input value={formData.email} onChange={handleChange} id="email" type="email" required />
            <label htmlFor="password">Enter your password:</label>
            <input value={formData.password} onChange={handleChange} id="password" type="password" required />
            <button>SignUp</button>
        </form>
        <button>Existing User - Login</button>
        </>
    )
}

export default SignUpForm;