import { useState } from 'react';
import { personalInfo } from '../../data/portfolio-data';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-vibrant-blue to-vibrant-teal text-transparent bg-clip-text">
        Contact Me
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
          <p className="text-muted-foreground mb-6">
            I'm always open to new opportunities and collaborations. Feel free to reach out if you want to connect or have any questions!
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 rounded-full p-3 text-blue-500">
                <i className="devicon-github-original text-xl"></i>
              </div>
              <div>
                <h4 className="font-medium">GitHub</h4>
                <a 
                  href={`https://${personalInfo.links.github}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {personalInfo.links.github}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 rounded-full p-3 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-muted-foreground">{personalInfo.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-teal-500/10 rounded-full p-3 text-teal-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <path d="M22 7l-10 7L2 7"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-500/10 rounded-full p-3 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Location</h4>
                <p className="text-muted-foreground">{personalInfo.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Send Me a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your message..."
              />
            </div>
            
            {/* Update the submit button to show it's not working */}
            <button 
              type="submit" 
              className="w-full bg-gray-400 text-gray-100 py-3 rounded cursor-not-allowed opacity-70 hover:opacity-70"
              disabled
            >
              Send Message (currently not working, reach out directly)
            </button>
            
            {submitStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
                Message sent successfully! I'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                Failed to send message. Please try again or contact me directly via email.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}