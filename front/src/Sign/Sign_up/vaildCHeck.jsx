import React from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { IoCloseSharp } from 'react-icons/io5';

const vaildCHeck = (vaildCheck) => {
  return vaildCheck ? (
    <IoCheckmarkSharp
      style={{
        color: ' rgb(67, 197, 67) ',
        lineHeight: '30px',
        height: '100%',

        marginLeft: '15px',
      }}
    />
  ) : (
    <IoCloseSharp
      style={{
        color: ' rgb(250, 52, 52) ',
        lineHeight: '30px',
        height: '100%',
        marginLeft: '15px',
      }}
    />
  );
};

export default vaildCHeck;
