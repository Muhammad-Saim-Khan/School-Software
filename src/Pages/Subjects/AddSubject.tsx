import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import MyLoader from "../../Components/MyLoader";
import { getData, setData } from "../../Config/FirebaseMethods";
import Sidebar from "../../Layout/Sidebar";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import MySelect from "../../Components/MySelect";
import MyTextarea from "../../Components/MyTextarea";
import MyButton from "../../Components/MyButton";
import { TextField } from "@mui/material";

function AddSubject() {
  const [loader, setLoader] = useState<boolean>(false);
  const [allTeachersData, setAllTeachersData] = useState<any>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [teachersName, setTeachersName] = useState<any>([]);
  const [specificTeacher, setSpecificTeacher] = useState<any>([]);
  const [selectedName, setSelectedName] = useState<any>([]);
  const [subjectsData, setSubjectsData] = useState<any>({
    SubjectName: "",
    SubjectTeacher: "",
    SubjectCode: "",
    SubjectShortDesc: "",
  });

  const fetchData = () => {
    setLoader(true);
    getData("Subjects")
      .then((res: any) => {
        setSubjectsData((a: any) => ({
          ...a,
          SubjectCode: res.length > 0 ? res.slice(-1)[0].SubjectCode + 1 : 1,
        }));
        setLoader(false);
      })
      .catch((err) => {
        setSubjectsData((a: any) => ({ ...a, SubjectCode: 1 }));
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

  useEffect(() => {
    fetchData();
    fetchTeachersData();
  }, []);

  const handleReset = () => {
    setSubjectsData({
      SubjectName: "",
      SubjectTeacher: "",
      SubjectCode: "",
      SubjectShortDesc: "",
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
    setData("Subjects", subjectsData)
      .then(() => {
        handleReset();
        setPageLoader(false);
        toastGreen("Subject has been successfully added!");
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
        toastRed("Failed to add Subject. Please try again.");
      });

    const finalObj = {
      ...specificTeacher[0],
      TeacherSubject: subjectsData.SubjectName,
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

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-white p-3 rou1nded">
          <h2 className="fs-4 mb-3">Add New Subjects</h2>
          {pageLoader ? <MyLoader /> : null}
          <form onSubmit={handleSave}>
            <Row className="row-gap-2 mt-3">
              <Col lg={12} xl={4} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Subjects Name"
                    name="Subjects Name"
                    fullWidth
                    required={true}
                    onChange={(e: any) =>
                      setSubjectsData({
                        ...subjectsData,
                        SubjectName: e.target.value,
                      })
                    }
                    value={subjectsData.SubjectName}
                    type="text"
                  />
                </div>
              </Col>
              <Col lg={12} xl={4} className="mb-3">
                <div style={{ height: "58px" }}>
                  <MySelect
                    label="Subjects Assigned Teacher"
                    required={true}
                    defaultValue="Subjects Assigned Teacher"
                    value={selectedName}
                    onChange={(e: any) => {
                      setSelectedName(e.target.value);
                      setSubjectsData({
                        ...subjectsData,
                        SubjectTeacher: e.target.value,
                      });
                    }}
                    options={teachersName}
                  />
                </div>
              </Col>
              <Col lg={12} xl={4} className="mb-3">
                <div style={{ height: "58px" }}>
                  <TextField
                    label="Code (Auto Generated)"
                    disabled
                    required={true}
                    value={loader ? "Loading..." : subjectsData.SubjectCode}
                    type="text"
                    fullWidth
                  />
                </div>
              </Col>
              <Col className="mb-3">
                <MyTextarea
                  required={false}
                  value={subjectsData.SubjectShortDesc}
                  onChange={(e: any) =>
                    setSubjectsData({
                      ...subjectsData,
                      SubjectShortDesc: e.target.value,
                    })
                  }
                  label="Subjects Short Description"
                />
              </Col>
            </Row>
            <h2 className="fs-5 mt-3">Confirm Teacher</h2>
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
                  disabled
                  fullWidth
                  value={specificTeacher[0] && specificTeacher[0].TeacherGender}
                  type="text"
                />
              </Col>
              <Col lg={12} xl={4}>
                <TextField
                  placeholder="Teachers Father Name"
                  fullWidth
                  disabled
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
        breadcrumbLink="Subjects"
        pageName="Add Subjects"
        breadcrumbNestedLink="Add Subjects"
      />
    </>
  );
}

export default AddSubject;
