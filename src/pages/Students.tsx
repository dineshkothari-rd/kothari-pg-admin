import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import {
  currentMonth,
  currentYear,
  formatPaymentDate,
  getCurrentMonthPaid,
  getPaymentProgress,
  sendWhatsAppBill,
} from "../shared/helpers";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import TableSortLabel from "@mui/material/TableSortLabel";
import CountUp from "react-countup";
import { Drawer } from "@mui/material";
import type { Payment, SortField, Student } from "../shared/types";

/* -------- PG Capacity -------- */

const SINGLE_TOTAL_SEATS = 10;
const DOUBLE_TOTAL_SEATS = 14;

export default function Students() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orderBy, setOrderBy] = useState<SortField>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerStudent, setDrawerStudent] = useState<Student | null>(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  const openMenu = Boolean(anchorEl);
  /* -------- States -------- */

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "9876543210",
      roomType: "Single",
      monthlyFee: 7500,
      payments: [
        {
          id: "p1",
          month: currentMonth,
          year: currentYear,
          amountPaid: 7500,
          date: new Date().toISOString(),
          mode: "UPI",
        },
      ],
    },
    {
      id: 2,
      name: "Amit Verma",
      phone: "9123456780",
      roomType: "Double",
      monthlyFee: 6500,
      payments: [
        {
          id: "p2",
          month: currentMonth,
          year: currentYear,
          amountPaid: 4000,
          date: new Date().toISOString(),
          mode: "Cash",
        },
      ],
    },
    {
      id: 3,
      name: "Vikas Singh",
      phone: "9988776655",
      roomType: "Single",
      monthlyFee: 7500,
      payments: [],
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

  const occupancyPercentage =
    totalSeats === 0 ? 0 : Math.round((totalOccupied / totalSeats) * 100);

  /* -------- Financial Logic -------- */

  const totalStudents = students.length;

  const totalRevenue = students.reduce((sum, s) => sum + s.monthlyFee, 0);

  const totalCollected = students.reduce(
    (sum, s) => sum + getCurrentMonthPaid(s),
    0,
  );

  const totalDue = totalRevenue - totalCollected;

  /* -------- Filtering -------- */

  const filteredStudents = students.filter((student) => {
    const paid = getCurrentMonthPaid(student);
    const due = student.monthlyFee - paid;

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
        prev.map((student) => {
          if (student.id !== editingId) return student;

          let updatedPayments = student.payments;

          if (paidAmount > 0) {
            updatedPayments = [
              {
                id: crypto.randomUUID(),
                month: currentMonth,
                year: currentYear,
                amountPaid: paidAmount,
                date: new Date().toISOString(),
                mode: "Cash",
              },
            ];
          }

          return {
            ...student,
            name: formData.name,
            phone: formData.phone,
            roomType: formData.roomType,
            monthlyFee,
            payments: updatedPayments,
          };
        }),
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
        payments: paidAmount
          ? [
              {
                id: crypto.randomUUID(),
                month: currentMonth,
                year: currentYear,
                amountPaid: paidAmount,
                date: new Date().toISOString(),
                mode: "Cash",
              },
            ]
          : [],
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
    setStudents((prev) => prev.filter((student) => student.id !== id));

    if (drawerStudent?.id === id) {
      setDrawerStudent(null);
      setOpenDrawer(false);
    }
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

  const handleSort = (property: SortField) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const getValue = (student: Student) => {
      const paid = getCurrentMonthPaid(student);
      const due = student.monthlyFee - paid;

      switch (orderBy) {
        case "name":
          return student.name;

        case "monthlyFee":
          return student.monthlyFee;

        case "paid":
          return paid;

        case "due":
          return due;

        default:
          return student.name;
      }
    };

    const aValue = getValue(a);
    const bValue = getValue(b);

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }

    return order === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleMarkPaid = (studentId: number) => {
    let newPayment: Payment | null = null;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        const paid = getCurrentMonthPaid(s);
        const remaining = s.monthlyFee - paid;

        if (remaining <= 0) return s;

        newPayment = {
          id: crypto.randomUUID(),
          month: currentMonth,
          year: currentYear,
          amountPaid: remaining,
          date: new Date().toISOString(),
          mode: "Cash",
        };

        return {
          ...s,
          payments: [...s.payments, newPayment],
        };
      }),
    );

    if (newPayment) {
      setDrawerStudent((prev) =>
        prev && prev.id === studentId
          ? { ...prev, payments: [...prev.payments, newPayment!] }
          : prev,
      );
    }
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
          { label: "Revenue", value: totalRevenue, prefix: "₹" },
          { label: "Due", value: totalDue, prefix: "₹" },
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
                <CountUp
                  end={item.value}
                  duration={1.2}
                  prefix={item.prefix || ""}
                />
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Occupancy
        </Typography>

        <Typography variant="h6" fontWeight={700} mb={2}>
          {occupancyPercentage}% Occupied
        </Typography>

        <Box
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#e5e7eb",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${occupancyPercentage}%`,
              height: "100%",
              background:
                occupancyPercentage > 80
                  ? "#10b981"
                  : occupancyPercentage > 50
                    ? "#f59e0b"
                    : "#ef4444",
              transition: "width 0.5s ease",
            }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          {totalOccupied} of {totalSeats} seats filled
        </Typography>
      </Box>

      {/* -------- Table -------- */}
      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {sortedStudents.map((student) => {
            const due = student.monthlyFee - getCurrentMonthPaid(student);

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

                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, student)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Typography variant="body2">
                  Room: {student.roomType}
                </Typography>

                <Typography variant="body2">
                  Fee: ₹{student.monthlyFee}
                </Typography>

                <Typography variant="body2">
                  Paid: ₹{getCurrentMonthPaid(student)}
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
                <TableCell
                  sortDirection={orderBy === "name" ? order : false}
                  sx={{ fontWeight: 600 }}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                <TableCell
                  sortDirection={orderBy === "monthlyFee" ? order : false}
                  sx={{ fontWeight: 600 }}
                >
                  <TableSortLabel
                    active={orderBy === "monthlyFee"}
                    direction={orderBy === "monthlyFee" ? order : "asc"}
                    onClick={() => handleSort("monthlyFee")}
                  >
                    Fee
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "paid" ? order : false}
                  sx={{ fontWeight: 600 }}
                >
                  <TableSortLabel
                    active={orderBy === "paid"}
                    direction={orderBy === "paid" ? order : "asc"}
                    onClick={() => handleSort("paid")}
                  >
                    Paid
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedStudents.map((student) => {
                const due = student.monthlyFee - getCurrentMonthPaid(student);

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
                    <TableCell
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDrawerStudent(student);
                        setOpenDrawer(true);
                      }}
                    >
                      {student.name}
                    </TableCell>

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
                    <TableCell>₹{getCurrentMonthPaid(student)}</TableCell>
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
            minWidth: 220,
            boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
            p: 1,
          },
        }}
      >
        {selectedStudent && (
          <>
            {/* Mark Paid */}
            {selectedStudent.monthlyFee - getCurrentMonthPaid(selectedStudent) >
              0 && (
              <MenuItem
                onClick={() => {
                  handleMarkPaid(selectedStudent.id);
                  handleMenuClose();
                }}
                sx={{ borderRadius: 2 }}
              >
                <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
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
                  paidAmount: getCurrentMonthPaid(selectedStudent).toString(),
                });
                setOpen(true);
                handleMenuClose();
              }}
              sx={{ borderRadius: 2 }}
            >
              <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>

            {/* WhatsApp */}
            <MenuItem
              onClick={() => {
                sendWhatsAppBill({
                  name: selectedStudent.name,
                  phone: selectedStudent.phone,
                  monthlyFee: selectedStudent.monthlyFee,
                  paidAmount: getCurrentMonthPaid(selectedStudent),
                });
                handleMenuClose();
              }}
              sx={{ borderRadius: 2 }}
            >
              <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: "#25D366" }} />
              Send WhatsApp Bill
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Delete */}
            <MenuItem
              onClick={() => {
                setConfirmDelete(true);
                handleMenuClose();
              }}
              sx={{
                borderRadius: 2,
                color: "error.main",
              }}
            >
              <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this student?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (selectedStudent) {
                handleDelete(selectedStudent.id);
              }
              setConfirmDelete(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "50%" },
            top: "64px",
            height: "calc(100% - 64px)",
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        {drawerStudent && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#6366f1",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 20,
                }}
              >
                {drawerStudent.name.charAt(0)}
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {drawerStudent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {drawerStudent.phone}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Info Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: 2,
                columnGap: 2,
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Room
              </Typography>
              <Typography fontWeight={600}>{drawerStudent.roomType}</Typography>

              <Typography variant="body2" color="text.secondary">
                Monthly Fee
              </Typography>
              <Typography fontWeight={600}>
                ₹{drawerStudent.monthlyFee}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Paid
              </Typography>

              {drawerStudent.payments
                .slice()
                .reverse()
                .map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      ₹{p.amountPaid}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {p.mode} • {formatPaymentDate(p.date)}
                    </Typography>
                  </Box>
                ))}

              <Typography variant="body2" color="text.secondary">
                Due
              </Typography>
              <Typography
                fontWeight={600}
                color={
                  drawerStudent.monthlyFee -
                    getCurrentMonthPaid(drawerStudent) >
                  0
                    ? "error.main"
                    : "success.main"
                }
              >
                ₹{drawerStudent.monthlyFee - getCurrentMonthPaid(drawerStudent)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Payment Progress{" "}
                </Typography>
                <Chip
                  size="small"
                  label={
                    drawerStudent.monthlyFee -
                      getCurrentMonthPaid(drawerStudent) ===
                    0
                      ? "Fully Paid"
                      : "Payment Due"
                  }
                  color={
                    drawerStudent.monthlyFee -
                      getCurrentMonthPaid(drawerStudent) ===
                    0
                      ? "success"
                      : "error"
                  }
                />
              </Stack>

              <Box
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 5,
                  background: "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${getPaymentProgress(drawerStudent)}%`,
                    height: "100%",
                    background:
                      getPaymentProgress(drawerStudent) === 100
                        ? "#10b981"
                        : "#6366f1",
                    transition: "width 0.4s",
                  }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                ₹{getCurrentMonthPaid(drawerStudent)} / ₹
                {drawerStudent.monthlyFee}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              {drawerStudent.monthlyFee - getCurrentMonthPaid(drawerStudent) >
                0 && (
                <>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setOpenPaymentModal(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Add Payment
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        handleMarkPaid(drawerStudent.id);
                        setDrawerStudent(null);
                        setOpenDrawer(false);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Mark Paid
                    </Button>
                  </Box>
                  <Button
                    startIcon={<WhatsAppIcon />}
                    fullWidth
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      background: "#25D366",
                      "&:hover": { background: "#1ebe5d" },
                    }}
                    variant="contained"
                    onClick={() =>
                      sendWhatsAppBill({
                        name: drawerStudent.name,
                        phone: drawerStudent.phone,
                        monthlyFee: drawerStudent.monthlyFee,
                        paidAmount: getCurrentMonthPaid(drawerStudent),
                      })
                    }
                  >
                    Send WhatsApp Reminder
                  </Button>
                </>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setDrawerStudent(null);
                  setOpenDrawer(false);
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
      <Dialog
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      >
        <DialogTitle>Add Payment</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Amount"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />

          <TextField
            select
            label="Payment Mode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={() => {
              if (!drawerStudent) return;

              const newPayment: Payment = {
                id: crypto.randomUUID(),
                month: currentMonth,
                year: currentYear,
                amountPaid: Number(paymentAmount),
                date: new Date().toISOString(),
                mode: paymentMode as "Cash" | "UPI" | "Bank",
              };

              setStudents((prev) =>
                prev.map((s) =>
                  s.id === drawerStudent.id
                    ? { ...s, payments: [...s.payments, newPayment] }
                    : s,
                ),
              );

              setDrawerStudent((prev) =>
                prev
                  ? { ...prev, payments: [...prev.payments, newPayment] }
                  : prev,
              );

              setPaymentAmount("");
              setOpenPaymentModal(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
