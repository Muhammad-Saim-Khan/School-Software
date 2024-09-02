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
import ConfirmModal from "../../Components/ConfirmModal";

function AllClasses() {
  const [loader, setLoader] = useState(true);
  const [actionLoader, setActionLoader] = useState(false);
  const [allClassesData, setAllClassesData] = useState<any>(false);
  const [allTeachersData, setAllTeachersData] = useState<any>(false);
  const [setAllSubjectsData] = useState<any>(false);
  const [allStudentsData, setAllStudentsData] = useState<any>(false);
  const [teachersName, setTeachersName] = useState<any>(false);
  const [filteredClassesData, setFilteredClassesData] = useState<any>(false);
  const [classObj, setClassObj] = useState<any>({});
  const [editedClassObj, seteditedClassObj] = useState<any>({});
  const [specificTeacher, setSpecificTeacher] = useState<any>([]);
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);
  const [delIsOpen, setDelIsOpen] = useState<boolean>(false);
  const [codeSearch, setCodeSearch] = useState<any>("");
  const [nameSearch, setNameSearch] = useState<any>("");
  const [teacherSearch, setTeacherSearch] = useState<any>("");

  const fetchData = () => {
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

  const fetchStudentsData = () => {
    setLoader(true);
    getData("Students")
      .then((res: any) => {
        setAllStudentsData(res);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (allStudentsData && allClassesData) {
      // setFilteredClassesData(allClassesData.filter((item:any)=>{
      //     if(item.ClassName == allStudentsData){
      //         return
      //     }
      // }))
      // allClassesData.map((className: any) => {
      //     allStudentsData.map((item: any) => {
      //         if (className.ClassName == item.StudentClass) {
      //             let arr = []
      //             arr.push(1)
      //             setFilteredClassesData({...filteredClassesData, ClassStudents: arr})
      //         }
      //     })
      // })
    }
  }, [allStudentsData, allClassesData]);

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
    fetchTeachersData();
    fetchSubjectsData();
    fetchStudentsData();
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
        editedClassObj.ClassTeacher
          ? editedClassObj.ClassTeacher === item.TeacherFirstName
          : classObj.ClassTeacher === item.TeacherFirstName
      );
      setSpecificTeacher(filteredTeachers);
    }
  }, [editedClassObj, editIsOpen, delIsOpen]);

  const handleDelete = () => {
    setActionLoader(true);
    deleteData("Classes", classObj.id)
      .then(() => {
        setClassObj({});
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
      TeacherClass: editedClassObj.ClassName ? editedClassObj.ClassName : "",
    };
    console.log(finalObja);
    setData("Teachers", finalObja)
      .then(() => {
        setClassObj({});
        seteditedClassObj({});
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
    const finalObj = { ...classObj, ...editedClassObj };
    setData("Classes", finalObj)
      .then(() => {
        setClassObj({});
        seteditedClassObj({});
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
      TeacherClass: editedClassObj.ClassName
        ? editedClassObj.ClassName
        : classObj.ClassName,
    };
    setData("Teachers", finalObja)
      .then(() => {
        setClassObj({});
        seteditedClassObj({});
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
    seteditedClassObj({});
  };

  const getValue = (field: string) => {
    return editedClassObj[field] !== undefined
      ? editedClassObj[field]
      : classObj[field];
  };

  //   const handleCheckboxChange = (subjectName: any) => {
  //     setClassObj((prevClassObj: any) => {
  //       let updatedSubjects;
  //       if (prevClassObj.ClassSubjects.includes(subjectName)) {
  //         updatedSubjects = prevClassObj.ClassSubjects.filter(
  //           (subject: any) => subject !== subjectName
  //         ); // Remove ssubject if already selected
  //       } else {
  //         updatedSubjects = [...prevClassObj.ClassSubjects, subjectName]; // Adds subject if not selected
  //       }
  //       return { ...prevClassObj, ClassSubjects: updatedSubjects };
  //     });
  //   };

  // Search Mechanism
  useEffect(() => {
    let filteredData = allClassesData;

    if (codeSearch !== "") {
      filteredData = filteredData.filter(
        (item: any) => item.ClassId == codeSearch
      );
    }

    if (nameSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.ClassName.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    if (teacherSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.ClassTeacher.toLowerCase().includes(teacherSearch.toLowerCase())
      );
    }

    if (allStudentsData && filteredData.length > 0) {
      filteredData = filteredData.map((classItem: any) => {
        const studentCount = allStudentsData.filter(
          (student: any) => student.StudentClass === classItem.ClassName
        ).length;
        return { ...classItem, ClassStudents: studentCount };
      });
    }

    setFilteredClassesData(filteredData);
  }, [codeSearch, nameSearch, teacherSearch, allClassesData, allStudentsData]);

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
              setClassObj(row);
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
              setClassObj(row);
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
        <div className="container-fluid  bg-[#0051ff] p-3 rounded">
          <h2 className="fs-4 mb-3 text-white">All Classes</h2>
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
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                placeholder="Search by Teachers"
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
              data={filteredClassesData ? filteredClassesData : null}
              columns={[
                { id: "ClassId", label: "Id" },
                { id: "ClassName", label: "Name" },
                { id: "ClassTeacher", label: "Class Teacher" },
                { id: "ClassStudents", label: "Students" },
                // { id: 'ClassStudents', label: 'Students', render: () => {
                //     allClassesData && allClassesData.map((item:any)=>{
                //         console.log(item, "CLASS DATA")
                //         allStudentsData && allStudentsData.map((stdntItem:any)=>{
                //         console.log(stdntItem.StudentClass, "STUDENT DATA")
                //             if (item.ClassName == stdntItem.StudentClass) {
                //                 let arr:any = []
                //                 arr.push(stdntItem.StudentFirstName)
                //                 console.log(arr)
                //                 return arr.length;
                //             }
                //         })
                //     })
                // } },
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
        breadcrumbLink="Classes"
        pageName="All Classes"
        breadcrumbNestedLink="All Classes"
      />

      <MyModal
        title="Edit Class Details"
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
                      label="Class Name"
                      name="Class Name"
                      fullWidth
                      required={true}
                      onChange={(e: any) =>
                        seteditedClassObj({
                          ...editedClassObj,
                          ClassName: e.target.value,
                        })
                      }
                      value={getValue("ClassName")}
                      type="text"
                    />
                  </div>
                </Col>
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <MySelect
                      label="Select Class Teacher"
                      required={true}
                      defaultValue="Select Class Teacher"
                      value={getValue("ClassTeacher")}
                      onChange={(e: any) =>
                        seteditedClassObj({
                          ...editedClassObj,
                          ClassTeacher: e.target.value,
                        })
                      }
                      options={teachersName}
                    />
                  </div>
                </Col>
                {/* <Col md={12} lg={6} className="mb-3">
                  {allSubjectsData.length > 0 &&
                    allSubjectsData.map((item: any, index: any) => (
                      <div key={index}>
                        <label
                          className="fs-5 me-2"
                          htmlFor={`subject-${index}`}
                        >
                          {item.SubjectName}
                        </label>
                        <input
                          type="checkbox"
                          value={item.SubjectName}
                          checked={
                            classObj.ClassSubjects &&
                            classObj.ClassSubjects.includes(item.SubjectName)
                          }
                          onChange={() =>
                            handleCheckboxChange(item.SubjectName)
                          }
                          id={`subject-${index}`}
                        />
                      </div>
                    ))}
                </Col> */}
                <Col md={12} lg={6} className="mb-3">
                  <div style={{ height: "58px" }}>
                    <TextField
                      fullWidth
                      label="Code (Auto Generated)"
                      disabled
                      required={true}
                      value={loader ? "Loading..." : classObj.ClassId}
                      type="text"
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
        title={`Are you sure you want to delete ${classObj.ClassName}`}
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

export default AllClasses;
