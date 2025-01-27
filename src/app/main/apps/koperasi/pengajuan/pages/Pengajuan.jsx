/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useThemeMediaQuery } from "@fuse/hooks";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";
import PengajuanHeader from "./PengajuanHeader";
import PengajuanTable from "./PengajuanTable";

function Pengajuan() {
  const dispatch = useDispatch();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dataPermohonanApprove, setDatadataPermohonanApprove] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(data, "dataa");
  const filteredUsers = data?.filter(
    (user) =>
     user?.namaNasabah?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const getData = async () => {
    setLoading(true);
    const response = await axios
      .get(`${process.env.REACT_APP_API_URL_API_}/Pengajuan`)
      .then((res) => {
        setData(res?.data);
        setLoading(false);
        // console.log(res.data, 'rrr');
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
  const getDataPermohonanApprove = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL_API_}/permohonanByApprove`)
      .then((res) => {
        setDatadataPermohonanApprove(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setDatadataPermohonanApprove([]);
        setLoading(false);
        const errStatus = err?.response?.status;
        const errMessage = err?.response?.data?.message;
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
  React.useEffect(() => {
    let isUnmout = false;
    if (!isUnmout) {
      getData();
      getDataPermohonanApprove();
    }
    return () => {
      isUnmout = true;
    };
  }, []);

  return (
    <FusePageCarded
      header={
        <PengajuanHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dataPermohonanApprove={dataPermohonanApprove}
          getData={getData}
          data={filteredUsers}
          loading={loading}
        />
      }
      content={
        <PengajuanTable
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dataPermohonanApprove={dataPermohonanApprove}
          getData={getData}
          data={filteredUsers}
          loading={loading}
        />
      }
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Pengajuan;
