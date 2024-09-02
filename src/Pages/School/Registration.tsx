import { useEffect, useState } from "react";
import Sidebar from "../../Layout/Sidebar";
import { deleteData, getData, setData } from "../../Config/FirebaseMethods";
import { toastGreen, toastRed } from "../../Components/My Toasts";
import { Row, Col } from "react-bootstrap";
import MyButton from "../../Components/MyButton";
import MyLoader from "../../Components/MyLoader";
import { TextField } from "@mui/material";

function Registration() {
  const [pageLoader, setPageLoader] = useState(false);
  const [isSchoolRegistered, setIsSchoolRegistered] = useState<any>(false);
  const [schoolData, setSchoolData] = useState<any>({
    schoolName: "",
    schoolLogo: "",
    schoolAddress: "",
    phoneNumber: "",
    schoolEmail: "",
    website: "",
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    schoolTimings: "",
  });

  const fetchData = () => {
    setPageLoader(true);
    getData("School")
      .then((res: any) => {
        setIsSchoolRegistered(res);
        setPageLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = (e: any) => {
    e.preventDefault();
    setPageLoader(true);
    const finalObj = {
      ...schoolData,
      registrationDate: JSON.stringify(new Date()),
    };
    console.log(finalObj);
    setData("School", finalObj)
      .then(() => {
        handleReset();
        setPageLoader(false);
        fetchData();
        toastGreen("School has been successfully registered!");
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
        toastRed("Failed to register school. Please try again.");
      });
  };

  const handleDelete = () => {
    setPageLoader(true);
    console.log(isSchoolRegistered[0].id);
    deleteData("School", isSchoolRegistered[0].id)
      .then(() => {
        setPageLoader(false);
        setIsSchoolRegistered(false);
        toastGreen("School has been successfully registered!");
      })
      .catch((err) => {
        console.log(err);
        setPageLoader(false);
        toastRed("Failed to register school. Please try again.");
      });
  };

  const handleReset = () => {
    setSchoolData({
      schoolName: "",
      schoolLogo: "",
      schoolAddress: "",
      phoneNumber: "",
      schoolEmail: "",
      website: "",
      principalName: "",
      principalEmail: "",
      principalPhone: "",
      schoolTimings: "",
    });
  };

  const content = () => {
    return (
      <>
        <div className="container-fluid bg-white  p-3 rounded">
          {pageLoader ? <MyLoader /> : null}
          {isSchoolRegistered ? (
            <div className="bg-[#0051ff]">
              <div className="text-center text-white">
                <h1 className="fs-2">School Already has been registered!</h1>
                <MyButton
                  btnValue={
                    <div className="d-flex align-items-center gap-2">
                      Reset the previous data and register again{" "}
                      <lord-icon
                        src="https://cdn.lordicon.com/abaxrbtq.json"
                        trigger="hover"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </div>
                  }
                  bgColor="var(--darkBlue)"
                  hoverBgColor="var(--orange)"
                  className="px-3 py-2"
                  onClick={handleDelete}
                />
              </div>
              <hr />
              <div className="mt-4">
                <h2 className="fs-3 mb-3 text-white">School Details</h2>
                <Row className="font-bold">
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">School Name:</strong>{" "}
                      {isSchoolRegistered[0].schoolName}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">School Address:</strong>{" "}
                      {isSchoolRegistered[0].schoolAddress}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">Phone Number:</strong>{" "}
                      {isSchoolRegistered[0].phoneNumber}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">Email:</strong>{" "}
                      {isSchoolRegistered[0].schoolEmail}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">Website:</strong>{" "}
                      <a className="col-6" href={isSchoolRegistered[0].website}>
                        {isSchoolRegistered[0].website}
                      </a>
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">Principal Name:</strong>{" "}
                      {isSchoolRegistered[0].principalName}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">Principal Email:</strong>{" "}
                      {isSchoolRegistered[0].principalEmail}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">Principal Phone:</strong>{" "}
                      {isSchoolRegistered[0].principalPhone}
                    </p>
                  </Col>
                  <Col
                    md={12}
                    className="pt-4 schoolRegisteredDetails border-bottom pb-2"
                  >
                    <p className="row">
                      <strong className="col-6">School Timings:</strong>{" "}
                      {isSchoolRegistered[0].schoolTimings}
                    </p>
                  </Col>
                  <Col md={12} className="pt-4 schoolRegisteredDetails pb-2">
                    <p className="row">
                      <strong className="col-6">School Logo:</strong>{" "}
                      {isSchoolRegistered[0].schoolLogo}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <>
              <h2 className="fs-4 mb-3">Register Your School</h2>
              <form onSubmit={handleSave}>
                <Row className="mb-3">
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="School Name"
                      name="School Name"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          schoolName: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.schoolName}
                      type="text"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="School Logo"
                      name="School Logo"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          schoolLogo: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.schoolLogo}
                      type="file"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="School Address"
                      name="School Address"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          schoolAddress: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.schoolAddress}
                      type="text"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="Phone Number"
                      name="Phone Number"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          phoneNumber: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.phoneNumber}
                      type="text"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="School Email"
                      name="School Email"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          schoolEmail: e.target.value,
                        })
                      }
                      value={schoolData.schoolEmail}
                      type="email"
                      fullWidth
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="Website"
                      name="Website"
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          website: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.website}
                      type="text"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="Principal Name"
                      name="Principal Name"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          principalName: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.principalName}
                      type="text"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="Principal Email"
                      name="Principal Email"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          principalEmail: e.target.value,
                        })
                      }
                      value={schoolData.principalEmail}
                      fullWidth
                      type="email"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="Principal Phone"
                      name="Principal Phone"
                      required={true}
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          principalPhone: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.principalPhone}
                      type="text"
                    />
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <TextField
                      label="School Timings"
                      name="School Timings"
                      onChange={(e: any) =>
                        setSchoolData({
                          ...schoolData,
                          schoolTimings: e.target.value,
                        })
                      }
                      fullWidth
                      value={schoolData.schoolTimings}
                      type="text"
                    />
                  </Col>
                </Row>
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
              </form>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="School"
        pageName="School Registration"
        breadcrumbNestedLink="School Registration"
      />
    </>
  );
}

export default Registration;
