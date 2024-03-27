//ChatPage.js

import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';

import 'stream-chat-react/dist/css/index.css';
import './Chat.css';

const cookies = new Cookies();

const apiKey = 'v5zqy2qw283c';
// Change this to getting from the userdata
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

const userData = JSON.parse(localStorage.getItem('user'));

if (userData && userData.token) {
    client.connectUser({
        id: userData.id,
        name: userData.username,
        firstname: userData.fname,
        lastname: userData.lname,
        role: userData.role
    }, userData.token);
} else {
    // Redirect user to login or handle unauthenticated state
    // Refer to comment below returning the user to Auth, just send them to the login
}

// if(authToken) {
//     client.connectUser({
//         id: cookies.get('userId'),
//         name: cookies.get('username'),
//         fullName: cookies.get('fullName'),
//         image: cookies.get('avatarURL'),
//         hashedPassword: cookies.get('hashedPassword'),
//         phoneNumber: cookies.get('phoneNumber'),
//     }, authToken)
// }


const ChatPage = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    if(!authToken) return <Auth />//Change this to redirecting to login 

    return (
        <div className="app__wrapper">
            <Chat client={client} theme="team light">
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
}

export default ChatPage;
