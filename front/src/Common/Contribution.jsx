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
      return <LuSprout style={{ color: 'green' }} />;
    } else if (0 < contribute && contribute < 10) {
      return <PiPottedPlantBold style={{ color: 'green' }} />;
    } else if (9 < contribute && contribute < 25) {
      return <FaTree style={{ color: 'green' }} />;
    } else if (24 < contribute && contribute < 60) {
      return <GiForest style={{ color: 'green' }} />;
    } else if (59 < contribute && contribute < 200) {
      return <FaEarthAsia style={{ color: 'green' }} />;
    } else if (contribute > 199) {
      return <GiHeraldicSun style={{ color: 'red' }} />;
    }
  };

  return <div>{handleContribute()}</div>;
};

export default Contribution;
