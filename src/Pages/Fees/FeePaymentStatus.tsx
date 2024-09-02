import { useEffect, useState } from "react";
import Sidebar from "../../Layout/Sidebar";
import Grid from "../../Components/MyGrid";
import { getData, setData } from "../../Config/FirebaseMethods";
import MyLoader from "../../Components/MyLoader";
import { Input, Tooltip } from "@mui/material";
import MyButton from "../../Components/MyButton";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import MySelect from "../../Components/MySelect";
import ConfirmModal from "../../Components/ConfirmModal";
import { toastGreen, toastRed } from "../../Components/My Toasts";
function FeePaymentStatus() {
  const [loader, setLoader] = useState(false);
  const [allStudentsData, setAllStudentsData] = useState<any>(false);
  const [filteredStudentsData, setFilteredStudentsData] = useState<any>(false);
  const [payIsOpen, setPayIsOpen] = useState<boolean>(false);
  const [studentObj, setStudentObj] = useState<any>({});
  const [rollSearch, setRollSearch] = useState<any>("");
  const [nameSearch, setNameSearch] = useState<any>("");
  const [classSearch, setClassSearch] = useState<any>("");
  const [feeSearch, setFeeSearch] = useState<any>("All");

  const fetchData = () => {
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
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setPayIsOpen(false);
    setStudentObj({});
  };

  const handlePay = () => {
    console.log(studentObj);
    const year = new Date().getFullYear();
    const month = new Date().toLocaleString("default", { month: "long" });
    const finalObj = {
      ...studentObj,
      FeeDetails: {
        ...studentObj.FeeDetails,
        [year]: {
          ...studentObj.FeeDetails?.[year],
          [month]: "Paid",
        },
      },
    };
    console.log(finalObj);
    setData("Students", finalObj)
      .then(() => {
        handleCloseModal();
        fetchData();
        toastGreen("Payment successfully processed!");
      })
      .catch((err) => {
        console.log(err);
        handleCloseModal();
        toastRed("Payment failed. Please try again.");
      });
  };

  // Search Mechanism
  useEffect(() => {
    let filteredData = allStudentsData;

    if (rollSearch !== "") {
      filteredData = filteredData.filter(
        (item: any) => item.StudentRoll == rollSearch
      );
    }

    if (nameSearch !== "") {
      filteredData = filteredData.filter(
        (item: any) =>
          item.StudentFirstName.toLowerCase().includes(
            nameSearch.toLowerCase()
          ) ||
          item.StudentLastName.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    if (classSearch !== "") {
      filteredData = filteredData.filter((item: any) =>
        item.StudentClass.toLowerCase().includes(classSearch.toLowerCase())
      );
    }

    if (feeSearch !== "All") {
      const year = new Date().getFullYear();
      const month = new Date().toLocaleString("default", { month: "long" });

      filteredData = filteredData.filter((item: any) => {
        const feeDetailsExist =
          item.FeeDetails &&
          item.FeeDetails[year] &&
          item.FeeDetails[year][month];
        if (feeSearch === "Not Generated") {
          return !feeDetailsExist;
        }
        return feeDetailsExist && item.FeeDetails[year][month] === feeSearch;
      });
    }

    setFilteredStudentsData(filteredData);
  }, [rollSearch, nameSearch, classSearch, feeSearch, allStudentsData]);

  const renderActions = (row: any) => (
    <>
      <Tooltip title="Pay" placement="top">
        <span>
          <MyButton
            bgColor="var(--green)"
            hoverBgColor="#00943e"
            className="p-0 px-1 pt-1 me-2"
            btnValue={
              <lord-icon
                src="https://cdn.lordicon.com/lxizbtuq.json"
                style={{ width: "37px", height: "37px" }}
                trigger="hover"
              />
            }
            onClick={() => {
              setStudentObj(row);
              setPayIsOpen(true);
            }}
          />
        </span>
      </Tooltip>

      {/* <Tooltip title="View Details" placement="top">
        <span>
          <MyButton
            bgColor="var(--orange)"
            hoverBgColor="#b87a00"
            className="p-0 px-1 pt-1"
            btnValue={
              <lord-icon
                src="https://cdn.lordicon.com/anqzffqz.json"
                trigger="hover"
                style={{ width: "37px", height: "37px" }}
              />
            }
            onClick={() => {
              navigate(`/students/${row.id}`);
            }}
          />
        </span>
      </Tooltip> */}
    </>
  );
  const content = () => {
    return (
      <>
        <div className="container-fluid bg-[#0051ff] p-3 rou1nded">
          <h2 className="fs-4 mb-3 text-white">All Fees Collection</h2>
          <Row>
            <Col sm={12} md={3}>
              <Input
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                fullWidth
                placeholder="Search by Roll"
                value={rollSearch}
                onChange={(e: any) => {
                  setRollSearch(e.target.value);
                }}
                type="text"
              />
            </Col>
            <Col sm={12} md={3}>
              <Input
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 3,
                }}
                fullWidth
                placeholder="Search by Name"
                value={nameSearch}
                onChange={(e: any) => {
                  setNameSearch(e.target.value);
                }}
                type="text"
              />
            </Col>
            <Col sm={12} md={3}>
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
            <Col sm={12} md={3}>
              <MySelect
                label="Search by Fee Status*"
                defaultValuesValue="All"
                defaultValue="All"
                value={feeSearch}
                onChange={(e: any) => {
                  setFeeSearch(e.target.value);
                }}
                options={["Unpaid", "Paid", "Not Generated"]}
              />
            </Col>
          </Row>

          {loader ? (
            <MyLoader />
          ) : (
            <Grid
              data={filteredStudentsData ? filteredStudentsData : null}
              columns={[
                // { id: "StudentRoll", label: "Roll" },
                { id: "StudentFirstName", label: "First Name" },
                { id: "StudentLastName", label: "Last Name" },
                { id: "StudentGender", label: "Gender" },
                { id: "StudentFatherName", label: "Father Full Name" },
                { id: "StudentClass", label: "Class" },
                // { id: "StudentGuardianPhone", label: "Guardian Phone" },
                {
                  id: "FeeDetails(Changed)",
                  label: "Fee Month",
                  render: () => {
                    return new Date().toLocaleString("default", {
                      month: "long",
                    });
                  },
                },
                {
                  id: "FeeDetails",
                  label: "Fee Status",
                  render: (row: any) => {
                    localStorage.getItem("USERID");
                    const classes = "px-3 py-2 rounded-pill";
                    const year = new Date().getFullYear();
                    const month = new Date().toLocaleString("default", {
                      month: "long",
                    });
                    const feeStatus = row.FeeDetails?.[year]?.[month];
                    return feeStatus ? (
                      <span
                        className={
                          feeStatus == "Unpaid"
                            ? `bg-red text-white ${classes}`
                            : `bg-green text-white ${classes}`
                        }
                      >
                        {feeStatus}
                      </span>
                    ) : (
                      <span className={`bg-[#ff8400] ${classes} text-white`}>
                        Not G
                      </span>
                    );
                  },
                },
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
  const year = new Date().getFullYear();
  const month = new Date().toLocaleString("default", { month: "long" });
  const feeDetailsExist =
    studentObj.FeeDetails &&
    studentObj.FeeDetails[year] &&
    studentObj.FeeDetails[year][month];
  console.log(feeDetailsExist);
  return (
    <>
      <Sidebar
        element={content()}
        breadcrumbLink="Fees"
        pageName="Fee Payment Status"
        breadcrumbNestedLink="Fee Submission"
      />

      <ConfirmModal
        title={
          feeDetailsExist ? (
            feeDetailsExist == "Unpaid" ? (
              `Are you sure you want to proceed with the payment of ${studentObj.StudentFees}/- for ${studentObj.StudentFirstName} ${studentObj.StudentLastName}'s fee?`
            ) : (
              ` ${studentObj.StudentFirstName} ${studentObj.StudentLastName}'s fee is already paid`
            )
          ) : (
            <>
              Generate the fee to proceed{" "}
              <Link to="/fees/generateFee">Generate Fee Here</Link>
            </>
          )
        }
        icon={
          <lord-icon
            src="https://cdn.lordicon.com/jtiihjyw.json"
            trigger="hover"
            style={{ width: "120px", height: "120px" }}
          />
        }
        onClose={handleCloseModal}
        isOpen={payIsOpen}
        body={
          <>
            {feeDetailsExist ? (
              feeDetailsExist == "Unpaid" ? (
                <MyButton
                  bgColor="var(--green)"
                  hoverBgColor="#00943e"
                  className="me-4"
                  btnValue="Yes, Proceed"
                  onClick={() => {
                    handlePay();
                  }}
                />
              ) : (
                <MyButton
                  bgColor="var(--green)"
                  hoverBgColor="#00943e"
                  className="me-4"
                  btnValue="Close"
                  onClick={handleCloseModal}
                />
              )
            ) : (
              <MyButton
                bgColor="var(--green)"
                hoverBgColor="#00943e"
                className="me-4"
                btnValue="Generate Fee"
                // onClick={() => {
                //   navigate("/fees/generateFee");
                // }}
              />
            )}
            {feeDetailsExist == "Paid" ? null : (
              <MyButton
                bgColor="var(--red)"
                hoverBgColor="rgb(139, 0, 0)"
                btnValue="No, Cancel"
                onClick={handleCloseModal}
              />
            )}
          </>
        }
      />
    </>
  );
}

export default FeePaymentStatus;
