import { Box, Typography, CircularProgress } from "@mui/material";
import { FieldArrayWithId } from "react-hook-form";
import useAppConfig from "@/hooks/useAppConfig/useAppConfig";
import { useEffect } from "react";
import { AttendanceEditInputs } from "../../common";

export default function NoRestTimeMessage({
  restFields,
}: {
  restFields: FieldArrayWithId<AttendanceEditInputs, "rests", "id">[];
}) {
  const { getLunchRestStartTime, getLunchRestEndTime, loading } =
    useAppConfig();

  if (loading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  const lunchRestStartTime = getLunchRestStartTime().format("HH:mm");
  const lunchRestEndTime = getLunchRestEndTime().format("HH:mm");

  if (restFields.length >= 1) {
    return null;
  }

  return (
    <Box>
      <Typography variant="body1">休憩時間はありません</Typography>
      <Typography variant="body1">
        ※昼休憩は退勤打刻の際に{lunchRestStartTime}〜{lunchRestEndTime}
        で自動打刻されます
      </Typography>
    </Box>
  );
}
