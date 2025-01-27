/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExcelJS from "exceljs";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import FuseAnimate from "@fuse/core/FuseAnimate";
import {
  Alert,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import FuseLoading from "@fuse/core/FuseLoading";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Analisa from "../analisa/Analisa";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: "no", label: "NO", minWidth: 60, align: "left" },
  {
    id: "namaNasabah",
    label: "Nama Nasabah",
    minWidth: 170,
    align: "left",
  },
  {
    id: "rekening",
    label: "Rekening",
    minWidth: 170,
    align: "left",
  },
  {
    id: "jenisKelamin",
    label: "Jenis Kelamin",
    minWidth: 170,
    align: "left",
  },
  {
    id: "alamat",
    label: "Alamat",
    minWidth: 170,
    align: "left",
  },
  {
    id: "kecamatan",
    label: "Kecamatan",
    minWidth: 170,
    align: "left",
  },
  {
    id: "kabupaten",
    label: "Kabupaten",
    minWidth: 170,
    align: "left",
  },
  {
    id: "provinsi",
    label: "Provinsi",
    minWidth: 170,
    align: "left",
  },
  {
    id: "saldoTabungan",
    label: "Saldo Tabungan",
    minWidth: 170,
    align: "left",
  },
  {
    id: "persentase",
    label: "Persentase",
    minWidth: 170,
    align: "left",
  },
  {
    id: "statusAnalisa",
    label: "Status Permohonan",
    minWidth: 170,
    align: "left",
  },
  {
    id: "aksi",
    label: "Aksi",
    minWidth: 170,
    align: "center",
    // format: (value) => value.toFixed(2),
  },
];

function createData(
  no,
  id,
  namaNasabah,
  rekening,
  jenisKelamin,
  alamat,
  kecamatan,
  kabupaten,
  provinsi,
  statusPermohonan,
  hasilPermohonan,
  persentase,
  saldoTabungan
) {
  return {
    no,
    id,
    namaNasabah,
    rekening,
    jenisKelamin,
    alamat,
    kecamatan,
    kabupaten,
    provinsi,
    statusPermohonan,
    hasilPermohonan,
    persentase,
    saldoTabungan,
  };
}

const formatRekening = (value) => {
  const cleaned = value?.replace(/\D/g, ""); // Hapus non-digit
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})?$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join(".");
  }
  return value;
};
export default function PermohonanTable(props) {
  const { dataNasabah } = props;
  const userRoles = JSON.parse(localStorage.getItem("userRoles"));
  let getAllUserResponse;
  let getResponseName;
  let dataLogin;
  if (userRoles) {
    getAllUserResponse = userRoles?.response?.userRoles;
    getResponseName = userRoles?.response;
    dataLogin = JSON.parse(getAllUserResponse);
  }
  const dataMasterSuplayer = props?.dataMasterSuplayer;
  const dispatch = useDispatch();
  const { dataMasterBarang } = props;
  // console.log(dataAnalisa, 'dataAnalisa');
  const [data, setData] = useState([]);
  const [getDataEdit, setgetDataEdit] = useState({});
  const [getDataNasabahById, setgetDataNasabahById] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsValue, setSelectedItemsValue] = useState([]);
  const [openNotifikasi, setOpenNotifikasi] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataEdit, setDataEdit] = useState({
    id: null,
    namaNasabah: null,
    rekening: null,
    jenisKelamin: null,
    alamat: null,
    kecamatan: null,
    kabupaten: null,
    provinsi: null,
    saldoTabungan: null,
  });

  const rows = props?.data;

  const handleClickOpenNotifikasi = () => {
    setOpenNotifikasi(true);
  };
  const handleCloseNotifikasi = () => {
    setOpenNotifikasi(false);
  };

  // if (dataLogin?.roleUser === 'Staff') {
  //   rows = props?.data.filter((word) => word.kabupaten === getResponseName?.name);
  // }
  const propsFromParent = (analisa) => {
    // console.log(analisa, "analisaa");
  };
  // console.log(rows, "rows");

  rows?.map((item, index) =>
    createData(
      index + 1,
      item?.id,
      item?.namaNasabah,
      item?.rekening,
      item?.jenisKelamin,
      item?.alamat,
      item?.kecamatan,
      item?.kabupaten,
      item?.provinsi,
      item?.statusPermohonan,
      item?.hasilPermohonan,
      item?.persentase,
      item?.saldoTabungan
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClickOpen = (id, row) => {
    setOpen(true);
    // setDataEdit(row);
    setDataEdit({
      id: row?.id,
      namaNasabah: row?.namaNasabah,
      rekening: row?.rekening,
      jenisKelamin: row?.jenisKelamin,
      alamat: row?.alamat,
      kecamatan: row?.kecamatan,
      kabupaten: row?.kabupaten,
      provinsi: row?.provinsi,
      statusPermohonan: row?.statusPermohonan,
      hasilPermohonan: row?.hasilPermohonan,
      persentase: row?.persentase,
      saldoTabungan: row?.saldoTabungan,
    });
    // setgetDataEdit(row);
    // console.log(row, 'rrrr');
  };
  const handleClose = () => {
    setOpen(false);
    setDataEdit({
      id: null,
      namaNasabah: null,
      rekening: null,
      jenisKelamin: null,
      alamat: null,
      kecamatan: null,
      kabupaten: null,
      provinsi: null,
      statusPermohonan: null,
      hasilPermohonan: null,
      persentase: null,
      saldoTabungan: null,
    });
  };
  const [openAnalisa, setopenAnalisa] = useState(false);

  const handleClickopenAnalisa = (row) => {
    if (row?.statusPermohonan === false) {
      setopenAnalisa(true);
      setDataEdit({
        id: row?.id,
        namaNasabah: row?.namaNasabah,
        rekening: row?.rekening,
        jenisKelamin: row?.jenisKelamin,
        alamat: row?.alamat,
        kecamatan: row?.kecamatan,
        kabupaten: row?.kabupaten,
        provinsi: row?.provinsi,
        statusPermohonan: row?.statusPermohonan,
        hasilPermohonan: row?.hasilPermohonan,
        persentase: row?.persentase,
        saldoTabungan: row?.saldoTabungan,
      });
    } else {
      dispatch(
        showMessage({
          message: `Nasabah ${row?.namaNasabah} Sudah Di Analisa`,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "warning",
        })
      );
    }
  };

  const handleCloseAnalisa = () => {
    setopenAnalisa(false);
    setSelectedItemsValue([]);
    setSelectedItems([]);
  };

  const initialValue = 0;
  const sumSelected = selectedItemsValue.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );

  // console.log(sumSelected, 'sum');
  function hitungPersentase(nilai, totalNilai) {
    const persen = (nilai / totalNilai) * 100;
    return Math.round(persen);
  }

  const persentase = hitungPersentase(sumSelected, 370);
  // console.log(`Persentase: ${persentase}%`);

  useEffect(() => {
    const result = dataNasabah.filter(
      (item) => item.mstRekening === dataEdit?.namaNasabah?.mstRekening
    );
    setgetDataNasabahById(result);
  }, [dataEdit, dataNasabah]);

  const body = {
    namaNasabah: JSON.stringify(dataEdit?.namaNasabah),
    rekening: dataEdit?.namaNasabah?.mstRekening,
    jenisKelamin: dataEdit?.jenisKelamin,
    alamat: dataEdit?.alamat,
    kecamatan: dataEdit?.kecamatan,
    kabupaten: dataEdit?.kabupaten,
    provinsi: dataEdit?.provinsi,
    saldoTabungan: dataEdit?.saldoTabungan,
  };
  console.log(body, 'body');
  // console.log(dataNasabah, 'dataNasabah');
  // console.log(getDataNasabahById, 'getDataNasabahById');
  // console.log(rows, 'rows');
  // console.log(dataEdit, 'dataEdit')

  const HandelEdit = (id) => {
    setLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_API_URL_API_}/Permohonan/${dataEdit?.id}`,
        body
      )
      .then((res) => {
        props?.getData();
        handleClose();
        setLoading(false);
        dispatch(
          showMessage({
            message: "Data Berhasil Di Edit",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "success",
          })
        );
      })
      .catch((err) => {
        handleClose();
        setLoading(false);
        const errStatus = err.response.status;
        const errMessage = err.response.data.message;
        let messages = "";
        if (errStatus === 401) {
          messages = "Unauthorized!!";
          window.location.href = "/login";
        } else if (errStatus === 500) {
          messages = "Server Error!!";
        } else if (errStatus === 404) {
          messages = "Not Found Error!!!";
        } else if (errStatus === 408) {
          messages = "TimeOut Error!!";
        } else if (errStatus === 400) {
          messages = errMessage;
        } else {
          messages = "Something Wrong!!";
        }
        dispatch(
          showMessage({
            message: messages,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "error",
          })
        );
        console.log(err);
      });
  };
  const handleSaveAnalisa = (row, id) => {
    setLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_API_URL_API_}/approvalPermohonan/${dataEdit?.id}`,
        {
          statusPermohonan: true,
          persentase,
          hasilPermohonan: !(persentase < 70),
        }
      )
      .then((res) => {
        props?.getData();
        handleCloseAnalisa();
        handleCloseNotifikasi();
        setLoading(false);
        dispatch(
          showMessage({
            message: `Nasabah ${row?.namaNasabah} Berhasil Di approv`,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "success",
          })
        );
      })
      .catch((err) => {
        handleCloseAnalisa();
        handleCloseNotifikasi();
        setLoading(false);
        const errStatus = err.response.status;
        const errMessage = err.response.data.message;
        let messages = "";
        if (errStatus === 401) {
          messages = "Unauthorized!!";
          window.location.href = "/login";
        } else if (errStatus === 500) {
          messages = "Server Error!!";
        } else if (errStatus === 404) {
          messages = "Not Found Error!!!";
        } else if (errStatus === 408) {
          messages = "TimeOut Error!!";
        } else if (errStatus === 400) {
          messages = errMessage;
        } else {
          messages = "Something Wrong!!";
        }
        dispatch(
          showMessage({
            message: messages,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "error",
          })
        );
        console.log(err);
      });
  };

  const HandelDelete = (id) => {
    setLoading(true);
    axios
      .delete(`${process.env.REACT_APP_API_URL_API_}/Permohonan/${id}`)
      .then((res) => {
        props?.getData();
        setLoading(false);
        dispatch(
          showMessage({
            message: "Data Berhasil Di Hapus",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "success",
          })
        );
      })
      .catch((err) => {
        setData([]);
        setLoading(false);
        const errStatus = err.response.status;
        const errMessage = err.response.data.message;
        let messages = "";
        if (errStatus === 401) {
          messages = "Unauthorized!!";
          window.location.href = "/login";
        } else if (errStatus === 500) {
          messages = "Server Error!!";
        } else if (errStatus === 404) {
          messages = "Not Found Error!!!";
        } else if (errStatus === 408) {
          messages = "TimeOut Error!!";
        } else if (errStatus === 400) {
          messages = errMessage;
        } else {
          messages = "Something Wrong!!";
        }
        dispatch(
          showMessage({
            message: messages,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "error",
          })
        );
        console.log(err);
      });
  };
  if (props?.loading) {
    return <FuseLoading />;
  }
  if (rows?.length === 0) {
    return (
      <div className="m-10 h-full w-full flex justify-center items-center">
        <div>
          <Alert severity="info">Data Kosong</Alert>
        </div>
      </div>
    );
  }

  const downloadPDF = () => {
    const doc = new jsPDF("landscape");
    const filteredColumns = columns.filter((column) => column.id !== "aksi");
    const tableColumn = filteredColumns.map((column) => column.label); // Mendapatkan header kolom
    const tableRows = rows.map((row, index) => [
      index + 1,
      row?.namaNasabah,
      formatRekening(row?.rekening),
      row?.jenisKelamin,
      row?.alamat,
      row?.kecamatan,
      row?.kabupaten,
      row?.provinsi,
      row?.saldoTabungan,
      row?.persentase,
      row?.statusPermohonan === false
        ? "Analisa"
        : row?.persentase < 70
        ? "Tidak Layak"
        : "Layak",
    ]);

    doc.autoTable(tableColumn, tableRows);
    doc.save("data.pdf");
  };

  // Fungsi untuk ekspor ke Excel
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Menambahkan header
    const filteredColumns = columns.filter((column) => column.id !== "aksi");
    worksheet.columns = filteredColumns.map((column) => ({
      header: column.label,
      key: column.id,
      width: column?.id === "no" ? 5 : 20,
    }));

    // Menambahkan data ke worksheet
    rows.map((row, index) => {
      worksheet.addRow({
        no: index + 1,
        namaNasabah: row?.namaNasabah,
        rekening: formatRekening(row?.rekening),
        jenisKelamin: row?.jenisKelamin,
        alamat: row?.alamat,
        kecamatan: row?.kecamatan,
        kabupaten: row?.kabupaten,
        provinsi: row?.provinsi,
        saldoTabungan: row?.saldoTabungan,
        persentase: row?.persentase,
        statusAnalisa:
          row?.statusPermohonan === false
            ? "Analisa"
            : row?.persentase < 70
            ? "Tidak Layak"
            : "Layak",
      });
    });
    // Menyimpan file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.xlsx";
    link.click();
  };
  // console.log(dataEdit, 'dataEdit')

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div className="flex flex-auto items-center gap-4 grid-rows-1 ">
        <div className="flex items-left mt-10 ml-20 w-1/2 flex-col md:flex-row md:items-center md:mt-0">
          <div className="w-full flex">
            <div>
              <FuseAnimate animation="transition.slideLeftIn" delay={100}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={downloadPDF}
                >
                  <PictureAsPdfIcon className="mr-2" />
                  <div className="hidden md:contents">Export To PDF</div>
                </Button>
              </FuseAnimate>
            </div>
            <div className="ml-10">
              <FuseAnimate animation="transition.slideLeftIn" delay={100}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={exportExcel}
                >
                  <PrintIcon className="mr-2" />
                  <div className="hidden md:contents">Export To Excel</div>
                </Button>
              </FuseAnimate>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openNotifikasi}
        onClose={handleCloseNotifikasi}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Analisa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah anda yakin dengan analisa ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotifikasi}>Tutup</Button>
          <Button onClick={handleSaveAnalisa} autoFocus>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={openAnalisa}
        onClose={handleCloseAnalisa}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseAnalisa}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Analisis 5C: {persentase}%
            </Typography>
            <Button
              disabled={selectedItemsValue.length === 0}
              autoFocus
              color="inherit"
              onClick={handleClickOpenNotifikasi}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Analisa
          propsFromParent={propsFromParent}
          selectedItems={selectedItems}
          selectedItemsValue={selectedItemsValue}
          setSelectedItems={setSelectedItems}
          setSelectedItemsValue={setSelectedItemsValue}
        />
      </Dialog>
      <Dialog
        className="py-20"
        open={open}
        id="edit"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="flex flex-wrap gap-5 p-10">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={dataNasabah}
                value={dataEdit?.namaNasabah}
                getOptionLabel={(option) => option.mstRekening}
                sx={{ width: 300 }}
                onChange={(e, newValue) => {
                  setDataEdit({ ...dataEdit, namaNasabah: newValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Data Nasabah" />
                )}
              />
              <TextField
                value={getDataNasabahById[0]?.nama}
                InputProps={{
                  readOnly: true,
                }}
                onChange={(e) => {
                  setDataEdit({
                    ...dataEdit,
                    namaNasabah: getDataNasabahById?.nama,
                  });
                }}
                id="outlined-basic"
                focused
                label="Nama Nasabah"
                variant="outlined"
              />
              <TextField
                // value={dataEdit?.jenisKelamin}
                InputProps={{
                  readOnly: true,
                }}
                focused
                value={getDataNasabahById[0]?.mstjenisKelamin?.kelamin}
                onChange={(e) => {
                  setDataEdit({ ...dataEdit, jenisKelamin: e.target.value });
                }}
                id="outlined-basic"
                label="Jenis Kelamin"
                variant="outlined"
              />
              <TextField
                // value={dataEdit?.alamat}
                InputProps={{
                  readOnly: true,
                }}
                focused
                value={getDataNasabahById[0]?.mstAlamat}
                onChange={(e) => {
                  setDataEdit({ ...dataEdit, alamat: e.target.value });
                }}
                id="outlined-basic"
                label="Alamat"
                variant="outlined"
              />
              <TextField
                // value={dataEdit?.kecamatan}
                InputProps={{
                  readOnly: true,
                }}
                focused
                value={getDataNasabahById[0]?.mstKecamatan}
                onChange={(e) => {
                  setDataEdit({ ...dataEdit, kecamatan: e.target.value });
                }}
                id="outlined-basic"
                label="Kecamatan"
                variant="outlined"
              />
              <TextField
                // value={dataEdit?.kabupaten}
                InputProps={{
                  readOnly: true,
                }}
                focused
                value={getDataNasabahById[0]?.mstKabupaten}
                onChange={(e) => {
                  setDataEdit({ ...dataEdit, kabupaten: e.target.value });
                }}
                id="outlined-basic"
                label="Kabupaten"
                variant="outlined"
              />
              <TextField
                // value={dataEdit?.provinsi}
                InputProps={{
                  readOnly: true,
                }}
                focused
                value={getDataNasabahById[0]?.mstProvinsi}
                onChange={(e) => {
                  setDataEdit({ ...dataEdit, provinsi: e.target.value });
                }}
                id="outlined-basic"
                label="Provinsi"
                variant="outlined"
              />
              <TextField
                value={dataEdit?.saldoTabungan}
                onChange={(e) => {
                  setDataEdit({ ...dataEdit, saldoTabungan: e.target.value });
                  // settriggeralamat({ ...stateBody, alamat: stateBody?.rekening})
                }}
                id="outlined-basic"
                label="Saldo "
                variant="outlined"
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" onClick={HandelEdit} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                function formatRupiah(amount) {
                  return (
                    "Rp. " +
                    amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })
                  );
                }
                // console.log(row, 'ooo')
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>
                      {row?.namaNasabah?.nama === null ? "-" : row?.namaNasabah?.nama}
                    </TableCell>
                    <TableCell>
                      {row?.rekening === null ? "-" : row?.rekening}
                    </TableCell>
                    <TableCell>
                      {row?.jenisKelamin === null ? "-" : row?.jenisKelamin}
                    </TableCell>
                    <TableCell>
                      {row?.alamat === null ? "-" : row?.alamat}
                    </TableCell>
                    <TableCell>
                      {row?.kecamatan === null ? "-" : row?.kecamatan}
                    </TableCell>
                    <TableCell>
                      {row?.kabupaten === null ? "-" : row?.kabupaten}
                    </TableCell>
                    <TableCell>
                      {row?.provinsi === null ? "-" : row?.provinsi}
                    </TableCell>
                    <TableCell>
                      {row?.saldoTabungan === null
                        ? "-"
                        : formatRupiah(row?.saldoTabungan)}
                    </TableCell>
                    <TableCell>{`${
                      row?.persentase === null ? "-" : row?.persentase
                    }%`}</TableCell>
                    <TableCell>
                      {row?.statusPermohonan === false ? (
                        <Button
                          onClick={() => handleClickopenAnalisa(row, row?.id)}
                          color="info"
                          variant="contained"
                        >
                          Analisis 5C
                        </Button>
                      ) : row?.persentase < 70 ? (
                        <Button
                          onClick={() => handleClickopenAnalisa(row, row?.id)}
                          color="warning"
                          variant="contained"
                        >
                          {"Ditolak"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleClickopenAnalisa(row, row?.id)}
                          color="success"
                          variant="contained"
                        >
                          {"Pengajuan"}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div>
                          <IconButton
                            onClick={() => handleClickOpen(row.id, row)}
                            color="info"
                            disabled={
                              dataLogin?.roleUser === "Staff" &&
                              row?.accBasil !== null
                            }
                            className=""
                          >
                            <EditIcon />
                          </IconButton>
                        </div>
                        <div>
                          <IconButton
                            onClick={(e) => HandelDelete(row.id)}
                            color="error"
                            disabled={
                              dataLogin?.roleUser === "Staff" &&
                              row?.accBasil !== null
                            }
                            className=""
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
