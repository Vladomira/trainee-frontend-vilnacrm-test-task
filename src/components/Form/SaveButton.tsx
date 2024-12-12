import Button from '@mui/material/Button';
import React, { FormEvent } from 'react';

import styles from './Form.module.css';

type SaveButtonProps = {
  isDisabled: boolean;
  onHandleSubmit: (e: FormEvent<Element>) => Promise<void>;
};

export default function SaveButton({ isDisabled, onHandleSubmit }: SaveButtonProps) {
  return (
    <Button
      variant="contained"
      disabled={isDisabled}
      size="medium"
      type="submit"
      onClick={onHandleSubmit}
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
