import Button from '@mui/material/Button';
import React from 'react';

type SaveButtonProps = {
  isDisabled: boolean;
  onHandleSubmit: (e: React.FormEvent) => Promise<void>;
};
function SaveButton({ isDisabled, onHandleSubmit }: SaveButtonProps) {
  return (
    <Button
      variant="outlined"
      disabled={isDisabled}
      size="medium"
      type="submit"
      onClick={onHandleSubmit}
      data-testid="save-button"
    >
      Save
    </Button>
  );
}

export default SaveButton;
