import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const channelByUser = async ({ client, setActiveChannel, channel, setChannel }) => {
  const filters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [client.user.id, client.userID] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel('messaging', { members: [channel.id, client.userID] });
  
  setChannel(newChannel)

  return setActiveChannel(newChannel);
};

const SearchResult = ({ channel, focusedId, type, setChannel, setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();

  // Helper function to determine if the channel should be displayed
  const shouldDisplayChannel = (channel) => {
    // Debugging: Log the current user's role
    console.log("Current user's role:", client.user.role);
    
    if (client.user.role !== 'user') {
      // If the role is not 'user', log that all channels will be displayed
      console.log("Not a 'user' role, displaying all channels.");
      return true;
    }
  
    // Attempt to find the other user's ID in the channel's members
    const otherUserId = Object.keys(channel.state.members).find(id => id !== client.user.id);
    // Debugging: Log the found other user's ID
    console.log("Other user's ID:", otherUserId);
  
    // Retrieve the other user's data
    const otherUser = channel.state.members[otherUserId];
    // Debugging: Log the other user's role
    console.log("Other user's role:", otherUser ? otherUser.role : "Other user not found");
  
    // Return true if the other user has a 'professional' role, false otherwise
    const isProfessional = otherUser && otherUser.role === 'professional';
    // Debugging: Log the final decision on whether to display the channel
    console.log("Display channel:", isProfessional);
  
    return isProfessional;
  };
  

  if (type === 'channel') {
    // Channel logic remains unchanged
    return (
      <div
        onClick={() => {
          setChannel(channel)
          if (setToggleContainer) {
            setToggleContainer(prevState => !prevState)
          }
        }}
        className={focusedId === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container'}
      >
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel.data.name}</p>
      </div>
    );
  } else if (type === 'user') {
    // Execute the logic for 'user' type only if shouldDisplayChannel returns true
    if (shouldDisplayChannel(channel)) {
      return (
        <div
          onClick={async () => {
            await channelByUser({ client, setActiveChannel, channel, setChannel });
            if (setToggleContainer) {
              setToggleContainer(prevState => !prevState);
            }
          }}
          className={focusedId === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container'}
        >
          <div className='channel-search__result-user'>
            <Avatar image={channel.image || undefined} name={channel.name} size={24} />
            <p className='channel-search__result-text'>{channel.name}</p>
          </div>
        </div>
      );
    } else {
      // When the channel should not be displayed based on the user role
      return null;
    }
  }

  // If neither 'channel' nor 'user', or if 'user' but should not display
  return null;
};


const ResultsDropdown = ({ teamChannels, directChannels, focusedId, loading, setChannel, setToggleContainer }) => {

  return (
    <div className='channel-search__results'>
      <p className='channel-search__results-header'>Channels</p>
      {loading && !teamChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className='channel-search__results-header'>
          <i>No channels found</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type='channel'
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
      <p className='channel-search__results-header'>Users</p>
      {loading && !directChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className='channel-search__res ults-header'>
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type='user'
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
    </div>
  );
};

export default ResultsDropdown;