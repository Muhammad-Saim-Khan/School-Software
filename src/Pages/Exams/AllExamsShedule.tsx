import MyLoader from "../../Components/MyLoader";
import Sidebar from "../../Layout/Sidebar";
import Grid from "../../Components/MyGrid";
import { useEffect, useState } from "react";
import { deleteData, getData, setData } from "../../Config/FirebaseMethods";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import { Input, TextField, Tooltip } from "@mui/material";
import MyButton from "../../Components/MyButton";
import ConfirmModal from "../../Components/ConfirmModal";
import MySelect from "../../Components/MySelect";
import { Col, Row } from "react-bootstrap";
import MyModal from "../../Components/MyModal";

function AllExamsSchedule() {
  const [loader, setLoader] = useState<any>(false);
  const [actionLoader, setActionLoader] = useState<any>(false);
  const [allExamsData, setAllExamsData] = useState<any>([]);
  const [editIsOpen, setEditIsOpen] = useState<any>(false);
  const [delIsOpen, setDelIsOpen] = useState<any>(false);
  const [examObj, setExamObj] = useState<any>({});
  const [filteredExamsData, setFilteredExamsData] = useState<any>(false);
  const [editedExamObj, setEditedExamObj] = useState<any>({});
  const [classesName, setClassesName] = useState<any>([]);
  const [subjectsName, setSubjectsName] = useState<any>([]);
  const [nameSearch, setNameSearch] = useState<any>("");
  const [classSearch, setClassSearch] = useState<any>("");
  const [statusSearch, setStatusSearch] = useState<any>("");

  const fetchData = () => {
    setLoader(true);
    getData("Exams")
      .then((res: any) => {
        setAllExamsData(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchClassesAndSubjects = () => {
    setLoader(true);
    getData("Classes")
      .then((res: any) => {
        setClassesName(res.map((item: any) => item.ClassName));
      })
      .catch((err) => {
        console.log(err);
      });

    getData("Subjects")
      .then((res: any) => {
        setSubjectsName(res.map((item: any) => item.SubjectName));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
    fetchClassesAndSubjects();
  }, []);

  const handleDelete = () => {
    setActionLoader(true);
    deleteData("Exams", examObj.id)
      .then(() => {
        handleCloseModal();
        setExamObj({});
        fetchData();
        toastGreen("Exam successfully deleted!");
      })
      .catch((err) => {
        console.log(err);
        toastRed("Failed to delete the exam. Please try again.");
      })
      .finally(() => {
        setActionLoader(false);
      });
  };

  const handleEdit = (e: any) => {
    e.preventDefault();
    const finalObj = { ...examObj, ...editedExamObj };
    setActionLoader(true);
    setData("Exams", finalObj)
      .then(() => {
        setExamObj({});
        setEditedExamObj({});
        fetchData();
        handleCloseModal();
        toastGreen("Exam successfully updated!");
      })
      .catch((err) => {
        console.log(err);
        toastRed("Failed to update exam. Please try again.");
      })
      .finally(() => {
        setActionLoader(false);
      });
  };

  const handleCloseModal = () => {
    setEditIsOpen(false);
    setDelIsOpen(false);
    setEditedExamObj({});
  };

  const getValue = (field: any) => {
    return editedExamObj[field] !== undefined
      ? editedExamObj[field]
      : examObj[field];
  };

  useEffect(() => {
    let filteredData = allExamsData;

    if (nameSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.examName.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    if (classSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.examClass.toLowerCase().includes(classSearch.toLowerCase())
      );
    }

    if (statusSearch !== "") {
      filteredData = filteredData.filter((item: any) => {
        if (statusSearch === "All") {
          return item.examStatus;
        }
        return item.examStatus == statusSearch;
      });
    }

    setFilteredExamsData(filteredData);
  }, [statusSearch, nameSearch, classSearch, allExamsData]);

  const renderActions = (row: any) => (
    <>
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
              setExamObj(row);
              setEditIsOpen(true);
            }}
          />
        </span>
      </Tooltip>
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
              setExamObj(row);
              setDelIsOpen(true);
            }}
          />
        </span>
      </Tooltip>
    </>
  );

  const content = () => (
    <>
      <div className="container-fluid bg-[#0051ff] p-3 rounded">
        <h2 className="fs-4 mb-3 text-white">All Exams Schedule</h2>
        <Row>
          <Col sm={12} md={4}>
            <Input
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: 22,
                marginBottom: 3,
              }}
              fullWidth
              placeholder="Search by Students Name"
              value={nameSearch}
              onChange={(e: any) => {
                setNameSearch(e.target.value);
              }}
              type="text"
            />
          </Col>
          <Col sm={12} md={4}>
            <Input
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: 22,
                marginBottom: 3,
              }}
              fullWidth
              placeholder="Search by Students Class"
              value={classSearch}
              onChange={(e: any) => {
                setClassSearch(e.target.value);
              }}
              type="text"
            />
          </Col>
          <Col sm={12} md={4}>
            <MySelect
              label="Search by Exam Status*"
              defaultValuesValue="All"
              defaultValue="All"
              value={statusSearch}
              onChange={(e: any) => {
                setStatusSearch(e.target.value);
              }}
              options={["Scheduled", "Completed", "Canceled"]}
            />
          </Col>
        </Row>
        {loader ? (
          <MyLoader />
        ) : (
          <Grid
            data={filteredExamsData ? filteredExamsData : null}
            columns={[
              { id: "examName", label: "Exam Name" },
              { id: "examClass", label: "Class" },
              { id: "examSubject", label: "Subject" },
              { id: "examDate", label: "Date" },
              { id: "examDuration", label: "Duration" },
              { id: "totalMarks", label: "Total Marks" },
              { id: "passingMarks", label: "Passing Marks" },
              { id: "examStatus", label: "Status" },
              {
                id: "actions",
                label: "Actions",
                isAction: true,
                render: renderActions,
                minWidth: "140px",
              },
            ]}
          />
        )}
      </div>
    </>
  );

  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Exams"
        pageName="All Exams Schedule"
        breadcrumbNestedLink="All Exams"
      />
      <MyModal
        title="Edit Exam Details"
        height="55vh"
        onClose={handleCloseModal}
        isOpen={editIsOpen}
        body={
          <>
            <form onSubmit={handleEdit}>
              <div className="mb-0">
                <h3 className="fs-5 mb-0">Exam Information</h3>{" "}
                <hr className="mt-2" />
              </div>
              <Row className="mt-3 ">
                <Col md={12} lg={6}>
                  <TextField
                    label="Exam Name"
                    name="Exam Name"
                    required={true}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        examName: e.target.value,
                      })
                    }
                    value={getValue("examName")}
                    fullWidth
                    type="text"
                  />
                </Col>
                <Col md={12} lg={6}>
                  <MySelect
                    label="Class"
                    required={true}
                    defaultValue="Please Select Class"
                    value={getValue("examClass")}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        examClass: e.target.value,
                      })
                    }
                    options={classesName}
                  />
                </Col>
              </Row>
              <Row className="mt-3 ">
                <Col md={12} lg={6}>
                  {" "}
                  <MySelect
                    label="Subject"
                    required={true}
                    defaultValue="Please Select Subject"
                    value={getValue("examSubject")}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        examSubject: e.target.value,
                      })
                    }
                    options={subjectsName}
                  />
                </Col>
                <Col md={12} lg={6}>
                  <TextField
                    label="Date"
                    name="Date"
                    required={true}
                    fullWidth
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        examDate: e.target.value,
                      })
                    }
                    value={getValue("examDate")}
                    type="date"
                  />
                </Col>
              </Row>
              <Row className="mt-3 ">
                <Col md={12} lg={6}>
                  <TextField
                    label="Duration (in minutes)"
                    name="Duration (in minutes)"
                    required={true}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        examDuration: e.target.value,
                      })
                    }
                    fullWidth
                    value={getValue("examDuration")}
                    type="number"
                  />
                </Col>
                <Col md={12} lg={6}>
                  <TextField
                    label="Total Marks"
                    name="Total Marks"
                    required={true}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        totalMarks: e.target.value,
                      })
                    }
                    fullWidth
                    value={getValue("totalMarks")}
                    type="number"
                  />
                </Col>
              </Row>
              <Row className="mt-3 ">
                <Col md={12} lg={6}>
                  <TextField
                    label="Passing Marks"
                    name="Passing Marks"
                    required={true}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        passingMarks: e.target.value,
                      })
                    }
                    fullWidth
                    value={getValue("passingMarks")}
                    type="number"
                  />
                </Col>
                <Col md={12} lg={6}>
                  <MySelect
                    label="Status"
                    required={true}
                    defaultValue="Please Select Status"
                    value={getValue("examStatus")}
                    onChange={(e: any) =>
                      setEditedExamObj({
                        ...editedExamObj,
                        examStatus: e.target.value,
                      })
                    }
                    options={["Scheduled", "Completed", "Canceled"]}
                  />
                </Col>
              </Row>
              <div className="text-end mt-2">
                <MyButton
                  bgColor="var(--darkBlue)"
                  hoverBgColor="var(--orange)"
                  className="me-2"
                  btnValue={
                    <div className="d-flex align-items-center gap-2">
                      Update{" "}
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
              {actionLoader && <MyLoader />}
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
        title={`Are you sure you want to delete ${examObj.examName} for class ${examObj.examClass}`}
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

export default AllExamsSchedule;
