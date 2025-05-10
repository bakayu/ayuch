import { useState, useEffect } from 'react';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contributions from './components/sections/Contributions';
import Experience from './components/sections/Experience';
import Footer from './components/sections/Footer';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveSection(section.id);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar activeSection={activeSection} />
      <main className="container mx-auto px-4">
        <section id="home" className="py-20">
          <Hero />
        </section>
        
        <section id="skills" className="py-20">
          <Skills />
        </section>
        
        <section id="projects" className="py-20">
          <Projects />
        </section>
        
        <section id="contributions" className="py-20">
          <Contributions />
        </section>
        
        <section id="experience" className="py-20">
          <Experience />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
