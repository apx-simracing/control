import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


interface Props {
  penalty: number;
  name: string;
  secret: string;
  target: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function PenaltyDialog(props: Props) {
  const [open, setOpen] = React.useState(true);
  const [reason, setReason] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    props.onClose()
  };

  const handleConfirm = () => {
    props.onConfirm(!reason ? "No reason given" : reason)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Penalty or lap correct for {props.name} </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add an optional info for the participant why the penalty or the lap change was assigned.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Reason"
          type="text"
          fullWidth
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            const reason = event.target.value as string;
            setReason(reason)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
          </Button>
        <Button onClick={handleConfirm} color="primary">
          Assign
          </Button>
      </DialogActions>
    </Dialog>
  );
}