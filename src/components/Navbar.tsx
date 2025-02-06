import { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { TiThMenu } from 'react-icons/ti';

export default function Navigation() {
  const [navColor, setNavColor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if(window.scrollY >= 50) {
        setNavColor(true);
      } else {
        setNavColor(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleMobileDropdown() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <nav className={``}>
        <div className={`navbar-nav z-50 ${navColor ? 'nav-scroll' : ''}`}>
          <a href="#hero-target"> <FaHome className="ml-10 md:ml-20"/> </a>
          <button className='mr-10 text-[25px] md:hidden' onClick={toggleMobileDropdown}><TiThMenu/></button>

          <div className="hidden md:flex space-x-4 mr-10 md:mr-20">
            <a href="#mission-target" className="nav-link"> Mission </a>
            <a href="#skills-target" className="nav-link"> Skills </a>
            <a href="#project-target" className="nav-link"> Projects </a>
            <a href="#contact-target" className="nav-link"> Contact </a>
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className='w-full mobile-scroll'> 
            <div className='pt-20 px-6 mb-7 space-y-4'> 
              <a href="#mission-target" className="block nav-link"> Mission </a>
              <a href="#skills-target" className="block nav-link"> Skills </a>
              <a href="#project-target" className="block nav-link"> Projects </a>
              <a href="#contact-target" className="block nav-link"> Contact </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}