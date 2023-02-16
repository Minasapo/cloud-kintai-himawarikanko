import { Box, Stack } from "@mui/material";
import Menu from "../../components/menu/Menu";

function AdminDashboard() {
  return (
    <Stack sx={{ px: "10%" }}>
      <Box sx={{ height: "50px" }}>
        <Menu />
      </Box>
    </Stack>
  );
}
export default AdminDashboard;
