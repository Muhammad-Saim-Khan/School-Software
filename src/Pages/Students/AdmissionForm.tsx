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

function AdmissionForm() {
  const [loader, setLoader] = useState<boolean>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [allClassesData, setAllClassesData] = useState<any>(false);
  const [classesName, setClassesName] = useState<any>([]);
  const [StudentData, setStudentData] = useState<any>({
    StudentFirstName: "",
    StudentLastName: "",
    StudentGender: "",
    StudentDOB: "",
    StudentFatherName: "",
    StudentAddress: "",
    StudentFatherCNIC: "",
    StudentRoll: "",
    StudentBloodGroup: "",
    StudentReligion: "",
    StudentFatherOccupation: "",
    StudentGuardianEmail: "",
    StudentClass: "",
    StudentFees: "",
    StudentGuardianPhone: "",
    StudentShortBio: "",
    StudentImage: "",
  });

  const handleReset = () => {
    setStudentData({
      StudentFirstName: "",
      StudentLastName: "",
      StudentGender: "",
      StudentDOB: "",
      StudentFatherName: "",
      StudentAddress: "",
      StudentFatherCNIC: "",
      StudentRoll: "",
      StudentBloodGroup: "",
      StudentReligion: "",
      StudentFatherOccupation: "",
      StudentGuardianEmail: "",
      StudentClass: "",
      StudentFees: "",
      StudentGuardianPhone: "",
      StudentShortBio: "",
      StudentImage: "",
    });
  };

  const fetchData = () => {
    setLoader(true);
    getData("Students")
      .then((res: any) => {
        setStudentData((a: any) => ({
          ...a,
          StudentRoll: res.length > 0 ? res.slice(-1)[0].StudentRoll + 1 : 1,
        }));
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  const fetchClassesData = () => {
    setLoader(true);
    getData("Classes")
      .then((res: any) => {
        setAllClassesData(res);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
    fetchClassesData();
  }, []);

  useEffect(() => {
    if (allClassesData) {
      if (classesName.length !== allClassesData.length) {
        setClassesName([...allClassesData.map((item: any) => item.ClassName)]);
      }
    }
  }, [allClassesData]);

  const handleSave = (e: any) => {
    e.preventDefault();
    setPageLoader(true);
    const finalObj = {
      ...StudentData,
      StudentAdmissionDate: JSON.stringify(new Date()),
    };
    setData("Students", finalObj)
      .then(() => {
        handleReset();
        fetchData();
        setPageLoader(false);
        toastGreen("Student has been successfully added!");
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
        toastRed("Failed to add student. Please try again.");
      });
  };

  const content = () => {
    return (
      <>
        {pageLoader ? <MyLoader /> : null}
        <div className="container-fluid bg-[#ffffff] p-3 rounded">
          <h2 className="fs-4 mb-3 text-black">Add New Students</h2>
          <form onSubmit={handleSave}>
            <div className="mt-4 mb-0">
              <h3 className="fs-5 mb-0 text-black">Personal Information</h3>{" "}
              <hr className="mt-2" />
            </div>
            <Row className="row-gap-2">
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    fullWidth
                    label="Student First Name"
                    name="Student First Name"
                    required={true}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentFirstName: e.target.value,
                      })
                    }
                    value={StudentData.StudentFirstName}
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Student Last Name"
                    name="Student Last Name"
                    fullWidth
                    required={true}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentLastName: e.target.value,
                      })
                    }
                    value={StudentData.StudentLastName}
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Gender*"
                    required={true}
                    defaultValue="Please Select Gender"
                    value={StudentData.StudentGender}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentGender: e.target.value,
                      })
                    }
                    options={["Male", "Female"]}
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Date Of Birth"
                    name="Date Of Birth"
                    fullWidth
                    required={true}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentDOB: e.target.value,
                      })
                    }
                    value={StudentData.StudentDOB}
                    type="date"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Students Address"
                    name="Students Address"
                    required={true}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentAddress: e.target.value,
                      })
                    }
                    value={StudentData.StudentAddress}
                    fullWidth
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Blood Group*"
                    required={true}
                    defaultValue="Please Select Blood Group"
                    value={StudentData.StudentBloodGroup}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentBloodGroup: e.target.value,
                      })
                    }
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Religion*"
                    required={true}
                    defaultValue="Please Select Religion"
                    value={StudentData.StudentReligion}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentReligion: e.target.value,
                      })
                    }
                    options={["Islam", "Hindu", "Christian", "Others"]}
                  />
                </div>
              </Col>
            </Row>

            <div className="mt-7">
              <h3 className="fs-5 mb-0">Parental/Guardian Information</h3>{" "}
              <hr className="mt-2" />
            </div>
            <Row className="row-gap-2">
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Students Fathers Full Name"
                    name="Students Fathers Full Name"
                    fullWidth
                    required={true}
                    value={StudentData.StudentFatherName}
                    type="text"
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentFatherName: e.target.value,
                      })
                    }
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Students Fathers CNIC"
                    name="Students Fathers CNIC"
                    required={true}
                    fullWidth
                    value={StudentData.StudentFatherCNIC}
                    type="text"
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentFatherCNIC: e.target.value,
                      })
                    }
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Students Fathers Occupation"
                    name="Students Fathers Occupation"
                    fullWidth
                    required={true}
                    value={StudentData.StudentFatherOccupation}
                    type="text"
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentFatherOccupation: e.target.value,
                      })
                    }
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Guardian Email"
                    name="Guardian Email"
                    required={true}
                    value={StudentData.StudentGuardianEmail}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentGuardianEmail: e.target.value,
                      })
                    }
                    fullWidth
                    type="email"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Guardian Phone"
                    name="Guardian Phone"
                    required={true}
                    fullWidth
                    value={StudentData.StudentGuardianPhone}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentGuardianPhone: e.target.value,
                      })
                    }
                    type="text"
                  />
                </div>
              </Col>
            </Row>
            <div className="mt-7">
              <h3 className="fs-5 mb-0">Academic Information</h3>{" "}
              <hr className="mt-2" />
            </div>
            <Row className="row-gap-2">
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Roll (Auto Generated)"
                    name="Roll (Auto Generated)"
                    disabled
                    fullWidth
                    required={true}
                    value={
                      loader
                        ? "Loading..."
                        : StudentData.StudentRoll
                        ? StudentData.StudentRoll
                        : 1
                    }
                    type="text"
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Select Class*"
                    required={true}
                    defaultValue="Please Select Class"
                    value={StudentData.StudentClass}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentClass: e.target.value,
                      })
                    }
                    options={classesName}
                  />
                </div>
              </Col>
              <Col md={12} lg={6} xl={3} className="mt-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Fee's"
                    name="Fee's"
                    fullWidth
                    required={true}
                    value={StudentData.StudentFees}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentFees: e.target.value,
                      })
                    }
                    placeholder="Enter Student Fees"
                    type="number"
                  />
                </div>
              </Col>
            </Row>
            <div className="mt-7">
              <h3 className="fs-5 mb-0">Additional Information</h3>{" "}
              <hr className="mt-2" />
            </div>
            <Row className="row-gap-2">
              <Col lg={12} xl={6} className="mt-3">
                <div>
                  <MyTextarea
                    required={false}
                    value={StudentData.StudentShortBio}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentShortBio: e.target.value,
                      })
                    }
                    label="Students Short Bio"
                  />
                </div>
              </Col>
              <Col lg={12} xl={6} className="mt-3">
                <div>
                  <label htmlFor="imageInput">
                    Upload Student Photo (150px X 150px)*
                  </label>{" "}
                  <br />
                  <input
                    type="file"
                    required={true}
                    value={StudentData.StudentImage}
                    onChange={(e: any) =>
                      setStudentData({
                        ...StudentData,
                        StudentImage: e.target.value,
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
                  bgColor="var(--orange)"
                  textColor="black"
                  hoverBgColor="var(--darkBlue)"
                  className="px-4 py-3"
                  btnValue={
                    <div className="d-flex align-items-center gap-2">
                      Save{" "}
                      <lord-icon
                        src="https://cdn.lordicon.com/dangivhk.json"
                        trigger="hover"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </div>
                  }
                />
                <MyButton
                  btnValue={
                    <div className="d-flex align-items-center gap-2">
                      Reset{" "}
                      <lord-icon
                        src="https://cdn.lordicon.com/abaxrbtq.json"
                        trigger="hover"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </div>
                  }
                  bgColor="var(--darkBlue)"
                  hoverBgColor="var(--orange)"
                  className="px-4 py-3"
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
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Students"
        pageName="Student Admission Form"
        breadcrumbNestedLink="Admission Form"
      />
    </>
  );
}

export default AdmissionForm;
