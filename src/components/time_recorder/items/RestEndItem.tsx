import { useState, useEffect } from "react";
import { Button, styled } from "@mui/material";
import { WorkStatus, WorkStatusCodes } from "../common";

const RestEndButton = styled(Button)(({ theme }) => ({
  color: theme.palette.rest.main,
  "&:hover": {
    color: theme.palette.rest.contrastText,
    backgroundColor: theme.palette.rest.main,
  },
  "&:disabled": {
    backgroundColor: "#E0E0E0",
  },
}));

export default function RestEndItem({
  workStatus,
  onClick,
}: {
  workStatus: WorkStatus | null;
  onClick: () => void;
}) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(workStatus?.code !== WorkStatusCodes.RESTING);
  }, [workStatus]);

  return (
    <RestEndButton
      onClick={() => {
        setDisabled(true);
        onClick();
      }}
      disabled={disabled}
    >
      休憩終了
    </RestEndButton>
  );
}
