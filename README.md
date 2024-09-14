# tailFetch
> A very simple node server to fetch tailscale user profile 
>

## Installation

Clone the repo
```git
git clone https://github.com/IdanKoblik/tailFetch.git
cd tailFetch/
```

Install npm packages
```git
npm install
```

Run the app
```
node .
```

## API Reference

#### Add node to the API

```http
Content-Type: application/json
socketPath: /path/to/socket

GET /whois/:addr/[port]
```

## Enjoy

