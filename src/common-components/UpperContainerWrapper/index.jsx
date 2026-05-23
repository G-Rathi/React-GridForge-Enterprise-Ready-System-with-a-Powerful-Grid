import React, { useEffect } from 'react';
import styles from './UpperContainerWrapper.module.scss';
import { BottomWrapperMethods } from '../BottomContainerWrapper';

const UpperContainerWrapper = ({ children, style = {} }) => {
  // 🔹 componentDidMount equivalent
  useEffect(() => {
    const bottomMethods = BottomWrapperMethods;
    const calcBottomHeight =
      bottomMethods && bottomMethods()?.calcWrapperHeight;

    calcBottomHeight && calcBottomHeight();
  }, []);

  return (
    <div
      id="upperSectionContainer"
      className={styles.container}
      style={{
        width: '100%',
        height: style.height || '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default UpperContainerWrapper;