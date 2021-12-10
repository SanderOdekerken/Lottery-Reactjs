import './App.css';
import lottery from '../lottery';
import React, {useState, useEffect} from 'react';

function App() {
  const [data, setData] = useState({
    manager: "",
    players: [""],
  })

  useEffect(async() => {
    const manager = await lottery.methods.manager().call(); 
    setData({...data, manager:manager});
  });
  
  
  return (<div>
    <h2>Lottery Contract!</h2>
    <p>This contract is managed by {data.manager}</p>
  </div>);
}

export default App;
