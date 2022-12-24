const redis = require("redis");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 3000;
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Event listener
async function eventsHandler(request, response) {
  try {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const newSubscriber = redis.createClient();
    await newSubscriber.connect();
    await newSubscriber.subscribe("chat", message => {
      const data = `data: ${JSON.stringify([message])}\n\n`;
      response.write(data);
    });

    request.on("close", () => {
      newSubscriber.disconnect();
    });
  } catch (error) {
    console.log(error);
  }
}
app.get("/events", eventsHandler);

async function addMessage(request, response) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Connection: "close",
    };
    const newMessage = request.body;
    const newPublisher = redis.createClient();
    await newPublisher.connect();
    await newPublisher.publish("chat", JSON.stringify(newMessage));
    response.status(200).json({ data: 200 });
  } catch (error) {
    console.log("?M", error);
  }
}

app.post("/message", addMessage);

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});
