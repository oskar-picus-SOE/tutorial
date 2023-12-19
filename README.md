# Server-side notifications in a React application using WebSockets

## Server-side notifications

Server-side notifications refer to a mechanism where a server sends information or updates to connected clients or other servers. These notifications are often used in web development, mobile app development, and other distributed systems to keep clients informed about changes or events that occur on the server.

There are multiple ways in which server-side notifications can be implemented:

* Server-Sent Events (SSE) - it is a simple and efficient protocol for sending real-time updates from a server to a web browser over a single HTTP connection. SSE is designed for scenarios where the server needs to push information to the client without the client explicitly requesting it
* HTTP polling - it is a technique used for client-server communication in which the client repeatedly sends requests to the server, asking if there are any updates or changes. The server responds to each request, indicating whether there is new information available. This approach allows the client to receive updates from the server without the need for the server to initiate communication
* Websockets - they provide a bidirectional communication channel between the server and clients. They are suitable for real-time applications where low latency is important

## WebSockets

WebSockets are a communication protocol that provides full-duplex communication channels over a single, long-lived connection between clients and servers. Unlike traditional HTTP connections, which are request-response based and stateless, WebSockets enable bidirectional communication, allowing data to be sent in both directions at any time.

Some key features of Websockets include:

* full-duplex communication, allowing data to be transmitted in both directions simultaneously
* persistent connection, compared to traditional HTTP, which involves opening a new connection for each request and closing it afterward. This technique reduces the overhead of repeatedly establishing and tearing down connections
* low latency
* efficient communication, since Websockets use a lightweight protocol

## Implementation

For demonstration purposes, we have implemented a web application where users need to input their name and then they will be able to see which other users are connected.

### Server

The server is implemented using NodeJS and the `ws` library. We have first created a WebSocket server which listens on a particular port. We then need to define callbacks for the following events:

* `connection` - when a client connects to our server, we save its connection details based on a newly generated UUID and send the already connected users
* `message` - when a client sends a message i.e. the name that was inputed, we send to the other clients a message, signaling that a new client has connected to the application
* `close` - when a client disconnects, we remove its connection details and send a message to the remaining clients that the user has disconnected

### Client

The client is a React application which uses the `react-use-websocket` for communicating with the server. We first open a connection to the server using the `useWebsocket` hook, which returns multiple fields, of which we are using the following:

* sendJsonMessage - for sending a message to the server which be converted to a JSON string
* lastJsonMessage - a JSON-parsed of the message that the server has sent
* readyState - representing the state of the WebSocket i.e. `OPEN` means the WebSocket can allow messages to be sent

The client maintains a state of the users that are currently connected and updates it according to the messages it receives from the server.