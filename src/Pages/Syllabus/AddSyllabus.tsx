import { useEffect, useState } from "react";
import Sidebar from "../../Layout/Sidebar";
import { Col, Row } from "react-bootstrap";
import MyButton from "../../Components/MyButton";
import MyTextarea from "../../Components/MyTextarea";
import { getData, setData } from "../../Config/FirebaseMethods";
import MySelect from "../../Components/MySelect";
import MyLoader from "../../Components/MyLoader";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import { TextField } from "@mui/material";

function AddSyllabus() {
  const [loader, setLoader] = useState<boolean>(false);
  const [allClassesData, setAllClassesData] = useState<any>(false);
  const [classesName, setClassesName] = useState<any>([]);
  const [allSubjectsData, setAllSubjectsData] = useState<any>(false);
  const [subjectsName, setSubjectsName] = useState<any>([]);
  const [syllabusData, setSyllabusData] = useState<any>({
    SyllabusClass: "",
    SyllabusSubject: "",
    SyllabusTopic: "",
    SyllabusStartDate: "",
    SyllabusEndDate: "",
    SyllabusDescription: "",
  });

  const handleReset = () => {
    setSyllabusData({
      SyllabusClass: "",
      SyllabusSubject: "",
      SyllabusTopic: "",
      SyllabusStartDate: "",
      SyllabusEndDate: "",
      SyllabusDescription: "",
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

  const fetchSubjectsData = () => {
    setLoader(true);
    getData("Subjects")
      .then((res: any) => {
        setAllSubjectsData(res);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchClassesData();
    fetchSubjectsData();
  }, []);

  useEffect(() => {
    if (allClassesData) {
      if (classesName.length !== allClassesData.length) {
        setClassesName([...allClassesData.map((item: any) => item.ClassName)]);
      }
    }

    if (allSubjectsData) {
      if (subjectsName.length !== allSubjectsData.length) {
        setSubjectsName([
          ...allSubjectsData.map((item: any) => item.SubjectName),
        ]);
      }
    }
  }, [allClassesData, allSubjectsData]);

  const handleSave = (e: any) => {
    e.preventDefault();
    setLoader(true);
    const finalObj = {
      ...syllabusData,
      SyllabusAddedDate: JSON.stringify(new Date()),
    };
    setData("Syllabus", finalObj)
      .then(() => {
        handleReset();
        fetchClassesData();
        setLoader(false);
        toastGreen("Syllabus has been successfully added!");
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        toastRed("Failed to add syllabus. Please try again.");
      });
  };

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-white  p-3 rounded">
          <h2 className="fs-4 mb-3">Add New Syllabus</h2>
          {loader ? <MyLoader /> : null}
          <form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={12} lg={6} xl={4} className="mb-3">
                <MySelect
                  label="Select Class*"
                  required={true}
                  defaultValue="Please Select Class"
                  value={syllabusData.SyllabusClass}
                  onChange={(e: any) =>
                    setSyllabusData({
                      ...syllabusData,
                      SyllabusClass: e.target.value,
                    })
                  }
                  options={classesName}
                />
              </Col>
              <Col md={12} lg={6} xl={4} className="mb-3">
                <MySelect
                  label="Select Subject*"
                  required={true}
                  defaultValue="Please Select Subject"
                  value={syllabusData.SyllabusSubject}
                  onChange={(e: any) =>
                    setSyllabusData({
                      ...syllabusData,
                      SyllabusSubject: e.target.value,
                    })
                  }
                  options={subjectsName}
                />
              </Col>
              <Col md={12} lg={6} xl={4} className="mb-3">
                <TextField
                  label="Topic"
                  name="Topic"
                  required={true}
                  onChange={(e: any) =>
                    setSyllabusData({
                      ...syllabusData,
                      SyllabusTopic: e.target.value,
                    })
                  }
                  fullWidth
                  value={syllabusData.SyllabusTopic}
                  type="text"
                />
              </Col>
              <Col md={12} lg={6} xl={4} className="mb-3">
                <TextField
                  label="Start Date"
                  name="Start Date"
                  required={true}
                  fullWidth
                  onChange={(e: any) =>
                    setSyllabusData({
                      ...syllabusData,
                      SyllabusStartDate: e.target.value,
                    })
                  }
                  value={syllabusData.SyllabusStartDate}
                  type="date"
                />
              </Col>
              <Col md={12} lg={6} xl={4} className="mb-3">
                <TextField
                  label="End Date"
                  name="End Date"
                  required={true}
                  onChange={(e: any) =>
                    setSyllabusData({
                      ...syllabusData,
                      SyllabusEndDate: e.target.value,
                    })
                  }
                  value={syllabusData.SyllabusEndDate}
                  type="date"
                  fullWidth
                />
              </Col>
              <Col md={12} className="mb-3">
                <MyTextarea
                  required={true}
                  value={syllabusData.SyllabusDescription}
                  onChange={(e: any) =>
                    setSyllabusData({
                      ...syllabusData,
                      SyllabusDescription: e.target.value,
                    })
                  }
                  label="Description*"
                />
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
        breadcrumbLink="Syllabus"
        pageName="Add Syllabus"
        breadcrumbNestedLink="Add Syllabus"
      />
    </>
  );
}

export default AddSyllabus;
