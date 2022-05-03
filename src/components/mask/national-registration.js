import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

export const NationalRegistrationMask = (props) => {
  const { inputRef, ...other } = props;
  const [mask, setMask] = useState({
    type: 'cpf',
    pattern: [
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
    ],
  });

  const handleChange = (event) => {
    const value = event.target.value.replace(/\D/gi, '');
    console.log(value);
    if (mask.type === 'cpf' && value.length > 11) {
      setMask({
        type: 'cnpj',
        pattern: [
          /\d/,
          /\d/,
          '.',
          /\d/,
          /\d/,
          /\d/,
          '.',
          /\d/,
          /\d/,
          /\d/,
          '/',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
        ],
      });
    }

    if (mask.type === 'cnpj' && value.length <= 11) {
      setMask({
        type: 'cpf',
        pattern: [
          /\d/,
          /\d/,
          /\d/,
          '.',
          /\d/,
          /\d/,
          /\d/,
          '.',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
        ],
      });
    }
  };

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      onChange={handleChange}
      mask={mask.pattern}
      placeholderChar={'\u2000'}
      showMask={false}
      guide={false}
    />
  );
};

NationalRegistrationMask.propTypes = {
  inputRef: PropTypes.func.isRequired,
};
