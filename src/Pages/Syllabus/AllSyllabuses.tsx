import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Grid from "../../Components/MyGrid";
import Sidebar from "../../Layout/Sidebar";
import { deleteData, getData, setData } from "../../Config/FirebaseMethods";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import { Input, TextField, Tooltip } from "@mui/material";
import MyButton from "../../Components/MyButton";
import MyLoader from "../../Components/MyLoader";
import MyModal from "../../Components/MyModal";
import ConfirmModal from "../../Components/ConfirmModal";
import MySelect from "../../Components/MySelect";
import MyTextarea from "../../Components/MyTextarea";

function AllSyllabus() {
  const [loader, setLoader] = useState(false);
  const [actionLoader, setActionLoader] = useState(false);
  const [allSyllabusData, setAllSyllabusData] = useState<any>([]);
  const [filteredSyllabusData, setFilteredSyllabusData] = useState<any>([]);
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);
  const [delIsOpen, setDelIsOpen] = useState<boolean>(false);
  const [syllabusObj, setSyllabusObj] = useState<any>({});
  const [editedSyllabusObj, setEditedSyllabusObj] = useState<any>({});
  const [allClassesData, setAllClassesData] = useState<any>(false);
  const [classesName, setClassesName] = useState<any>([]);
  const [allSubjectsData, setAllSubjectsData] = useState<any>(false);
  const [subjectsName, setSubjectsName] = useState<any>([]);
  const [classSearch, setClassSearch] = useState<any>("");
  const [subjectSearch, setSubjectSearch] = useState<any>("");
  const [topicSearch, setTopicSearch] = useState<any>("");

  const fetchData = () => {
    setLoader(true);
    getData("Syllabus")
      .then((res: any) => {
        setAllSyllabusData(res);
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
    fetchData();
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

  const handleDelete = () => {
    setActionLoader(true);
    console.log(syllabusObj);
    deleteData("Syllabus", syllabusObj.id)
      .then(() => {
        handleCloseModal();
        setSyllabusObj({});
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
    const finalObj = { ...syllabusObj, ...editedSyllabusObj };
    console.log(finalObj);
    setActionLoader(true);
    setData("Syllabus", finalObj)
      .then(() => {
        setSyllabusObj({});
        setEditedSyllabusObj({});
        fetchData();
        handleCloseModal();
        setActionLoader(false);
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
    setEditedSyllabusObj({});
  };

  const getValue = (field: string) => {
    return editedSyllabusObj[field] !== undefined
      ? editedSyllabusObj[field]
      : syllabusObj[field];
  };

  // Search Mechanism
  useEffect(() => {
    let filteredData = allSyllabusData;

    if (classSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.SyllabusClass.toLowerCase().includes(classSearch.toLowerCase())
      );
    }

    if (subjectSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.SyllabusSubject.toLowerCase().includes(subjectSearch.toLowerCase())
      );
    }

    if (topicSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.SyllabusTopic.toLowerCase().includes(topicSearch.toLowerCase())
      );
    }

    setFilteredSyllabusData(filteredData);
  }, [classSearch, subjectSearch, topicSearch, allSyllabusData]);

  // Action Buttons
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
              setSyllabusObj(row);
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
              setSyllabusObj(row);
              setDelIsOpen(true);
            }}
          />
        </span>
      </Tooltip>
    </>
  );

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-[#0051ff] p-3 rounded">
          <h2 className="fs-4 mb-3 text-white">All Syllabus Data</h2>
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
                placeholder="Search by Class"
                value={classSearch}
                onChange={(e: any) => {
                  setClassSearch(e.target.value);
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
                placeholder="Search by Subject"
                value={subjectSearch}
                onChange={(e: any) => {
                  setSubjectSearch(e.target.value);
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
                placeholder="Search by Topic"
                value={topicSearch}
                onChange={(e: any) => {
                  setTopicSearch(e.target.value);
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
              data={filteredSyllabusData ? filteredSyllabusData : null}
              columns={[
                { id: "SyllabusClass", label: "Class" },
                { id: "SyllabusSubject", label: "Subject" },
                { id: "SyllabusTopic", label: "Topic" },
                { id: "SyllabusStartDate", label: "Start Date" },
                { id: "SyllabusEndDate", label: "End Date" },
                { id: "SyllabusDescription", label: "Description" },
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
  };

  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Syllabus"
        pageName="All Syllabus"
        breadcrumbNestedLink="All Syllabus"
      />
      <MyModal
        title="Edit Syllabus Details"
        height="55vh"
        onClose={handleCloseModal}
        isOpen={editIsOpen}
        body={
          <>
            <form onSubmit={(e) => handleEdit(e)}>
              <Row>
                <Col md={12} lg={6} className="mb-3">
                  <MySelect
                    label="Select Class"
                    defaultValue="Please Select Class"
                    value={getValue("SyllabusClass")}
                    onChange={(e: any) =>
                      setEditedSyllabusObj({
                        ...editedSyllabusObj,
                        SyllabusClass: e.target.value,
                      })
                    }
                    options={classesName}
                  />
                </Col>

                <Col md={12} lg={6} className="mb-3">
                  <MySelect
                    label="Select Subject"
                    defaultValue="Please Select Subject"
                    value={getValue("SyllabusSubject")}
                    onChange={(e: any) =>
                      setEditedSyllabusObj({
                        ...editedSyllabusObj,
                        SyllabusSubject: e.target.value,
                      })
                    }
                    options={subjectsName}
                  />
                </Col>

                <Col md={12} lg={6} className="mb-1">
                  <TextField
                    label="Topic"
                    name="Topic"
                    onChange={(e: any) =>
                      setEditedSyllabusObj({
                        ...editedSyllabusObj,
                        SyllabusTopic: e.target.value,
                      })
                    }
                    value={getValue("SyllabusTopic")}
                    type="text"
                    fullWidth
                  />
                </Col>
                <br />
                <Col md={12} lg={6} className="mb-3">
                  <TextField
                    label="Start Date"
                    name="Start Date"
                    onChange={(e: any) =>
                      setEditedSyllabusObj({
                        ...editedSyllabusObj,
                        SyllabusStartDate: e.target.value,
                      })
                    }
                    fullWidth
                    value={getValue("SyllabusStartDate")}
                    type="date"
                  />
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <TextField
                    label="End Date"
                    name="End Date"
                    onChange={(e: any) =>
                      setEditedSyllabusObj({
                        ...editedSyllabusObj,
                        SyllabusEndDate: e.target.value,
                      })
                    }
                    value={getValue("SyllabusEndDate")}
                    type="date"
                    fullWidth
                  />
                </Col>
                <Col md={12}>
                  <MyTextarea
                    value={getValue("SyllabusDescription")}
                    onChange={(e: any) =>
                      setEditedSyllabusObj({
                        ...editedSyllabusObj,
                        SyllabusDescription: e.target.value,
                      })
                    }
                    label="Description"
                  />
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
        title={`Are you sure you want to delete the syllabus for ${syllabusObj.SyllabusClass} - ${syllabusObj.SyllabusSubject}?`}
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

export default AllSyllabus;
