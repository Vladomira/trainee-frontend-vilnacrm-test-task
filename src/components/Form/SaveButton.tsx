import Button from '@mui/material/Button';
import React from 'react';

import styles from './Form.module.scss';

type SaveButtonProps = {
  isDisabled: boolean;
};

export default function SaveButton({ isDisabled }: SaveButtonProps) {
  return (
    <Button
      variant="contained"
      disabled={isDisabled}
      size="medium"
      type="submit"
      data-testid="save-button"
      className={styles.saveButton}
      sx={{
        backgroundColor: isDisabled ? 'rgb(168, 207, 230)' : 'rgb(30, 174, 255)',
      }}
    >
      Save
    </Button>
  );
}
