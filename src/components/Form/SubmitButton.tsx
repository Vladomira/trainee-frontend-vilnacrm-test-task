import Button from '@mui/material/Button';
import React from 'react';

import styles from './Form.module.scss';

type SaveButtonProps = {
  isDisabled: boolean;
};

export default function SubmitButton({ isDisabled }: SaveButtonProps) {
  return (
    <Button
      variant="contained"
      disabled={isDisabled}
      size="medium"
      type="submit"
      data-testid="submit-button"
      className={styles.saveButton}
      sx={{
        backgroundColor: isDisabled ? 'rgb(168, 207, 230)' : 'rgb(30, 174, 255)',
        '&.Mui-disabled': {
          backgroundColor: 'rgb(168, 207, 230)',
        },
      }}
    >
      Submit
    </Button>
  );
}
