import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Client } from "@xmtp/xmtp-js";
import { ethers } from 'ethers';
import Sidebar from '../components/Sidebar/Sidebar';

function CommunityPage() {
  const [community, setCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [xmtpClient, setXmtpClient] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const location = useLocation();
  const [error, setError] = useState(null);

  const initXmtp = useCallback(async () => {
    if (isInitializing || xmtpClient) return;
    setIsInitializing(true);

    try {
      if (!window.ethereum) {
        throw new Error("Ethereum wallet is not connected. Make sure MetaMask or another wallet is installed.");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const client = await Client.create(signer, { env: "production" });
      setXmtpClient(client);
    } catch (error) {
      console.error('Error initializing XMTP:', error);
      setError('Failed to initialize XMTP. Please make sure your wallet is connected.');
    } finally {
      setIsInitializing(false);
    }
  }, [xmtpClient, isInitializing]);

  const startConversation = useCallback(async (peerAddress) => {
    if (!xmtpClient) return;

    try {
      const canMessage = await xmtpClient.canMessage(peerAddress);
      if (!canMessage) {
        throw new Error("Recipient is not XMTP enabled.");
      }

      const conversation = await xmtpClient.conversations.newConversation(peerAddress);
      setConversation(conversation);

      const messages = await conversation.messages();
      setMessages(messages);

      // Start streaming messages
      for await (const message of await conversation.streamMessages()) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to start conversation. Please make sure the recipient is XMTP enabled.');
    }
  }, [xmtpClient]);

  useEffect(() => {
    const communityData = location.state?.community;
    if (communityData) {
      setCommunity(communityData);
      initXmtp();
    }
  }, [location, initXmtp]);

  useEffect(() => {
    if (xmtpClient && community) {
      startConversation(community.address);
    }
  }, [xmtpClient, community, startConversation]);

  const sendMessage = async () => {
    if (newMessage.trim() && conversation) {
      try {
        await conversation.send(newMessage);
        setNewMessage('');
      } catch (error) {
        setError('Failed to send message. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content community-page">
          <div className="chat-section">
            <div className="chat-header">
              <h2>{community ? community.name : 'Loading Chat...'}</h2>
              <p>{community ? `${community.name} Community` : ''}</p>
            </div>
            <div className="message-list">
              {messages.length === 0 && <p>No messages yet...</p>}
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <strong>{msg.senderAddress.slice(0, 6)}...</strong>: {msg.content}
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
        </main>
      </div>
    </div>
  );
}

export default CommunityPage;