import './App.css';
import {Box, Button, List, ListItem, TextField, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import Avatar from "react-avatar";

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);

    const {sendJsonMessage, lastJsonMessage, readyState} = useWebSocket("ws://localhost:8080", {
        share: true,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            switch (lastJsonMessage.type) {
                case "EXISTING_USERS":
                    setUsers(lastJsonMessage.users)
                    break;
                case "NEW_USER":
                    // check the user was not added before
                    if (users.filter(user => user.id === lastJsonMessage.user.id).length === 0) {
                        setUsers((prev) => ([...prev, lastJsonMessage.user]));
                    }
                    break;
                case "USER_DISCONNECTED":
                    // check that the user was not removed before
                    const remainingUsers = users.filter(user => user.id !== lastJsonMessage.user.id);
                    if (remainingUsers.length < users.length) {
                        setUsers(remainingUsers);
                    }
                    break;
                default:
                    console.log(`Default case ${lastJsonMessage}`);
            }
        }
    }, [lastJsonMessage, users, setUsers]);

    const handleClick = useCallback(() => {
        setAuthenticated(true);
        if (readyState === WebSocket.OPEN) {
            sendJsonMessage(name);
        }
    }, [name, sendJsonMessage, readyState])

    return (
        <Box className="App" sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {
                !authenticated &&
                <Box noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        type={"submit"}
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        onClick={handleClick}
                    >
                        Connect
                    </Button>
                </Box>
            }
            {
                authenticated &&
                <Box sx={{mt: 1}}>
                    <Typography>
                        Currently logged in users
                    </Typography>
                    <List>
                        {
                            users.map(user => (
                                <ListItem key={user.id}>
                                    <Avatar value={user.name}/>
                                </ListItem>))
                        }
                    </List>
                </Box>
            }
        </Box>
    );
}

export default App;
