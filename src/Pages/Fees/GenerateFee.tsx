import { Col, Row } from "react-bootstrap"
import Sidebar from "../../Layout/Sidebar"
import MySelect from "../../Components/MySelect"
import { useEffect, useState } from "react"
import { getData, setData } from "../../Config/FirebaseMethods"
import FloatingInput from "../../Components/FloatingInput"
import MyButton from "../../Components/MyButton"
import MyLoader from "../../Components/MyLoader"
import { toastGreen, toastRed } from "../../Components/My Toasts"

function GenerateFee() {
    const [classesName, setClassesName] = useState<any>([])
    const [allClassesData, setAllClassesData] = useState<any>(false)
    const [classStudents, setClassStudents] = useState<any>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [feesOptions, setFeesOptions] = useState<any>(false)

    const fetchClassesData = () => {
        getData("Classes").then((res: any) => {
            setAllClassesData(res);
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchClassesData();
        setFeesOptions({ ...feesOptions, Year: new Date().getFullYear() })
    }, [])

    useEffect(() => {
        if (allClassesData) {
            if (classesName.length !== allClassesData.length) {
                setClassesName([...allClassesData.map((item: any) => item.ClassName)]);
            }
        }
    }, [allClassesData])

    const handleReset = () => {
        setFeesOptions({
            Year: new Date().getFullYear(),
            Month: "",
            Class: "",
        })
    }

    const handleSave = (e: any) => {
        e.preventDefault();
        getData("Students")
            .then((res: any) => {
                setClassStudents(res.filter((item: any) => item.StudentClass === feesOptions.Class));
            })
            .catch((err) => {
                console.log(err);
            });
    };
    
    const editFeesInDatabase = () => {
        setLoader(true);
        if (classStudents.length > 0) {
            const promises = classStudents.map((item: any) => {
                let updatedFeeDetails = { ...item.FeeDetails };
                if (
                    updatedFeeDetails[feesOptions.Year] &&
                    updatedFeeDetails[feesOptions.Year][feesOptions.Month]
                ) {
                    return Promise.resolve();
                }
    
                if (!updatedFeeDetails[feesOptions.Year]) {
                    updatedFeeDetails[feesOptions.Year] = {};
                }
                updatedFeeDetails[feesOptions.Year][feesOptions.Month] = "Unpaid";
    
                let finalObj = { ...item, FeeDetails: updatedFeeDetails };
                console.log(finalObj, "FINAL OBJECT");
                return setData("Students", finalObj);
            });
    
            Promise.all(promises)
                .then(() => {
                    setLoader(false);
                    handleReset();
                    toastGreen("Fee has been successfully generated!");
                })
                .catch((error) => {
                    console.log(error);
                    setLoader(false);
                    toastRed("Failed to generate Fee. Please try again.");
                });
        } else {
            setLoader(false);
            console.log("NOT WORKING GOIG IN ELSE");
        }
    };
    
    useEffect(() => {
        if (classStudents.length > 0) {
            editFeesInDatabase();
        }
    }, [classStudents]);




    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const content = () => {
        return (
            <>
                <div className="container-fluid bg-white p-3 rou1nded">
                    <h2 className='fs-4 mb-3'>Generate Monthly Fee</h2>
                    {loader ? <MyLoader /> : null}
                    <Row>
                        <Col md={12} lg={6}>
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <MySelect label="Select Class*" required={true} defaultValue="Please Select Class" value={feesOptions.Class} onChange={(e: any) => setFeesOptions({ ...feesOptions, Class: e.target.value })} options={classesName} />
                                </div>

                                <div className="mb-3">
                                    <MySelect label="Select Fee Month*" required={true} defaultValue="Please Select Month" value={feesOptions.Month} onChange={(e: any) => setFeesOptions({ ...feesOptions, Month: e.target.value })} options={months} />
                                </div>

                                <div className="mb-3">
                                    <FloatingInput label="Fee Year (Auto Generateed)" required={true} disabled={true} myValue={feesOptions.Year} type="text" />
                                </div>

                                <div className='d-flex gap-4'>
                                    <MyButton type="submit" bgColor="var(--orange)" textColor="black" hoverBgColor="var(--darkBlue)" className="px-4 py-3" btnValue={(<div className="d-flex align-items-center gap-2">Generate Fees <lord-icon src="https://cdn.lordicon.com/dangivhk.json" trigger="hover" style={{ width: "30px", height: "30px" }} /></div>)} />
                                    <MyButton btnValue={(<div className="d-flex align-items-center gap-2">Reset <lord-icon src="https://cdn.lordicon.com/abaxrbtq.json" trigger="hover" style={{ width: "30px", height: "30px" }} /></div>)} bgColor="var(--darkBlue)" hoverBgColor="var(--orange)" className="px-4 py-3" onClick={handleReset} />
                                </div>
                            </form>
                        </Col>
                        <Col md={12} lg={6}>
                            {!classStudents ? <h3 className="fs-5 text-center">Result Will Appear Here</h3> : (
                                <>
                                <h3 className="fs-5"><span className="text-muted">Roll</span> | <span className="text-danger">Student</span> | Parent | <span className="text-success">Status</span></h3>
                                <ul className="list-unstyled fs-5">
                                    {classStudents.map((item:any, index:any)=>(<li key={index}><span className="text-muted">{item.StudentRoll}</span> | <span className="text-danger">{item.StudentFirstName}</span> | {item.StudentFatherName} | <span className="text-success">Generated Successfully</span></li>))}
                                </ul>
                                </>
                            )}
                        </Col>
                    </Row>
                </div>
            </>
        )
    }

    return (
        <>
            <Sidebar element={content()} breadcrumbLink="Fees" pageName="Generate Monthly Fee" breadcrumbNestedLink="Fee Submission" />
        </>
    )
}

export default GenerateFee
