import { Row, Col } from "react-bootstrap";
import Sidebar from "../../Layout/Sidebar";
import { getData, setData } from "../../Config/FirebaseMethods";
import { useEffect, useState } from "react";
import MySelect from "../../Components/MySelect";
import MyTextarea from "../../Components/MyTextarea";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import MyButton from "../../Components/MyButton";
import MyLoader from "../../Components/MyLoader";
import { TextField } from "@mui/material";

function AddTeachers() {
  const [loader, setLoader] = useState<boolean>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [setAllSubjects] = useState<any>([]);
  const [teacherData, setTeacherData] = useState<any>({
    TeacherFirstName: "",
    TeacherLastName: "",
    TeacherGender: "",
    TeacherDOB: "",
    TeacherFatherName: "",
    TeacherReligion: "",
    TeacherAddress: "",
    TeacherCNIC: "",
    TeacherEmail: "",
    TeacherPhone: "",
    TeacherId: "",
    TeacherSubject: "",
    TeacherShortBio: "",
    TeacherImage: "",
  });

  const handleReset = () => {
    setTeacherData({
      TeacherFirstName: "",
      TeacherLastName: "",
      TeacherGender: "",
      TeacherDOB: "",
      TeacherFatherName: "",
      TeacherReligion: "",
      TeacherAddress: "",
      TeacherCNIC: "",
      TeacherEmail: "",
      TeacherPhone: "",
      TeacherId: "",
      TeacherSubject: "",
      TeacherShortBio: "",
      TeacherImage: "",
    });
  };

  const fetchData = () => {
    setLoader(true);
    getData("Teachers")
      .then((res: any) => {
        setTeacherData((a: any) => ({
          ...a,
          TeacherId: res.length > 0 ? res.slice(-1)[0].TeacherId + 1 : 1,
        }));
        setLoader(false);
      })
      .catch((err) => {
        setTeacherData((a: any) => ({ ...a, TeacherId: 1 }));
        console.log(err);
        setLoader(false);
      });
  };

  const fetchSubjectsData = () => {
    getData("Subjects")
      .then((res: any) => {
        setAllSubjects([res.map((item: any) => item.SubjectName)]);
        setLoader(false);
      })
      .catch((err) => {
        setTeacherData((a: any) => ({ ...a, TeacherId: 1 }));
        console.log(err);
        setLoader(false);
      });
  };
  useEffect(() => {
    fetchData();
    fetchSubjectsData();
  }, []);

  const handleSave = (e: any) => {
    e.preventDefault();
    setPageLoader(true);
    const finalObj = {
      ...teacherData,
      TeacherJoiningDate: JSON.stringify(new Date()),
    };
    setData("Teachers", finalObj)
      .then(() => {
        handleReset();
        fetchData();
        setPageLoader(false);
        toastGreen("Teacher has been successfully added!");
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
        toastRed("Failed to add teacher. Please try again.");
      });
  };

  const content = () => {
    return (
      <>
        {pageLoader ? <MyLoader /> : null}
        <div className="container-fluid bg-white p-3 rounded">
          <h2 className="fs-4 mb-3">Add New Teachers</h2>
          <form onSubmit={handleSave}>
            <div className="mt-4 mb-0">
              <h3 className="fs-5 mb-0">Personal Information</h3>{" "}
              <hr className="mt-2" />
            </div>
            <Row className="row-gap-2 mt-3">
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Teachers First Name"
                    name="Teachers First Name"
                    required={true}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherFirstName: e.target.value,
                      })
                    }
                    value={teacherData.TeacherFirstName}
                    type="text"
                    fullWidth
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Teachers Last Name"
                    name="Teachers Last Name"
                    required={true}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherLastName: e.target.value,
                      })
                    }
                    fullWidth
                    value={teacherData.TeacherLastName}
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Gender*"
                    required={true}
                    defaultValue="Please Select Gender"
                    value={teacherData.TeacherGender}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherGender: e.target.value,
                      })
                    }
                    options={["Male", "Female"]}
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    fullWidth
                    label="Teachers Date of birth"
                    name="Teachers Date of birth"
                    required={true}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherDOB: e.target.value,
                      })
                    }
                    value={teacherData.TeacherDOB}
                    type="date"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Teachers Fathers Full Name"
                    name="Teachers Fathers Full Name"
                    fullWidth
                    required={true}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherFatherName: e.target.value,
                      })
                    }
                    value={teacherData.TeacherFatherName}
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Religion*"
                    required={true}
                    defaultValue="Please Select Religion"
                    value={teacherData.TeacherReligion}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherReligion: e.target.value,
                      })
                    }
                    options={["Islam", "Hindu", "Christian", "Others"]}
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Teachers Address"
                    name="Teachers Address"
                    fullWidth
                    required={true}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherAddress: e.target.value,
                      })
                    }
                    value={teacherData.TeacherAddress}
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Enter Teachers CNIC"
                    name="Enter Teachers CNIC"
                    required={true}
                    value={teacherData.TeacherCNIC}
                    type="text"
                    fullWidth
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherCNIC: e.target.value,
                      })
                    }
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Teachers Email"
                    name="Teachers Email"
                    required={true}
                    value={teacherData.TeacherEmail}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherEmail: e.target.value,
                      })
                    }
                    fullWidth
                    type="email"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Teachers Phone"
                    name="Teachers Phone"
                    required={true}
                    value={teacherData.TeacherPhone}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherPhone: e.target.value,
                      })
                    }
                    fullWidth
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
            <Row className="row-gap-2 mt-3">
              <Col md={12} lg={6} xl={3} className="mb-3">
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
              <Col md={12} lg={6} xl={3} className="mb-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Subject*"
                    required={true}
                    defaultValue="Please Select Subject"
                    value={teacherData.TeacherSubject}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
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
                    value={teacherData.TeacherShortBio}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherShortBio: e.target.value,
                      })
                    }
                    label="Teachers Short Bio"
                  />
                </div>
              </Col>
              <Col lg={12} xl={6} className="mb-3">
                <div>
                  <label htmlFor="imageInput">
                    Upload Teachers Photo (150px X 150px)*
                  </label>{" "}
                  <br />
                  <input
                    type="file"
                    required={true}
                    value={teacherData.TeacherImage}
                    onChange={(e: any) =>
                      setTeacherData({
                        ...teacherData,
                        TeacherImage: e.target.value,
                      })
                    }
                    id="imageInput"
                    accept="image/*"
                  />
                </div>
              </Col>
              <div className="d-flex gap-4">
                <MyButton
                  type="submit"
                  textColor="black"
                  bgColor="var(--orange)"
                  hoverBgColor="var(--darkBlue)"
                  className="px-5 py-3"
                  btnValue="Save"
                />
                <MyButton
                  btnValue="Reset"
                  bgColor="var(--darkBlue)"
                  hoverBgColor="var(--orange)"
                  className="px-5 py-3"
                  onClick={handleReset}
                />
              </div>
            </Row>
          </form>
        </div>
      </>
    );
  };

  return (
    <Sidebar
      element={content()}
      breadcrumbLink="Teachers"
      pageName="Add Teachers"
      breadcrumbNestedLink="Add Teachers"
    />
  );
}

export default AddTeachers;
