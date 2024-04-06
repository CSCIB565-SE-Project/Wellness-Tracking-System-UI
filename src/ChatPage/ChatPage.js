//ChatPage.js
//Remove Add channel button...
//Fix login button...
//Add users and all admins to support channel upon chat access...
//Change Dashboard role
import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { ChannelListContainer, ChannelContainer } from './components';
import 'stream-chat-react/dist/css/index.css';
import './Chat.css';

const apiKey = 'v5zqy2qw283c';
const client = StreamChat.getInstance(apiKey);

const ChatPage = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="app__wrapper">
                <Chat client={client} >
                    <ChannelListContainer 
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                    />
                    <ChannelContainer 
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        createType={createType}
                    />
                </Chat>
        </div>
    );
};

export default ChatPage;
