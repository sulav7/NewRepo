import React from "react";
import DataTable from "react-data-table-component";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { TextField } from "./components";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import axios from "./config";
import { CSVLink, CSVDownload } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const ADD_AGENDA_VALIDATION = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "first name must be atleast 2 character long")
    .required("This field is required"),
  lastName: Yup.string()
    .min(2, "last name must be atleast 2 character long")
    .required("This field is required"),
  userName: Yup.string().required("This field is required"),
  email: Yup.string()
    .email("Enter the valid email")
    .required("This field is required"),
});

function App() {
  const initValues = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
  };

  const [showAccord, setShowAccord] = React.useState(false);
  const [showAccord1, setShowAccord1] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [tableData, setTableData] = React.useState([]);
  const [tableOneData, setTableOneData] = React.useState([]);

  // fetch all data
  const fetchData = async () => {
    const { data } = await axios.get("/users");
    setTableData(data);
  };
  const handleDelete = async (row) => {
    if (window.confirm("Are you sure want to delete?")) {
      const res = await axios.delete(`/users/${row?.id}`);
      if (res.status === 200) {
        toast.success(
          `${row?.firstName + " " + row?.lastName} successfully deleted`
        );
        fetchData();
      } else {
        toast.error(
          `Failed to delete the ${row?.firstName + " " + row?.lastName} user`
        );
      }
    }
  };

  // Fetch one data
  const fetchOneAgenda = async (row) => {
    const { data } = await axios.get(`/users/${row?.id}`);
    setTableOneData(data);
    setIsEdit(true);
    setShowAccord1(true);
  };
  // handle Edit
  const handleEdit = async (val) => {
    const res = await axios.patch(`/users/${tableOneData?.id}`, val);
    if (res.status === 200) {
      toast.success(
        `${
          tableOneData?.firstName + " " + tableOneData?.lastName
        } successfully edit`
      );
      fetchData();
      setShowAccord1(!showAccord1);
    } else {
      toast.error(
        `Failed to edit the ${
          tableOneData?.firstName + " " + tableOneData?.lastName
        } user`
      );
    }
  };
  // Handle delete
  const handleSubmit = async (val, action) => {
    const response = await axios.post("/users", val);
    if (response?.status === 201) {
      toast.success("User successfully added.");
      fetchData();
    } else {
      return toast.error("failed to add user.");
    }
  };
  const columns = [
    {
      name: "S.N.",
      selector: (row, idx) => idx + 1,
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
    },
    {
      name: "User Name",
      selector: (row) => row.userName,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className='app_table-action'>
          <div
            className='app_table-action btn_outline align-items-center'
            onClick={() => handleDelete(row)}
          >
            <AiOutlineDelete size={20} />
          </div>
          <div
            className='app_table-action btn_outline  align-items-center'
            onClick={() => {
              fetchOneAgenda(row);
              setShowAccord(false);
              setShowAccord1(!setShowAccord1);
            }}
          >
            <AiOutlineEdit size={20} />
          </div>
        </div>
      ),
    },
  ];
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='App container'>
      <ToastContainer />
      <h6 className='app_text'>User Dashboard</h6>
      <div className='tabe_add-btncontainer'>
        <button
          className='table_add-btn'
          onClick={() => {
            setShowAccord(!showAccord);
            setShowAccord1(!setShowAccord1);
          }}
        >
          {!showAccord ? "Add Users" : "Close"}
        </button>
      </div>
      <div className='d-flex align-items-center justify-content-end'>
        <button className='table_add-btn '>
          <CSVLink data={tableData}>Export to Excel</CSVLink>
        </button>
      </div>
      {showAccord && (
        <div className=''>
          <h6 className='text-center my-3 fw-bold'>Add Users</h6>
          <Formik
            initialValues={initValues}
            validationSchema={ADD_AGENDA_VALIDATION}
            validateOnMount={true}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className='row'>
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='First Name'
                      type='text'
                      name='firstName'
                    />
                  </div>
                  <div className='' />
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='Last Name'
                      type='text'
                      name='lastName'
                    />
                  </div>
                  <div className='' />
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='User Name'
                      type='text'
                      name='userName'
                    />
                  </div>
                  <div className='' />
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='Email'
                      type='text'
                      name='email'
                    />
                  </div>
                  <div className='' />
                </div>
                <button
                  disabled={!isValid}
                  className={` ${
                    !isValid ? "table_add-btn-disable" : "table_add-btn"
                  } w-50 mb-5`}
                  type='submit'
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
      {/* edit data */}
      {isEdit && showAccord1 ? (
        <div className=''>
          <h6 className='text-center my-3 fw-bold text-capitalize'>
            edit user
          </h6>
          <Formik
            initialValues={{
              firstName: tableOneData?.firstName,
              lastName: tableOneData?.lastName,
              userName: tableOneData?.userName,
              email: tableOneData?.email,
            }}
            validationSchema={ADD_AGENDA_VALIDATION}
            validateOnMount={true}
            onSubmit={handleEdit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className='row'>
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='First Name'
                      type='text'
                      name='firstName'
                    />
                  </div>
                  <div className='' />
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='Last Name'
                      type='text'
                      name='lastName'
                    />
                  </div>
                  <div className='' />
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='User Name'
                      type='text'
                      name='userName'
                    />
                  </div>
                  <div className='' />
                  <div className='col-6'>
                    <TextField
                      placeholder=''
                      label='Email'
                      type='text'
                      name='email'
                    />
                  </div>
                  <div className='' />
                </div>
                <button
                  disabled={!isValid}
                  className={` ${
                    !isValid ? "table_add-btn-disable" : "table_add-btn"
                  } w-50 mb-5`}
                  type='submit'
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      ) : null}
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        title='Users Dashboard'
        paginationServer
      />
    </div>
  );
}

export default App;
