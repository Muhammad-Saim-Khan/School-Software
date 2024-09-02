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
  const [allStudentsData, setAllStudentData] = useState<any>(false);
  const [studentsName, setStudentsName] = useState<any>([]);
  const [classesName, setClassesName] = useState<any>([]);
  const [allClassesData, setAllClassesData] = useState<any>(false);
  const [specificStudent, setSpecificStudent] = useState<any>([]);
  const [selectedName, setSelectedName] = useState<any>([]);
  const [newClass, setNewClass] = useState("");
  const [loader, setLoader] = useState<any>(false);
  const [actionLoader, setActionLoader] = useState(false);

  const fetchData = () => {
    setLoader(true);
    getData("Students")
      .then((res) => {
        setAllStudentData(res);
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
    if (allStudentsData) {
      setSpecificStudent(
        allStudentsData.filter(
          (item: any) => selectedName == item.StudentFirstName
        )
      );
    }
  }, [selectedName]);

  useEffect(() => {
    if (allStudentsData) {
      if (studentsName.length !== allStudentsData.length) {
        setStudentsName([
          ...allStudentsData.map((item: any) => item.StudentFirstName),
        ]);
      }
    }
  }, [allStudentsData]);
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

  const handleEdit = (e: any) => {
    e.preventDefault();
    setActionLoader(true);
    const finalObj = { ...specificStudent[0], StudentClass: newClass };
    console.log(finalObj);
    setData("Students", finalObj)
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
    setSpecificStudent([""]);
    setSelectedName([]);
    setNewClass("");
  };

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-white p-3 rounded">
          <h2 className="fs-4 mb-4">Promote Students</h2>
          <h3 className="fs-5 mb-3">Select Student</h3>
          <form onSubmit={handleEdit}>
            {actionLoader ? <MyLoader /> : null}
            {loader ? (
              <MyLoader />
            ) : (
              allStudentsData && (
                <>
                  <MySelect
                    label="Students First Name"
                    required={true}
                    defaultValue="Students First Name"
                    value={selectedName}
                    onChange={(e: any) => setSelectedName(e.target.value)}
                    options={studentsName}
                  />
                  <Row className="mt-6">
                    <Col md={12} lg={4}>
                      <TextField
                        placeholder="Student Roll"
                        fullWidth
                        disabled
                        value={
                          specificStudent[0] && specificStudent[0].StudentRoll
                        }
                        type="text"
                      />
                    </Col>
                    <Col md={12} lg={4}>
                      <TextField
                        placeholder="Gender"
                        disabled
                        fullWidth
                        value={
                          specificStudent[0] && specificStudent[0].StudentGender
                        }
                        type="text"
                      />
                    </Col>
                    <Col md={12} lg={4}>
                      <TextField
                        placeholder="Students Father Name"
                        disabled
                        fullWidth
                        value={
                          specificStudent[0] &&
                          specificStudent[0].StudentFatherName
                        }
                        type="text"
                      />
                    </Col>
                  </Row>
                  <br />
                  <hr />
                  <Row className="mt-6">
                    <Col md={12} lg={6} c>
                      <h3 className="fs-5 mb-3">Promotion From Class</h3>
                      <TextField
                        placeholder="Student Class"
                        disabled
                        fullWidth
                        value={
                          specificStudent[0] && specificStudent[0].StudentClass
                        }
                        type="text"
                      />
                    </Col>
                    <Col md={12} lg={6}>
                      <h3 className="fs-5 mb-3">Promotion To Class</h3>
                      <MySelect
                        placeholder="Select Class*"
                        required={true}
                        defaultValue="Please Select Class"
                        value={newClass}
                        onChange={(e: any) => setNewClass(e.target.value)}
                        options={classesName}
                      />
                    </Col>
                  </Row>
                  <div className="d-flex gap-4 mt-3">
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
        breadcrumbLink="Students"
        pageName="Student Promotion"
        breadcrumbNestedLink="Student Promotion"
      />
    </>
  );
}

export default StudentPromotion;
