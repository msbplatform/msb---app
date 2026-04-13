import React from 'react';
import { useParams } from 'react-router-dom';
import PublicProfile from './PublicProfile';
import PrivateProfile from './PrivateProfile';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  
  // If userId is provided in the URL, show public profile
  // Otherwise, show private profile for logged-in user
  if (userId) {
    return <PublicProfile />;
  }
  
  return <PrivateProfile />;
};

export default Profile;
