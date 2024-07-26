import React from 'react';
import { LuSprout } from 'react-icons/lu';
import { PiPottedPlantBold } from 'react-icons/pi';
import { GiForest } from 'react-icons/gi';
import { FaTree } from 'react-icons/fa';
import { FaEarthAsia } from 'react-icons/fa6';
import { GiHeraldicSun } from 'react-icons/gi';

const Contribution = ({ contribute }) => {
  const handleContribute = () => {
    if (contribute === 0) {
      return <LuSprout style={{ color: '#08ff73' }} />;
    } else if (0 < contribute && contribute < 10) {
      return <PiPottedPlantBold style={{ color: '#ff9a3b' }} />;
    } else if (9 < contribute && contribute < 25) {
      return <FaTree style={{ color: '#422102' }} />;
    } else if (24 < contribute && contribute < 60) {
      return <GiForest style={{ color: '#002902' }} />;
    } else if (59 < contribute && contribute < 200) {
      return <FaEarthAsia style={{ color: '#0a77f5' }} />;
    } else if (contribute > 199) {
      return <GiHeraldicSun style={{ color: '#ff0000' }} />;
    }
  };

  return <div>{handleContribute()}</div>;
};

export default Contribution;
