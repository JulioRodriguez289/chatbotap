"use client";

import { Box, Button, Stack, TextField, AppBar, Toolbar, IconButton, Menu as MenuIcon, Typography, ThemeProvider } from "@mui/material";
import { useState } from "react";

// Navbar Component
const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor:"#22223b", color:'white' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <Button color="inherit">Login</Button>
        <Button color="inherit">Sign Up</Button>
      </Toolbar>
    </AppBar>
  );
};

// Home Component
export default function Home() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi I'm the headstarter Support Agent, how can I assist you today",
  }]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const apiResponse = fetch("/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (apiResponse) => {
      const reader = apiResponse.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            },
          ];
        });

        return reader.read().then(processText);
      });
    });
    setMessage(""); // Clears the input field
  }

  return (
    <Box>
      <Navbar/>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        backgroundColor="#4a4e69"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="column"
          width="600px"
          height="700px"
          border="1px solid black"
          p={2}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "#D1D0E2",
            color: "#333",
          }}
        >
          <Stack
            direction="column"
            spacing={3}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant" ? "primary.main" : "secondary.main"
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
