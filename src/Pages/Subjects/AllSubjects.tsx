import { Input, TextField, Tooltip } from "@mui/material";
import Sidebar from "../../Layout/Sidebar";
import { Col, Row } from "react-bootstrap";
import MyLoader from "../../Components/MyLoader";
import MyButton from "../../Components/MyButton";
import Grid from "../../Components/MyGrid";
import { useEffect, useState } from "react";
import { deleteData, getData, setData } from "../../Config/FirebaseMethods";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import MyModal from "../../Components/MyModal";
import MySelect from "../../Components/MySelect";
import MyTextarea from "../../Components/MyTextarea";
import ConfirmModal from "../../Components/ConfirmModal";

function AllSubjects() {
  const [loader, setLoader] = useState(true);
  const [actionLoader, setActionLoader] = useState(false);
  const [allSubjectsData, setAllSubjectsData] = useState<any>(false);
  const [allTeachersData, setAllTeachersData] = useState<any>(false);
  const [teachersName, setTeachersName] = useState<any>(false);
  const [filteredSubjectsData, setFilteredSubjectsData] = useState<any>(false);
  const [subjectObj, setSubjectObj] = useState<any>({});
  const [editedSubjectObj, seteditedSubjectObj] = useState<any>({});
  const [specificTeacher, setSpecificTeacher] = useState<any>([]);
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);
  const [delIsOpen, setDelIsOpen] = useState<boolean>(false);
  const [codeSearch, setCodeSearch] = useState<any>("");
  const [nameSearch, setNameSearch] = useState<any>("");
  const [teacherSearch, setTeacherSearch] = useState<any>("");

  const fetchData = () => {
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

  const fetchTeachersData = () => {
    setLoader(true);
    getData("Teachers")
      .then((res: any) => {
        setAllTeachersData(res);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
    fetchTeachersData();
  }, []);

  useEffect(() => {
    if (allTeachersData) {
      if (teachersName.length !== allTeachersData.length) {
        setTeachersName([
          ...allTeachersData.map((item: any) => item.TeacherFirstName),
        ]);
      }
    }
  }, [allTeachersData]);

  useEffect(() => {
    if (allTeachersData) {
      setSpecificTeacher([]);
      const filteredTeachers = allTeachersData.filter((item: any) =>
        editedSubjectObj.SubjectTeacher
          ? editedSubjectObj.SubjectTeacher === item.TeacherFirstName
          : subjectObj.SubjectTeacher === item.TeacherFirstName
      );
      setSpecificTeacher(filteredTeachers);
    }
  }, [editedSubjectObj, editIsOpen, delIsOpen]);

  const handleDelete = () => {
    setActionLoader(true);
    deleteData("Subjects", subjectObj.id)
      .then(() => {
        setSubjectObj({});
        fetchData();
        setActionLoader(false);
        toastGreen("Record successfully deleted!");
      })
      .catch((err) => {
        console.log(err);
        setActionLoader(false);
        toastRed("Failed to delete the data. Please try again.");
      });

    const finalObja = {
      ...specificTeacher[0],
      TeacherSubject: editedSubjectObj.SubjectName
        ? editedSubjectObj.SubjectName
        : "",
    };
    setData("Teachers", finalObja)
      .then(() => {
        setSubjectObj({});
        seteditedSubjectObj({});
        fetchData();
        setActionLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setActionLoader(false);
      });
  };

  const handleEdit = (e: any) => {
    e.preventDefault();
    setActionLoader(true);
    const finalObj = { ...subjectObj, ...editedSubjectObj };
    setData("Subjects", finalObj)
      .then(() => {
        setSubjectObj({});
        seteditedSubjectObj({});
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

    const finalObja = {
      ...specificTeacher[0],
      TeacherSubject: editedSubjectObj.SubjectName
        ? editedSubjectObj.SubjectName
        : subjectObj.SubjectName,
    };
    setData("Teachers", finalObja)
      .then(() => {
        setSubjectObj({});
        seteditedSubjectObj({});
        fetchData();
        setActionLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setActionLoader(false);
      });
  };

  const handleCloseModal = () => {
    setEditIsOpen(false);
    setDelIsOpen(false);
    seteditedSubjectObj({});
  };

  const getValue = (field: string) => {
    return editedSubjectObj[field] !== undefined
      ? editedSubjectObj[field]
      : subjectObj[field];
  };

  // Search Mechanism
  useEffect(() => {
    let filteredData = allSubjectsData;

    if (codeSearch !== "") {
      filteredData = filteredData.filter(
        (item: any) => item.SubjectCode == codeSearch
      );
    }

    if (nameSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.SubjectName.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    if (teacherSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.SubjectTeacher.toLowerCase().includes(teacherSearch.toLowerCase())
      );
    }

    setFilteredSubjectsData(filteredData);
  }, [codeSearch, nameSearch, teacherSearch, allSubjectsData]);

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
              setSubjectObj(row);
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
              setSubjectObj(row);
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
          <h2 className="fs-4 mb-3 text-white">All Subjects</h2>
          <Row>
            <Col sm={12} md={4}>
              <Input
                placeholder="Search by Teachers ID"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                value={codeSearch}
                onChange={(e: any) => {
                  setCodeSearch(e.target.value);
                }}
                type="text"
              />
            </Col>
            <Col sm={12} md={4}>
              <Input
                placeholder="Search by Teachers Name"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                value={nameSearch}
                onChange={(e: any) => {
                  setNameSearch(e.target.value);
                }}
                type="text"
              />
            </Col>
            <Col sm={12} md={4}>
              <Input
                placeholder="Search by Teachers Subject"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                value={teacherSearch}
                onChange={(e: any) => {
                  setTeacherSearch(e.target.value);
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
              data={filteredSubjectsData ? filteredSubjectsData : null}
              columns={[
                { id: "SubjectCode", label: "Code" },
                { id: "SubjectName", label: "Name" },
                { id: "SubjectTeacher", label: "Assigned Teacher" },
                { id: "SubjectShortDesc", label: "Description" },
                // { id: "SubjectClass", label: "Class" },
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
        breadcrumbLink="Subjects"
        pageName="All Subjects"
        breadcrumbNestedLink="All Subjects"
      />

      <MyModal
        title="Edit Subjects Details"
        height="55vh"
        onClose={handleCloseModal}
        isOpen={editIsOpen}
        body={
          <>
            <form onSubmit={(e: any) => handleEdit(e)}>
              <Row className="row-gap-2 mt-3">
                <Col md={12} lg={6}>
                  <div style={{ height: "58px" }}>
                    <TextField
                      label="Subjects Name"
                      name="Subjects Name"
                      required={true}
                      onChange={(e: any) =>
                        seteditedSubjectObj({
                          ...editedSubjectObj,
                          SubjectName: e.target.value,
                        })
                      }
                      fullWidth
                      value={getValue("SubjectName")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <MySelect
                      label="Select Assigned Teacher"
                      required={true}
                      defaultValue="Select Assigned Teacher"
                      value={getValue("SubjectTeacher")}
                      onChange={(e: any) =>
                        seteditedSubjectObj({
                          ...editedSubjectObj,
                          SubjectTeacher: e.target.value,
                        })
                      }
                      options={teachersName}
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      fullWidth
                      label="Code (Auto Generated)"
                      disabled
                      required={true}
                      value={loader ? "Loading..." : subjectObj.SubjectCode}
                      type="text"
                    />
                  </div>
                </Col>
                <Col lg={12} xl={6} className="mb-3">
                  <div>
                    <MyTextarea
                      required={false}
                      value={getValue("SubjectShortDesc")}
                      onChange={(e: any) =>
                        seteditedSubjectObj({
                          ...editedSubjectObj,
                          SubjectShortDesc: e.target.value,
                        })
                      }
                      label="Subjects Short Description"
                    />
                  </div>
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
        title={`Are you sure you want to delete ${subjectObj.SubjectName}`}
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

export default AllSubjects;
