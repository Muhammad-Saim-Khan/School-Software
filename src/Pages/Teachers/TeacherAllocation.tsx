import { useEffect, useState } from "react";
import Sidebar from "../../Layout/Sidebar";
import { getData, setData } from "../../Config/FirebaseMethods";
import MyLoader from "../../Components/MyLoader";
import MySelect from "../../Components/MySelect";
import { Col, Row } from "react-bootstrap";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import MyButton from "../../Components/MyButton";
import { TextField } from "@mui/material";

function StudentPromotion() {
  const [allTeachersData, setAllTeachersData] = useState<any>(false);
  const [teachersName, setTeachersName] = useState<any>([]);
  const [specificTeacher, setSpecificTeacher] = useState<any>([]);
  const [selectedName, setSelectedName] = useState<any>([]);
  const [classesName, setClassesName] = useState<any>([]);
  const [allClassesData, setAllClassesData] = useState<any>(false);
  const [newClass, setNewClass] = useState("");
  const [loader, setLoader] = useState<any>(false);
  const [actionLoader, setActionLoader] = useState(false);

  const fetchData = () => {
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
  }, []);

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
    if (allClassesData) {
      if (classesName.length !== allClassesData.length) {
        setClassesName([...allClassesData.map((item: any) => item.ClassName)]);
      }
    }
  }, [allClassesData]);

  useEffect(() => {
    fetchData();
    fetchClassesData();
  }, []);

  useEffect(() => {
    console.log(allClassesData);
  }, [allClassesData]);

  const handleSave = (e: any) => {
    e.preventDefault();
    setActionLoader(true);
    const finalObj = { ...specificTeacher[0], TeacherClass: newClass };
    console.log(finalObj);
    setData("Teachers", finalObj)
      .then(() => {
        handleReset();
        fetchData();
        setActionLoader(false);
        toastGreen("Record successfully updated!");
      })
      .catch((err) => {
        console.log(err);
        setActionLoader(false);
        toastRed("Failed to update data. Please try again.");
      });
  };

  const handleReset = () => {
    setSpecificTeacher([""]);
    setSelectedName([]);
    setNewClass("");
  };

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-white p-3 rounded">
          <h2 className="fs-4 mb-4">Teacher Assignment</h2>
          <h3 className="fs-5 mb-3">Select Teacher</h3>
          <form onSubmit={handleSave}>
            {actionLoader ? <MyLoader /> : null}
            {loader ? (
              <MyLoader />
            ) : (
              allTeachersData && (
                <>
                  <MySelect
                    label="Teachers First Name"
                    required={true}
                    defaultValue="Teachers First Name"
                    value={selectedName}
                    onChange={(e: any) => setSelectedName(e.target.value)}
                    options={teachersName}
                  />
                  <Row className="mt-3">
                    <Col md={12} lg={4}>
                      <TextField
                        placeholder="Teacher Roll"
                        disabled
                        fullWidth
                        value={
                          specificTeacher[0] && specificTeacher[0].TeacherId
                        }
                        type="text"
                      />
                    </Col>
                    <Col md={12} lg={4}>
                      <TextField
                        placeholder="Teacher Gender"
                        disabled
                        fullWidth
                        value={
                          specificTeacher[0] && specificTeacher[0].TeacherGender
                        }
                        type="text"
                      />
                    </Col>
                    <Col md={12} lg={4}>
                      <TextField
                        placeholder="Teachers Father Name"
                        disabled
                        fullWidth
                        value={
                          specificTeacher[0] &&
                          specificTeacher[0].TeacherFatherName
                        }
                        type="text"
                      />
                    </Col>
                  </Row>
                  <br />
                  <hr />
                  <Row className="mt-6">
                    {specificTeacher ? (
                      specificTeacher[0] && specificTeacher[0].TeacherClass ? (
                        <Col md={12} lg={6}>
                          <h3 className="fs-5 mb-3">Previous Class</h3>
                          <TextField
                            placeholder="Teacher Class"
                            disabled
                            fullWidth
                            value={
                              specificTeacher[0] &&
                              specificTeacher[0].TeacherClass
                            }
                            type="text"
                          />
                        </Col>
                      ) : null
                    ) : null}
                    <Col
                      md={12}
                      lg:any={
                        !specificTeacher
                          ? null
                          : specificTeacher[0] &&
                            specificTeacher[0].TeacherClass
                          ? 6
                          : 12
                      }
                    >
                      <br />
                      <h3 className="fs-5 mb-3">New Class</h3>
                      <MySelect
                        label="Select Class*"
                        required={true}
                        defaultValue="Please Select Class"
                        value={newClass}
                        onChange={(e: any) => setNewClass(e.target.value)}
                        options={classesName}
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
                </>
              )
            )}
          </form>
        </div>
      </>
    );
  };
  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Teachers"
        pageName="Teacher Allocation"
        breadcrumbNestedLink="Teacher Allocation"
      />
    </>
  );
}

export default StudentPromotion;
