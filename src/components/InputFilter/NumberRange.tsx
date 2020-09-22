import { Input, InputNumber } from 'antd';
import React, { FC } from 'react';
import './NumberRange.less';

// (str) => typeof str === 'string' ? str.replace(/^[^1-9]|[^0-9]/g, '') : '' + str || ''

const NumberRange: FC<{ value?: string; onChange?: Function }> = () => {
  return (
    <Input.Group className="site-input-group-wrapper" compact>
      <Input
        className="site-input-left"
        style={{ width: 105, textAlign: 'center' }}
        placeholder="Minimum"
      />
      <Input
        className="site-input-split"
        style={{
          width: 30,
          borderLeft: 0,
          borderRight: 0,
          pointerEvents: 'none',
          backgroundColor: 'white',
        }}
        placeholder="~"
        disabled
      />
      <Input
        className="site-input-right"
        style={{ width: 105, textAlign: 'center' }}
        placeholder="Maximum"
      />
    </Input.Group>
  );
};

export default NumberRange;
