import React, { useState, useEffect } from "react";

function Home() {
  const [messages, setMesssages] = useState([]);
  const [name, setName] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const events = new EventSource("http://localhost:3000/events");
    events.onmessage = event => {
      const parsedData = JSON.parse(JSON.parse(event.data)); //
      setMesssages(prev => prev.concat(parsedData));
    };
  }, []);
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          fetch("http://localhost:3000/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Connection: "close",
            },
            body: JSON.stringify({
              by: name,
              text: inputValue,
            }),
          });
        }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Message"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={"msg_" + index}>
            <p>Msg: {msg.text}</p>
            <span>By: {msg.by}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
