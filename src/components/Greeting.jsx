import { useState } from 'react';

export default function Greeting({ messages }) {
  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];
  const [greeting, setGreeting] = useState(messages[0]);

  // Handler for greeting and video channel switch simulation
  const handleButtonClick = () => {
    setGreeting(randomMessage());
    const video = document.getElementById('myVideo');
    if (video) {
      video.currentTime = 0;
      video.style.display = 'block';
      setTimeout(() => {
        video.style.display = 'none';
      }, 500);
    }
  };

  return (
    <div className='text-center'>
      <h3 className="horror-subtitle">{greeting}</h3>
      <button onClick={handleButtonClick}>
        🔄️
      </button>
    </div>
  );
}
