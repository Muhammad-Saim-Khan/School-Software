import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteData, getData, setData } from "../../Config/FirebaseMethods";
import Sidebar from "../../Layout/Sidebar";
import MyLoader from "../../Components/MyLoader";
import { TextField, Tooltip } from "@mui/material";
import MyButton from "../../Components/MyButton";
import FemaleTeacher from "../../Images/Female Teacher.png";
import MaleTeacher from "../../Images/Male Teacher.png";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import { Col, Row } from "react-bootstrap";
import MyModal from "../../Components/MyModal";
import MySelect from "../../Components/MySelect";
import MyTextarea from "../../Components/MyTextarea";
import ConfirmModal from "../../Components/ConfirmModal";

function TeacherDetailedPage() {
  const params = useParams();
  const [loader, setLoader] = useState<boolean>(false);
  const [actionLoader, setActionLoader] = useState(false);
  const [teacherData, setTeacherData] = useState<any>(false);
  const [editedTeacherObj, setEditedTeacherObj] = useState<any>({});
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);
  const [delIsOpen, setDelIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const fetchData = () => {
    setLoader(true);
    getData("Teachers", params.id)
      .then((res: any) => {
        console.log(res);
        setTeacherData(res);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = () => {
    setActionLoader(true);
    deleteData("Teachers", teacherData.id)
      .then(() => {
        handleCloseModal();
        setTeacherData({});
        fetchData();
        setActionLoader(false);
        toastGreen("Record successfully deleted!");
        navigate("/teachers/allTeachers");
      })
      .catch((err) => {
        console.log(err);
        toastRed("Failed to delete the data. Please try again.");
      });
  };
  const handleEdit = (e: any) => {
    e.preventDefault();
    setActionLoader(true);
    const finalObj = { ...teacherData, ...editedTeacherObj };
    console.log({ ...teacherData, ...editedTeacherObj });
    setData("Teachers", finalObj)
      .then(() => {
        setTeacherData({});
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

  const getValue = (field: string) => {
    return editedTeacherObj[field] !== undefined
      ? editedTeacherObj[field]
      : teacherData[field];
  };

  const TeacherDetails = [
    {
      label: "First Name",
      objName: "TeacherFirstName",
    },
    {
      label: "Last Name",
      objName: "TeacherLastName",
    },
    {
      label: "Gender",
      objName: "TeacherGender",
    },
    {
      label: "Father Name",
      objName: "TeacherFatherName",
    },
    {
      label: "Date Of Birth",
      objName: "TeacherDOB",
    },
    {
      label: "Religion",
      objName: "TeacherReligion",
    },
    {
      label: "Teacher Email",
      objName: "TeacherEmail",
    },
    {
      label: "Joining Date",
      objName: "TeacherJoiningDate",
    },
    {
      label: "Subject",
      objName: "TeacherSubject",
    },
    {
      label: "ID",
      objName: "TeacherId",
    },
    {
      label: "Address",
      objName: "TeacherAddress",
    },
    {
      label: "Teacher Phone",
      objName: "TeacherPhone",
    },
    {
      label: "Class Teacher",
      objName: "TeacherClass",
    },
  ];

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-[#0051ff] p-3 rounded">
          {" "}
          {actionLoader ? <MyLoader /> : null}
          {loader ? (
            <MyLoader />
          ) : (
            teacherData && (
              <div className="d-flex justify-content-between">
                <div className="TeacherInfo d-flex gap-5">
                  <div
                    className="TeacherImage centerImg bg-orange rounded"
                    style={{ height: "350px", width: "300px" }}
                  >
                    <img
                      src={
                        teacherData.TeacherGender == "Male"
                          ? MaleTeacher
                          : FemaleTeacher
                      }
                    />
                  </div>
                  <div className="TeacherDetails  text-white">
                    <h2 className="fs-3 ">{`${teacherData.TeacherFirstName}  ${teacherData.TeacherLastName}`}</h2>
                    <p className="w-75 ">
                      {teacherData.TeacherShortBio
                        ? teacherData.TeacherShortBio
                        : "No Bio"}
                    </p>
                    <table>
                      <tbody>
                        {TeacherDetails.map((item, index) => {
                          const value = teacherData[item.objName];
                          const displayValue =
                            item.objName === "TeacherJoiningDate"
                              ? new Date(JSON.parse(value))
                                  .toISOString()
                                  .slice(0, 10)
                              : value;
                          return (
                            <tr key={index}>
                              <td className="py-2"> {item.label}:</td>
                              <td className="fw-bold py-2 text-white">
                                {displayValue}{" "}
                                {(item.label === "Joining Date" ||
                                  item.label === "Date Of Birth") && (
                                  <span className="text-white fw-light">
                                    (yyyy-mm-dd)
                                  </span>
                                )}{" "}
                                {item.objName == "TeacherClass" ? (
                                  teacherData[item.objName] ? null : (
                                    <span className="text-white fw-light">
                                      Not Assigned Yet.{" "}
                                      <Link to="/teachers/teacherAllocation">
                                        Assign Here
                                      </Link>
                                    </span>
                                  )
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="Actions d-flex">
                  <div>
                    <Tooltip title="Edit" placement="top">
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
                            setEditIsOpen(true);
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                  <div>
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
                            setDelIsOpen(true);
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )
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
        pageName="Teachers Detailed Page"
        breadcrumbNestedLink="Teachers Detailed Page"
      />

      <MyModal
        title="Edit Students Details"
        height="55vh"
        onClose={handleCloseModal}
        isOpen={editIsOpen}
        body={
          <>
            <form onSubmit={handleEdit}>
              <div className="mb-0">
                <h3 className="fs-5 mb-0">Personal Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="mt-3">
                <Col md={12} lg={6}>
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="Teachers First Name"
                      name="Teachers First Name"
                      fullWidth
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherFirstName: e.target.value,
                        })
                      }
                      value={getValue("TeacherFirstName")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="Teachers Last Name"
                      name="Teachers Last Name"
                      fullWidth
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherLastName: e.target.value,
                        })
                      }
                      value={getValue("TeacherLastName")}
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
                    <TextField
                      label="Date Of Birth"
                      name="Date Of Birth"
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherDOB: e.target.value,
                        })
                      }
                      value={getValue("TeacherDOB")}
                      fullWidth
                      type="date"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="Teachers Fathers Full Name"
                      name="Teachers Fathers Full Name"
                      fullWidth
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherFatherName: e.target.value,
                        })
                      }
                      value={getValue("TeacherFatherName")}
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
                    <TextField
                      label="Teachers Address"
                      name="Teachers Address"
                      fullWidth
                      required={true}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherAddress: e.target.value,
                        })
                      }
                      value={getValue("TeacherAddress")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="Enter Teachers CNIC"
                      name="Enter Teachers CNIC"
                      fullWidth
                      required={true}
                      value={getValue("TeacherCNIC")}
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
                    <TextField
                      label="Teachers Email"
                      name="Teachers Email"
                      fullWidth
                      required={true}
                      value={getValue("TeacherEmail")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherEmail: e.target.value,
                        })
                      }
                      type="email"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="Teachers Phone"
                      name="Teachers Phone"
                      fullWidth
                      required={true}
                      value={getValue("TeacherPhone")}
                      onChange={(e: any) =>
                        setEditedTeacherObj({
                          ...editedTeacherObj,
                          TeacherPhone: e.target.value,
                        })
                      }
                      type="text"
                    />
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h3 className="fs-5 mb-0">Academic Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="row-gap-2 mt-3">
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="ID (Auto Generated)"
                      disabled
                      fullWidth
                      required={true}
                      value={loader ? "Loading..." : teacherData.TeacherId}
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
                      options={[
                        "Mathematics",
                        "Science",
                        "Social studies",
                        "Art",
                        "Physical",
                        "Computer Science",
                        "English",
                        "Urdu",
                      ]}
                    />
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h3 className="fs-5 mb-0">Additional Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="row-gap-2 mt-3">
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
                          StudentImage: e.target.value,
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
                    teacherData.TeacherImage && (
                      <div>
                        <p>Current file: {teacherData.TeacherImage}</p>
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
        title={`Are you sure you want to delete ${teacherData.TeacherFirstName} ${teacherData.TeacherLastName}`}
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

export default TeacherDetailedPage;
