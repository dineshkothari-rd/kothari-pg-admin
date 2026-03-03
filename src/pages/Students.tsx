import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { sendWhatsAppBill } from "../utils/helpers";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";

interface Student {
  id: number;
  name: string;
  phone: string;
  roomType: string;
  monthlyFee: number;
  paidAmount: number;
}

/* -------- PG Capacity -------- */

const SINGLE_TOTAL_SEATS = 10;
const DOUBLE_TOTAL_SEATS = 14;

export default function Students() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const openMenu = Boolean(anchorEl);
  /* -------- States -------- */

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "9876543210",
      roomType: "Single",
      monthlyFee: 7500,
      paidAmount: 7500,
    },
    {
      id: 2,
      name: "Amit Verma",
      phone: "9123456780",
      roomType: "Double",
      monthlyFee: 6500,
      paidAmount: 4000,
    },
    {
      id: 3,
      name: "Vikas Singh",
      phone: "9988776655",
      roomType: "Single",
      monthlyFee: 7500,
      paidAmount: 0,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    roomType: "",
    monthlyFee: "",
    paidAmount: "",
  });

  /* -------- Seat Logic -------- */

  const singleOccupied = students.filter((s) => s.roomType === "Single").length;

  const doubleOccupied = students.filter((s) => s.roomType === "Double").length;

  const totalSeats = SINGLE_TOTAL_SEATS + DOUBLE_TOTAL_SEATS;
  const totalOccupied = singleOccupied + doubleOccupied;
  const totalVacant = totalSeats - totalOccupied;

  /* -------- Financial Logic -------- */

  const totalStudents = students.length;

  const totalRevenue = students.reduce((sum, s) => sum + s.monthlyFee, 0);

  const totalCollected = students.reduce((sum, s) => sum + s.paidAmount, 0);

  const totalDue = totalRevenue - totalCollected;

  /* -------- Filtering -------- */

  const filteredStudents = students.filter((student) => {
    const due = student.monthlyFee - student.paidAmount;

    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.phone.includes(search);

    const matchesRoom = roomFilter === "All" || student.roomType === roomFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Paid" && due === 0) ||
      (statusFilter === "Due" && due > 0);

    return matchesSearch && matchesRoom && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearch("");
    setRoomFilter("All");
    setStatusFilter("All");
  };

  /* -------- Save Student -------- */

  const handleSaveStudent = () => {
    setError("");

    const monthlyFee = Number(formData.monthlyFee);
    const paidAmount = Number(formData.paidAmount);

    if (!formData.name || !formData.roomType) {
      setError("Name and Room Type required");
      return;
    }

    if (editingId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingId
            ? {
                ...student,
                name: formData.name,
                phone: formData.phone,
                roomType: formData.roomType,
                monthlyFee,
                paidAmount,
              }
            : student,
        ),
      );
    } else {
      if (
        formData.roomType === "Single" &&
        singleOccupied >= SINGLE_TOTAL_SEATS
      ) {
        setError("No Single seats available!");
        return;
      }

      if (
        formData.roomType === "Double" &&
        doubleOccupied >= DOUBLE_TOTAL_SEATS
      ) {
        setError("No Double seats available!");
        return;
      }

      const newStudent: Student = {
        id: Date.now(),
        name: formData.name,
        phone: formData.phone,
        roomType: formData.roomType,
        monthlyFee,
        paidAmount,
      };

      setStudents([...students, newStudent]);
    }

    setOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      phone: "",
      roomType: "",
      monthlyFee: "",
      paidAmount: "",
    });
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    student: Student,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 6 }}>
      {/* -------- Header -------- */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
          >
            Students
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage PG residents and payments
          </Typography>
        </Box>

        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            px: 3,
            color: "#fff",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            },
          }}
        >
          Add Student
        </Button>
      </Box>

      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff, #f8fafc)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Search by name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Room Type"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Double">Double</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Payment Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Due">Due</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ height: 40, borderRadius: 2 }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* -------- Summary Cards -------- */}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Students", value: totalStudents },
          { label: "Vacant Seats", value: totalVacant },
          { label: "Revenue", value: `₹${totalRevenue}` },
          { label: "Due", value: `₹${totalDue}` },
        ].map((item, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                border: "1px solid rgba(0,0,0,0.05)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h6" fontWeight={700} mt={1}>
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* -------- Table -------- */}
      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredStudents.map((student) => {
            const due = student.monthlyFee - student.paidAmount;

            return (
              <Box
                key={student.id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#ffffff",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={600}>{student.name}</Typography>
                    <Chip
                      label={due === 0 ? "Paid" : "Due"}
                      size="small"
                      color={due === 0 ? "success" : "error"}
                    />
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, student)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="body2">
                  Room: {student.roomType}
                </Typography>

                <Typography variant="body2">
                  Fee: ₹{student.monthlyFee}
                </Typography>

                <Typography variant="body2">
                  Paid: ₹{student.paidAmount}
                </Typography>

                <Typography variant="body2">Due: ₹{due}</Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Paid</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStudents.map((student) => {
                const due = student.monthlyFee - student.paidAmount;

                return (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      backgroundColor: due > 0 ? "#fff7ed" : "inherit",
                      "&:hover": {
                        backgroundColor: due > 0 ? "#ffedd5" : "#f8fafc",
                      },
                    }}
                  >
                    <TableCell>{student.name}</TableCell>

                    <TableCell>
                      <Chip
                        label={student.roomType}
                        size="small"
                        color={
                          student.roomType === "Single"
                            ? "primary"
                            : "secondary"
                        }
                      />
                    </TableCell>

                    <TableCell>₹{student.monthlyFee}</TableCell>
                    <TableCell>₹{student.paidAmount}</TableCell>
                    <TableCell>₹{due}</TableCell>

                    <TableCell>
                      <Chip
                        label={due === 0 ? "Paid" : "Due"}
                        size="small"
                        color={due === 0 ? "success" : "error"}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuOpen(e, student)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* -------- Dialog -------- */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingId ? "Edit Student" : "Add Student"}</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <TextField
            select
            label="Room Type"
            value={formData.roomType}
            onChange={(e) =>
              setFormData({ ...formData, roomType: e.target.value })
            }
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
          </TextField>

          <TextField
            label="Monthly Fee"
            type="number"
            value={formData.monthlyFee}
            onChange={(e) =>
              setFormData({ ...formData, monthlyFee: e.target.value })
            }
          />

          <TextField
            label="Paid Amount"
            type="number"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData({ ...formData, paidAmount: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStudent}>
            {editingId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 180,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}
      >
        {selectedStudent && (
          <>
            {/* Mark Paid */}
            {selectedStudent.monthlyFee - selectedStudent.paidAmount > 0 && (
              <MenuItem
                onClick={() => {
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.id === selectedStudent.id
                        ? { ...s, paidAmount: s.monthlyFee }
                        : s,
                    ),
                  );
                  handleMenuClose();
                }}
              >
                Mark as Paid
              </MenuItem>
            )}

            {/* Edit */}
            <MenuItem
              onClick={() => {
                setEditingId(selectedStudent.id);
                setFormData({
                  name: selectedStudent.name,
                  phone: selectedStudent.phone,
                  roomType: selectedStudent.roomType,
                  monthlyFee: selectedStudent.monthlyFee.toString(),
                  paidAmount: selectedStudent.paidAmount.toString(),
                });
                setOpen(true);
                handleMenuClose();
              }}
            >
              Edit
            </MenuItem>

            {/* WhatsApp */}
            <MenuItem
              onClick={() => {
                sendWhatsAppBill({
                  name: selectedStudent.name,
                  phone: selectedStudent.phone,
                  monthlyFee: selectedStudent.monthlyFee,
                  paidAmount: selectedStudent.paidAmount,
                });
                handleMenuClose();
              }}
            >
              Send WhatsApp Bill
            </MenuItem>

            {/* Delete */}
            <MenuItem
              onClick={() => {
                handleDelete(selectedStudent.id);
                handleMenuClose();
              }}
              sx={{ color: "error.main" }}
            >
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}
