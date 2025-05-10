import { useState, useRef, useEffect } from 'react';
import './App.css';

// Layout components
import Sidebar from './components/layout/Sidebar';

// Section components
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contributions from './components/sections/Contributions';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';

// UI components
import BackgroundAnimation from './components/ui/BackgroundAnimation';
import Navbar from './components/sections/Navbar';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const contactRef = useRef(null);
  const sectionRefs = useRef({});
  
  // Register section refs
  const registerSectionRef = (id, ref) => {
    sectionRefs.current[id] = ref;
  };
  
  // Intersection Observer to detect active section
  useEffect(() => {
    const observers = [];
    const sections = document.querySelectorAll('section[id]');
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    };
    
    sections.forEach(section => {
      const observer = new IntersectionObserver(observerCallback, observerOptions);
      observer.observe(section);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);
  
  // Handle scrolling to contact section
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar - visible on medium screens and up */}
      <div className="hidden md:block md:fixed md:left-0 md:top-0 md:h-screen md:w-80 lg:w-96 z-50">
        <Sidebar scrollToContact={scrollToContact} />
      </div>
      
      {/* Main content - pushed to the right on medium screens and up */}
      <main className="flex-grow w-full md:ml-80 lg:ml-96" id="content-container">
        {/* Navbar - now fixed properly */}
        <div className="sticky top-0 left-0 right-0 z-20">
          <Navbar activeSection={activeSection} />
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <section id="hero" className="py-12 md:py-16 min-h-[90vh] flex items-center">
            <Hero />
          </section>
          
          <section id="skills" className="py-6 md:py-8">
            <Skills />
          </section>
          
          <section id="experience" className="py-6 md:py-8">
            <Experience />
          </section>
          
          <section id="projects" className="py-6 md:py-8">
            <Projects />
          </section>
          
          <section id="contributions" className="py-6 md:py-8">
            <Contributions />
          </section>
          
          <section id="contact" ref={contactRef} className="py-6 md:py-8">
            <Contact />
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;