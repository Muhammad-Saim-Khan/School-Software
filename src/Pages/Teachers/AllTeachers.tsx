import { useEffect, useState } from "react";
import { deleteData, getData, setData } from "../../Config/FirebaseMethods";
import Sidebar from "../../Layout/Sidebar";
import MyLoader from "../../Components/MyLoader";
import Grid from "../../Components/MyGrid";
import { Input, Tooltip } from "@mui/material";
import MyButton from "../../Components/MyButton";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import ConfirmModal from "../../Components/ConfirmModal";
import MyTextarea from "../../Components/MyTextarea";
import { Col, Row } from "react-bootstrap";
import FloatingInput from "../../Components/FloatingInput";
import MyModal from "../../Components/MyModal";
import MySelect from "../../Components/MySelect";
import { useNavigate } from "react-router-dom";

function AllTeachers() {
  const [loader, setLoader] = useState(true);
  const [actionLoader, setActionLoader] = useState(false);
  const [allTeachersData, setAllTeachersData] = useState<any>(false);
  const [allSubjectsData, setAllSubjectsData] = useState<any>(false);
  const [filteredTeachersData, setFilteredTeachersData] = useState<any>(false);
  const [teacherObj, setTeacherObj] = useState<any>({});
  const [editedTeacherObj, setEditedTeacherObj] = useState<any>({});
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);
  const [delIsOpen, setDelIsOpen] = useState<boolean>(false);
  const [idSearch, setIdSearch] = useState<any>("");
  const [nameSearch, setNameSearch] = useState<any>("");
  const [subjectSearch, setSubjectSearch] = useState<any>("");
  const navigate = useNavigate();

  const fetchData = () => {
    setLoader(true);
    getData("Teachers")
      .then((res: any) => {
        setAllTeachersData(res);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  const fetchSubjectsData = () => {
    setLoader(true);
    getData("Subjects")
      .then((res: any) => {
        setAllSubjectsData([res.map((item: any) => item.SubjectName)]);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
    fetchSubjectsData();
  }, []);

  const handleDelete = () => {
    setActionLoader(true);
    deleteData("Teachers", teacherObj.id)
      .then(() => {
        setTeacherObj({});
        fetchData();
        setActionLoader(false);
        toastGreen("Record successfully deleted!");
      })
      .catch((err) => {
        console.log(err);
        setActionLoader(false);
        toastRed("Failed to delete the data. Please try again.");
      });
  };

  const handleEdit = (e: any) => {
    e.preventDefault();
    setActionLoader(true);
    const finalObj = { ...teacherObj, ...editedTeacherObj };
    setData("Teachers", finalObj)
      .then(() => {
        setTeacherObj({});
        setEditedTeacherObj({});
        fetchData();
        setActionLoader(false);
        handleCloseModal();
        toastGreen("Record successfully updated!");
      })
      .catch((err) => {
        console.log(err);
        setActionLoader(false);
        toastRed("Failed to update data. Please try again.");
      });
  };

  const handleCloseModal = () => {
    setEditIsOpen(false);
    setDelIsOpen(false);
    setEditedTeacherObj({});
  };

  // Search Mechanism
  useEffect(() => {
    let filteredData = allTeachersData;

    if (idSearch !== "") {
      filteredData = filteredData.filter(
        (item: any) => item.TeacherId == idSearch
      );
    }

    if (nameSearch !== "") {
      filteredData = filteredData.filter(
        (item: any) =>
          item.TeacherFirstName.toLowerCase().includes(
            nameSearch.toLowerCase()
          ) ||
          item.TeacherLastName.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    if (subjectSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.TeacherSubject.toLowerCase().includes(subjectSearch.toLowerCase())
      );
    }

    setFilteredTeachersData(filteredData);
  }, [idSearch, nameSearch, subjectSearch, allTeachersData]);

  // Action Buttons
  const renderActions = (row: any) => (
    <>
      {/* <Tooltip title="Edit" placement="top">
        <span>
          <MyButton
            bgColor="var(--green)"
            hoverBgColor="#00943e"
            className="p-0 px-1 pt-1 me-2"
            btnValue={
              <lord-icon
                src="https://cdn.lordicon.com/zfzufhzk.json"
                style={{ width: "37px", height: "37px" }}
                trigger="hover"
              />
            }
            onClick={() => {
              setTeacherObj(row);
              setEditIsOpen(true);
            }}
          />
        </span>
      </Tooltip> */}

      <Tooltip title="Delete" placement="top">
        <span>
          <MyButton
            bgColor="var(--red)"
            hoverBgColor="rgb(139, 0, 0)"
            className="p-0 px-1 pt-1 me-2"
            btnValue={
              <lord-icon
                src="https://cdn.lordicon.com/xekbkxul.json"
                style={{ width: "37px", height: "37px" }}
                trigger="hover"
                colors="primary:#121331,secondary:#9ce5f4,tertiary:#646e78,quaternary:#ebe6ef"
              />
            }
            onClick={() => {
              setTeacherObj(row);
              setDelIsOpen(true);
            }}
          />
        </span>
      </Tooltip>
      <Tooltip title="View Details" placement="top">
        <span>
          <MyButton
            bgColor="var(--orange)"
            hoverBgColor="#b87a00"
            className="p-0 px-1 pt-1"
            btnValue={
              <lord-icon
                src="https://cdn.lordicon.com/anqzffqz.json"
                trigger="hover"
                style={{ width: "37px", height: "37px" }}
              />
            }
            onClick={() => {
              navigate(`/dashboard/teachers/${row.id}`);
            }}
          />
        </span>
      </Tooltip>
    </>
  );

  const getValue = (field: string) => {
    return editedTeacherObj[field] !== undefined
      ? editedTeacherObj[field]
      : teacherObj[field];
  };

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-[#0051ff] p-3 rounded">
          <h2 className="fs-4 mb-3 text-white">All Teachers Data</h2>
          <Row>
            <Col sm={12} md={4}>
              <Input
                placeholder="Search by Teachers ID"
                value={idSearch}
                onChange={(e: any) => {
                  setIdSearch(e.target.value);
                }}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                type="text"
              />
            </Col>
            <Col sm={12} md={4}>
              <Input
                placeholder="Search by Teachers Name"
                value={nameSearch}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                onChange={(e: any) => {
                  setNameSearch(e.target.value);
                }}
                type="text"
              />
            </Col>
            <Col sm={12} md={4}>
              <Input
                placeholder="Search by Teachers Subject"
                value={subjectSearch}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                onChange={(e: any) => {
                  setSubjectSearch(e.target.value);
                }}
                type="text"
              />
            </Col>
          </Row>
          {actionLoader ? <MyLoader /> : null}
          {loader ? (
            <MyLoader />
          ) : (
            <Grid
              data={filteredTeachersData ? filteredTeachersData : null}
              columns={[
                { id: "TeacherId", label: "ID" },
                { id: "TeacherFirstName", label: "First Name" },
                { id: "TeacherLastName", label: "Last Name" },
                { id: "TeacherGender", label: "Gender" },
                { id: "TeacherDOB", label: "Date of Birth" },
                // { id: "TeacherEmail", label: "Teacher Email" },
                { id: "TeacherSubject", label: "Subject" },
                { id: "TeacherPhone", label: "Teacher Phone" },
                {
                  id: "actions",
                  label: "Actions",
                  isAction: true,
                  render: renderActions,
                  minWidth: "195px",
                },
              ]}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Teachers"
        pageName="All Teachers"
        breadcrumbNestedLink="All Teachers"
      />

      <MyModal
        title="Edit Teachers Details"
        height="55vh"
        onClose={handleCloseModal}
        isOpen={editIsOpen}
        body={
          <>
            <form onSubmit={(e: any) => handleEdit(e)}>
              <div className="mt-4 mb-0">
                <h3 className="fs-5 mb-0">Personal Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="row-gap-2">
                <Col md={12} lg={6}>
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Teachers First Name"
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherFirstName: e.target.value,
                        })
                      }
                      placeholder="Edit Teachers First Name"
                      myValue={getValue("TeacherFirstName")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Teachers Last Name*"
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherLastName: e.target.value,
                        })
                      }
                      placeholder="Edit Teachers Last Name"
                      myValue={getValue("TeacherLastName")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <MySelect
                      label="Select Gender*"
                      required={true}
                      defaultValue="Please Select Gender"
                      value={getValue("TeacherGender")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherGender: e.target.value,
                        })
                      }
                      options={["Male", "Female"]}
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Date Of Birth*"
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherDOB: e.target.value,
                        })
                      }
                      myValue={getValue("TeacherDOB")}
                      placeholder="Edit Teachers Date of birth"
                      type="date"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Teachers Fathers Name*"
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherFatherName: e.target.value,
                        })
                      }
                      placeholder="Edit Teachers Fathers Name"
                      myValue={getValue("TeacherFatherName")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <MySelect
                      label="Select Religion*"
                      required={true}
                      defaultValue="Please Select Religion"
                      value={getValue("TeacherReligion")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherReligion: e.target.value,
                        })
                      }
                      options={["Islam", "Hindu", "Christian", "Others"]}
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Teachers Address*"
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherAddress: e.target.value,
                        })
                      }
                      placeholder="Edit Teachers Address"
                      myValue={getValue("TeacherAddress")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Enter Teachers CNIC*"
                      placeholder="Enter Teachers CNIC"
                      required={true}
                      myValue={getValue("TeacherCNIC")}
                      type="text"
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherCNIC: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Teachers Email*"
                      required={true}
                      myValue={getValue("TeacherEmail")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherEmail: e.target.value,
                        })
                      }
                      placeholder="Enter Teachers Email Address"
                      type="email"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="Teachers Phone*"
                      required={true}
                      myValue={getValue("TeacherPhone")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherPhone: e.target.value,
                        })
                      }
                      placeholder="Enter Teachers Phone Number"
                      type="text"
                    />
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h3 className="fs-5 mb-0">Academic Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="row-gap-2">
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <FloatingInput
                      label="ID (Auto Generated)"
                      disabled
                      placeholder=""
                      required={true}
                      myValue={loader ? "Loading..." : teacherObj.TeacherId}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <MySelect
                      label="Select Subject*"
                      required={true}
                      defaultValue="Please Select Subject"
                      value={getValue("TeacherSubject")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherSubject: e.target.value,
                        })
                      }
                      options={allSubjectsData}
                    />
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h3 className="fs-5 mb-0">Additional Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="row-gap-2">
                <Col lg={12} xl={6} className="mb-3">
                  <div>
                    <MyTextarea
                      required={false}
                      value={getValue("TeacherShortBio")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherShortBio: e.target.value,
                        })
                      }
                      label="Teachers Short Bio"
                    />
                  </div>
                </Col>
                <Col lg={12} xl={6}>
                  <div>
                    <label htmlFor="imageInput">
                      Upload Student Photo (150px X 150px)
                    </label>{" "}
                    <br />
                    <input
                      type="file"
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherImage: e.target.value,
                        })
                      }
                      id="imageInput"
                      accept="image/*"
                    />
                  </div>
                  {editedTeacherObj.TeacherImage ? (
                    <div>
                      <p>Selected file: {editedTeacherObj.TeacherImage}</p>
                    </div>
                  ) : (
                    teacherObj.TeacherImage && (
                      <div>
                        <p>Current file: {teacherObj.TeacherImage}</p>
                      </div>
                    )
                  )}
                </Col>
              </Row>
              <hr className="mt-4 mb-2" />
              <div className="text-end">
                <MyButton
                  bgColor="var(--darkBlue)"
                  hoverBgColor="var(--orange)"
                  className="me-2"
                  btnValue={
                    <div className="d-flex align-items-center gap-2">
                      Save{" "}
                      <lord-icon
                        src="https://cdn.lordicon.com/dangivhk.json"
                        trigger="hover"
                        style={{ width: "37px", height: "37px" }}
                      />
                    </div>
                  }
                  type="submit"
                />
              </div>
            </form>
          </>
        }
        footer={
          <div>
            <MyButton
              bgColor="var(--darkBlue)"
              hoverBgColor="var(--orange)"
              className="me-2"
              btnValue="Close"
              onClick={handleCloseModal}
            />
          </div>
        }
      />

      <ConfirmModal
        title={`Are you sure you want to delete ${teacherObj.TeacherFirstName} ${teacherObj.TeacherLastName}`}
        icon={
          <lord-icon
            src="https://cdn.lordicon.com/jxzkkoed.json"
            trigger="hover"
            style={{ width: "120px", height: "120px" }}
          />
        }
        onClose={handleCloseModal}
        isOpen={delIsOpen}
        body={
          <>
            <MyButton
              bgColor="var(--red)"
              hoverBgColor="rgb(139, 0, 0)"
              className="me-4"
              btnValue="Yes, Delete"
              onClick={() => {
                handleCloseModal();
                handleDelete();
              }}
            />
            <MyButton
              bgColor="var(--green)"
              hoverBgColor="#00943e"
              btnValue="No, Cancel"
              onClick={handleCloseModal}
            />
          </>
        }
      />
    </>
  );
}

export default AllTeachers;
