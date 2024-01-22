import { TableRow, TableCell } from "@mui/material";
import dayjs from "dayjs";

export default function WorkTimeTableRow({
  startTime,
  endTime,
}: {
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
}) {
  return (
    <TableRow>
      <TableCell>勤務時間</TableCell>
      <TableCell>
        {(() => {
          if (!startTime && !endTime) {
            return "(登録なし)";
          }

          return `${startTime?.format("HH:mm") ?? "--:--"} 〜 ${
            endTime?.format("HH:mm") ?? "--:--"
          }`;
        })()}
      </TableCell>
    </TableRow>
  );
}
