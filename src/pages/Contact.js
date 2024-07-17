// src/ContactForm.js
import React, { useState } from 'react';
import CustomNavbar from '../components/navbar/navbar';

import './ContactForm.css';
/**
 * 
 * This is the contact form page of the app.
 * @component
 * @returns {JSX.Element} The rendered ContactForm component.
 */
const ContactForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    });
  
    const [submittedData, setSubmittedData] = useState(null);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmittedData(formData);
    };
  
    return (
        <div className="App">
        <div className="app-body">
    <CustomNavbar onpressMap={(map)=>null} onChange={(newdir) =>null} SetinputFile={(input)=>null}/>
      <div className="container mt-2">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Submit</button>
        </form>
  
        {submittedData && (
          <div className="mt-5">
            <h2>Submitted Information</h2>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Message:</strong> {submittedData.message}</p>
          </div>
        )}
      </div>
        </div>
        </div>

    );
  };
  
  export default ContactForm;