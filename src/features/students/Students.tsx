import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
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
  Drawer,
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
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import CountUp from "react-countup";
import {
  currentMonth,
  currentYear,
  getCurrentMonthPaid,
  getPaymentProgress,
  sendWhatsAppBill,
} from "../../shared/helpers";
import type { SortField, Student } from "../../shared/types";

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
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

  const openMenu = Boolean(anchorEl);
  /* -------- States -------- */

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Dinesh Kothari",
      phone: "9812416721",

      fatherName: "Ramesh Kothari",
      age: 30,
      parentPhone: "9812416720",

      village: "Siwani",
      tehsil: "Siwani",
      district: "Bhiwani",
      state: "Haryana",

      occupation: "Employee at Sarvika Technologies Pvt Ltd",
      occupationAddress: "Jaipur",
      occupationPhone: "9876543210",

      referenceName: "Ramesh Kothari",
      referencePhone: "9812416720",

      idProofType: "Aadhar",
      idProofNumber: "483512094058",

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
    fatherName: "",
    age: "",
    phone: "",
    parentPhone: "",

    village: "",
    tehsil: "",
    district: "",
    state: "",

    occupation: "",
    occupationAddress: "",
    occupationPhone: "",

    referenceName: "",
    referencePhone: "",

    idProofType: "",
    idProofNumber: "",

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

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      fatherName: "",
      age: "",
      phone: "",
      parentPhone: "",
      village: "",
      tehsil: "",
      district: "",
      state: "",
      occupation: "",
      occupationAddress: "",
      occupationPhone: "",
      referenceName: "",
      referencePhone: "",
      idProofType: "",
      idProofNumber: "",
      roomType: "",
      monthlyFee: "",
      paidAmount: "",
    });
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
        fatherName: formData.fatherName,
        age: Number(formData.age),

        phone: formData.phone,
        parentPhone: formData.parentPhone,

        village: formData.village,
        tehsil: formData.tehsil,
        district: formData.district,
        state: formData.state,

        occupation: formData.occupation,
        occupationAddress: formData.occupationAddress,
        occupationPhone: formData.occupationPhone,

        referenceName: formData.referenceName,
        referencePhone: formData.referencePhone,

        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber,

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
      fatherName: "",
      age: "",
      phone: "",
      parentPhone: "",

      village: "",
      tehsil: "",
      district: "",
      state: "",

      occupation: "",
      occupationAddress: "",
      occupationPhone: "",

      referenceName: "",
      referencePhone: "",

      idProofType: "",
      idProofNumber: "",

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
        onClose={() => {
          resetForm();
          setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingId ? "Edit Student" : "Add Student"}</DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            pt: 5,
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Student Name"
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="Father Name"
            size="small"
            value={formData.fatherName}
            onChange={(e) =>
              setFormData({ ...formData, fatherName: e.target.value })
            }
          />

          <TextField
            label="Age"
            type="number"
            size="small"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />

          <TextField
            label="Student Phone"
            size="small"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <TextField
            label="Parent Phone"
            size="small"
            value={formData.parentPhone}
            onChange={(e) =>
              setFormData({ ...formData, parentPhone: e.target.value })
            }
          />

          <TextField
            label="Village"
            size="small"
            value={formData.village}
            onChange={(e) =>
              setFormData({ ...formData, village: e.target.value })
            }
          />

          <TextField
            label="Tehsil"
            size="small"
            value={formData.tehsil}
            onChange={(e) =>
              setFormData({ ...formData, tehsil: e.target.value })
            }
          />

          <TextField
            label="District"
            size="small"
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
          />

          <TextField
            label="State"
            size="small"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
          />

          <TextField
            label="Occupation"
            size="small"
            value={formData.occupation}
            onChange={(e) =>
              setFormData({ ...formData, occupation: e.target.value })
            }
          />

          <TextField
            label="Occupation Address"
            size="small"
            value={formData.occupationAddress}
            onChange={(e) =>
              setFormData({ ...formData, occupationAddress: e.target.value })
            }
          />

          <TextField
            label="Occupation Phone"
            size="small"
            value={formData.occupationPhone}
            onChange={(e) =>
              setFormData({ ...formData, occupationPhone: e.target.value })
            }
          />

          <TextField
            label="Reference Name"
            size="small"
            value={formData.referenceName}
            onChange={(e) =>
              setFormData({ ...formData, referenceName: e.target.value })
            }
          />

          <TextField
            label="Reference Phone"
            size="small"
            value={formData.referencePhone}
            onChange={(e) =>
              setFormData({ ...formData, referencePhone: e.target.value })
            }
          />

          <TextField
            select
            label="ID Proof"
            size="small"
            value={formData.idProofType}
            onChange={(e) =>
              setFormData({ ...formData, idProofType: e.target.value })
            }
          >
            <MenuItem value="Aadhar">Aadhar Card</MenuItem>
            <MenuItem value="Driving">Driving License</MenuItem>
            <MenuItem value="Voter">Voter ID</MenuItem>
          </TextField>

          <TextField
            label="ID Proof Number"
            size="small"
            value={formData.idProofNumber}
            onChange={(e) =>
              setFormData({ ...formData, idProofNumber: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
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
            {/* Edit */}
            <MenuItem
              onClick={() => {
                setEditingId(selectedStudent.id);
                setFormData({
                  name: selectedStudent.name,
                  fatherName: selectedStudent.fatherName || "",
                  age: selectedStudent.age?.toString() || "",
                  phone: selectedStudent.phone,
                  parentPhone: selectedStudent.parentPhone || "",

                  village: selectedStudent.village || "",
                  tehsil: selectedStudent.tehsil || "",
                  district: selectedStudent.district || "",
                  state: selectedStudent.state || "",

                  occupation: selectedStudent.occupation || "",
                  occupationAddress: selectedStudent.occupationAddress || "",
                  occupationPhone: selectedStudent.occupationPhone || "",

                  referenceName: selectedStudent.referenceName || "",
                  referencePhone: selectedStudent.referencePhone || "",

                  idProofType: selectedStudent.idProofType || "",
                  idProofNumber: selectedStudent.idProofNumber || "",

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
                setDeleteStudentId(selectedStudent!.id);
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
              if (deleteStudentId) {
                handleDelete(deleteStudentId);
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
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                {drawerStudent?.name?.charAt(0)}
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {drawerStudent?.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {drawerStudent?.phone}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Personal Info */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Personal Details
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Father</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.fatherName || "-"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Age</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.age || "-"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Parent Phone</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.parentPhone || "-"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Occupation</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.occupation || "-"}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Address */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Address
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Village</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.village || "-"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">District</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.district || "-"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">State</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.state || "-"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Reference</Typography>
                <Typography fontWeight={600}>
                  {drawerStudent?.referenceName || "-"}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Room Details
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Stack>
                  <Typography variant="caption">Room Type</Typography>
                  <Chip
                    label={drawerStudent?.roomType}
                    color={
                      drawerStudent?.roomType === "Single"
                        ? "primary"
                        : "secondary"
                    }
                    size="small"
                    sx={{
                      maxWidth: "max-content",
                    }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption">Monthly Fee</Typography>
                <Typography fontWeight={700}>
                  ₹{drawerStudent?.monthlyFee}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Payment */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Payment
            </Typography>

            <Box mb={3}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="body2">Status</Typography>

                <Chip
                  size="small"
                  label={
                    drawerStudent?.monthlyFee -
                      getCurrentMonthPaid(drawerStudent) ===
                    0
                      ? "Paid"
                      : "Due"
                  }
                  color={
                    drawerStudent?.monthlyFee -
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
                    background: "#6366f1",
                  }}
                />
              </Box>

              <Typography variant="caption">
                ₹{getCurrentMonthPaid(drawerStudent)} / ₹
                {drawerStudent?.monthlyFee}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<WhatsAppIcon />}
                fullWidth
                variant="contained"
                sx={{
                  background: "#25D366",
                  "&:hover": { background: "#1ebe5d" },
                }}
                onClick={() =>
                  sendWhatsAppBill({
                    name: drawerStudent.name,
                    phone: drawerStudent.phone,
                    monthlyFee: drawerStudent.monthlyFee,
                    paidAmount: getCurrentMonthPaid(drawerStudent),
                  })
                }
              >
                Send Reminder
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenDrawer(false)}
              >
                Close
              </Button>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
