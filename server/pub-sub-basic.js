const redis = require("redis");

const client = redis.createClient();
const subscriber = client.duplicate();

(async () => {
  await client.connect();
  await subscriber.connect();

  await subscriber.subscribe("notification", message => {
    console.log(message);
  });

  await client.publish("notification", "MESSAGE 1");
  await client.publish("notification", "MESSAGE 2");
})();
