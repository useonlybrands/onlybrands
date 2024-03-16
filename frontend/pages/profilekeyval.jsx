import React from 'react';

const ProfileKeyVal = ({ label, content }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <label className="text-gray-600 text-xs">{label}</label>
      <div className="mb-1 font-semibold">{content}</div>
    </div>
  );
};

export default ProfileKeyVal;