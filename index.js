const express = require('express');
const net = require('net');
const app = express();
const PORT = 3000;

app.get('/whois/:addr/:port?', async (req, res) => {
  const addr = req.params.addr;
  const port = req.params.port;
  const socketPath = req.header("socketPath");

  if (!addr)
    return res.status(400).send('Missing addr parameter');

  if (!socketPath)
    return res.status(404).send('Missing socket path header');

  const client = net.createConnection(socketPath, () => {
    const request = `GET /localapi/v0/whois?addr=${addr}${port ? ':' + port : ''} HTTP/1.1\r\nHost: local-tailscaled.sock\r\nConnection: close\r\n\r\n`;
    client.write(request);
  });

  let data = '';
  client.on('data', (chunk) => {
    data += chunk;
  });

  client.on('end', () => {
    const [header, body] = data.split('\r\n\r\n');

    try {
      const jsonStart = body.indexOf('{');
      const jsonEnd = body.lastIndexOf('}') + 1;
      const jsonBody = body.slice(jsonStart, jsonEnd);

      const jsonResponse = JSON.parse(jsonBody);
      const userProfile = jsonResponse.UserProfile;

      userProfile ? res.json(userProfile) : res.status(502).send('UserProfile not found');
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(502).send('Bad Gateway');
    }
  });

  client.on('error', (err) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
