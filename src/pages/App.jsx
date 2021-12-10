import "./App.css";
import lottery from "../lottery";
import React, { useState, useEffect } from "react";
import web3 from "../web3";

function App() {
  const [data, setData] = useState({
    manager: "",
    players: [""],
    balance: "",
    value: "",
    message: "",
    accounts: [""],
    winner: "",
  });

  useEffect(async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.getAccounts();
    setData({
      ...data,
      manager: manager,
      players: players,
      balance: balance,
      accounts: accounts,
    });
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setData({ ...data, message: "Waiting on transaction succes..." });
    await lottery.methods.enter().send({
      from: data.accounts[0],
      value: web3.utils.toWei(data.value, "ether"),
    });
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    setData({
      ...data,
      players: players,
      balance: balance,
      message: "You have been entered!",
    });
  }

  async function chooseWinner() {
    setData({ ...data, message: "Waiting on transaction succes..." });
    await lottery.methods.pickWinner().send({
      from: data.accounts[0],
    });
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    setData({
      ...data,
      players: players,
      balance: balance,
      message: "A winner has been picked",
    });
  }

  return (
    <div>
      <h2>Lottery Contract!</h2>
      <p>This contract is managed by {data.manager}</p>
      <p>
        There are currently {data.players.length} people entered, competing to
        win {web3.utils.fromWei(data.balance, "ether")} ether.
      </p>
      <hr />
      <form
        onSubmit={(event) => {
          onSubmit(event);
        }}
      >
        <h4>Want to try your luck?</h4>
        <div>
          <label htmlFor="">Amout of ether to enter</label>
          <input
            type="text"
            value={data.value}
            onChange={(event) => {
              setData({ ...data, value: event.target.value });
            }}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h1>{data.message}</h1>
      <hr />
      {data.manager === data.accounts[0] && (
        <div>
          <h4>Ready to pick a winner?</h4>
          <button
            onClick={() => {
              chooseWinner();
            }}
          >
            Pick a winner
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
