import { useState } from 'react';

export default function Greeting({ messages }) {

  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div className='text-center'>
      <h3 className="horror-subtitle">{greeting}</h3>
      <button onClick={() => setGreeting(randomMessage())}>
        🔄️
      </button>
    </div>
  );
}
