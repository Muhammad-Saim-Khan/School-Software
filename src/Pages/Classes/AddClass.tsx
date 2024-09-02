import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import MyLoader from "../../Components/MyLoader";
import { getData, setData } from "../../Config/FirebaseMethods";
import Sidebar from "../../Layout/Sidebar";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import MySelect from "../../Components/MySelect";
import MyButton from "../../Components/MyButton";
import { TextField } from "@mui/material";

function AddClass() {
  const [loader, setLoader] = useState<boolean>(false);
  const [allTeachersData, setAllTeachersData] = useState<any>(false);
  const [setAllSubjectsData] = useState<any>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [teachersName, setTeachersName] = useState<any>([]);
  const [specificTeacher, setSpecificTeacher] = useState<any>([]);
  const [selectedName, setSelectedName] = useState<any>([]);
  //   const [setSelectedSubjects] = useState([]);
  const [classesData, setClassesData] = useState<any>({
    ClassName: "",
    ClassTeacher: "",
    ClassId: "",
    ClassStudents: 0,
    ClassSubjects: [],
  });

  const fetchData = () => {
    setLoader(true);
    getData("Classes")
      .then((res: any) => {
        setClassesData((a: any) => ({
          ...a,
          ClassId: res.length > 0 ? res.slice(-1)[0].ClassId + 1 : 1,
        }));
        setLoader(false);
      })
      .catch((err) => {
        setClassesData((a: any) => ({ ...a, ClassId: 1 }));
        console.log(err);
        setLoader(false);
      });
  };

  const fetchTeachersData = () => {
    setLoader(true);
    getData("Teachers")
      .then((res) => {
        setAllTeachersData(res);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const fetchSubjectsData = () => {
    setLoader(true);
    getData("Subjects")
      .then((res) => {
        setAllSubjectsData(res);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
    fetchTeachersData();
    fetchSubjectsData();
  }, []);

  const handleReset = () => {
    setClassesData({
      ClassName: "",
      ClassTeacher: "",
      ClassId: "",
      ClassStudents: 0,
      ClassSubjects: [],
    });
    setSpecificTeacher([""]);
    setSelectedName([]);
    fetchData();
  };

  useEffect(() => {
    if (allTeachersData) {
      setSpecificTeacher(
        allTeachersData.filter(
          (item: any) => selectedName == item.TeacherFirstName
        )
      );
    }
  }, [selectedName]);

  useEffect(() => {
    if (allTeachersData) {
      if (teachersName.length !== allTeachersData.length) {
        setTeachersName([
          ...allTeachersData.map((item: any) => item.TeacherFirstName),
        ]);
      }
    }
  }, [allTeachersData]);

  const handleSave = (e: any) => {
    e.preventDefault();
    setPageLoader(true);
    setData("Classes", classesData)
      .then(() => {
        handleReset();
        setPageLoader(false);
        toastGreen("Class has been successfully added!");
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
        toastRed("Failed to add Class. Please try again.");
      });

    const finalObj = {
      ...specificTeacher[0],
      TeacherClass: classesData.ClassName,
    };
    setData("Teachers", finalObj)
      .then(() => {
        handleReset();
        fetchData();
        setPageLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
      });
  };

  //   const handleCheckboxChange = (subject: any) => {
  //     setSelectedSubjects((prevSelectedSubjects: any) => {
  //       let updatedSubjects;
  //       if (prevSelectedSubjects.includes(subject)) {
  //         updatedSubjects = prevSelectedSubjects.filter(
  //           (item: any) => item !== subject
  //         ); // Removes subject if already selected
  //       } else {
  //         updatedSubjects = [...prevSelectedSubjects, subject]; // Adds subject if not selected
  //       }
  //       setClassesData({ ...classesData, ClassSubjects: updatedSubjects }); // Updates classesData with the updated selectedSubjects
  //       return updatedSubjects;
  //     });
  //   };

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-white p-3 rou1nded">
          <h2 className="fs-4 mb-3">Add New Classes </h2>
          {pageLoader ? <MyLoader /> : null}
          <form onSubmit={handleSave}>
            <Row className="row-gap-2 mt-3">
              <Col lg={12} xl={4} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Class Name"
                    fullWidth
                    name="Class Name"
                    required={true}
                    onChange={(e: any) =>
                      setClassesData({
                        ...classesData,
                        ClassName: e.target.value,
                      })
                    }
                    value={classesData.ClassName}
                    type="text"
                  />
                </div>
              </Col>
              <Col lg={12} xl={4} className="mb-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Class Teacher*"
                    required={true}
                    defaultValue="Class Teacher"
                    value={selectedName}
                    onChange={(e: any) => {
                      setSelectedName(e.target.value);
                      setClassesData({
                        ...classesData,
                        ClassTeacher: e.target.value,
                      });
                    }}
                    options={teachersName}
                  />
                </div>
              </Col>
              <Col lg={12} xl={4} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Class Code (Auto Generated)"
                    disabled
                    fullWidth
                    required={true}
                    value={loader ? "Loading..." : classesData.ClassId}
                    type="text"
                  />
                </div>
              </Col>
              {/* <Col md={12} lg={6}>
                <h2 className="fs-4">Select the Subjects</h2>
                {loader
                  ? "Loading..."
                  : allSubjectsData.length > 0 &&
                    allSubjectsData.map((item: any, index: any) => (
                      <div key={index}>
                        <label className="fs-5 me-2" htmlFor={index}>
                          {item.SubjectName}
                        </label>
                        <input
                          type="checkbox"
                          value={item.SubjectName}
                          onChange={() =>
                            handleCheckboxChange(item.SubjectName)
                          }
                          id={index}
                        />
                      </div>
                    ))}
              </Col> */}
              {/* <Col md={12} lg={6}>
                <div>
                  <h2 className="fs-4">Selected Subjects:</h2>
                  <ol className="fs-5 m-0">
                    {selectedSubjects.length > 0 ? (
                      selectedSubjects.map((subject, index) => (
                        <li key={index}>{subject}</li>
                      ))
                    ) : (
                      <p>No Subjects Selected</p>
                    )}
                  </ol>
                </div>
              </Col> */}
            </Row>
            <h2 className="fs-5 mt-4">Confirm Teacher</h2>
            <Row className="mt-3">
              <Col lg={12} xl={4}>
                <TextField
                  placeholder="Teacher Roll"
                  disabled
                  fullWidth
                  value={specificTeacher[0] && specificTeacher[0].TeacherId}
                  type="text"
                />
              </Col>
              <Col lg={12} xl={4}>
                <TextField
                  placeholder="Teacher Gender"
                  fullWidth
                  disabled
                  value={specificTeacher[0] && specificTeacher[0].TeacherGender}
                  type="text"
                />
              </Col>
              <Col lg={12} xl={4}>
                <TextField
                  placeholder="Teachers Father Name"
                  disabled
                  fullWidth
                  value={
                    specificTeacher[0] && specificTeacher[0].TeacherFatherName
                  }
                  type="text"
                />
              </Col>
            </Row>
            <div className="d-flex gap-4 mt-4">
              <MyButton
                type="submit"
                textColor="black"
                bgColor="var(--orange)"
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
          </form>
        </div>
      </>
    );
  };
  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Classes"
        pageName="Add Class"
        breadcrumbNestedLink="Add Class"
      />
    </>
  );
}

export default AddClass;
