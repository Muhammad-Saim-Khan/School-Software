import { useEffect, useRef, useState } from "react";
import Sidebar from "../../Layout/Sidebar"
import { getData } from "../../Config/FirebaseMethods";
import MySelect from "../../Components/MySelect";
import MyButton from "../../Components/MyButton";
import { Col, Row } from "react-bootstrap";
import MyLoader from "../../Components/MyLoader";

function FeeVoucher() {
    const [loader, setLoader] = useState<boolean>(false)
    const [allClasses, setAllClasses] = useState<any>(false)
    const [selectedClass, setSelectedClass] = useState<any>("")
    const [classStudents, setClassStudents] = useState<any>(false)
    const [classesName, setClassesName] = useState<any>([])

    const fetchClassData = () => {
        setLoader(true)
        getData("Classes").then((res: any) => {
            setLoader(false)
            setAllClasses(res)
        }).catch((err) => {
            console.log(err)
            setLoader(false)
        })
    }

    useEffect(() => {
        fetchClassData()
    }, [])

    useEffect(() => {
        if (allClasses) {
            if (classesName.length !== allClasses.length) {
                setClassesName([...allClasses.map((item: any) => item.ClassName)]);
            }
        }
    }, [allClasses])

    const handleSave = (e: any) => {
        e.preventDefault();
        setLoader(true)
        getData("Students")
            .then((res: any) => {
                setClassStudents(res.filter((item: any) => item.StudentClass === selectedClass));
                setLoader(false)
            })
            .catch((err) => {
                console.log(err);
                setLoader(false)
            });
    };

    const FeeVoucherComp = () => {
        const year = new Date().getFullYear();
        const month = new Date().toLocaleString('default', { month: 'long' });
        return (
            loader ? <MyLoader /> : classStudents &&
                <div>
                    {classStudents.map((item: any, index: any) => {
                        return (
                            <>
                                <Row key={index}>
                                    {["Parent Copy", "School Copy"].map((a) => (
                                        <Col lg={6}>
                                            <div className="fs-5 position-relative mb-4 p-4 border-black border">
                                                <h1 className="fs-2 text-center mb-4 text-decoration-underline">Fee Voucher</h1>
                                                <span className="position-absolute end-0 top-0 px-2 py-1 bg-bodyGray border">{a}</span>
                                                <div className="border row">
                                                    <span className="col-3">Roll</span>
                                                    <span className="col-3 border-start">{item.StudentRoll}</span>
                                                    <span className="col-3 border-start border-3">Class</span>
                                                    <span className="col-3 border-start">{item.StudentClass}</span>
                                                </div>
                                                <div className="border row">
                                                    <span className="col-4">First Name</span>
                                                    <span className="col-8 border-start">{item.StudentFirstName}</span>
                                                </div>
                                                <div className="border row">
                                                    <span className="col-4">Father Name</span>
                                                    <span className="col-8 border-start">{item.StudentFatherName}</span>
                                                </div>
                                                <div className="border row">
                                                    <span className="col-4">Month</span>
                                                    <span className="col-8 border-start">{month} {year}</span>
                                                </div>
                                                <div className="border row">
                                                    <span className="col-4">Fee Status</span>
                                                    <span className="col-8 border-start">{item.FeeDetails[year] && item.FeeDetails[year][month] ? item.FeeDetails[year][month] : 'Unpaid'}</span>
                                                </div>
                                                <div className="border row">
                                                    <span className="col-4">Amount</span>
                                                    <span className="col-8 border-start">{item.StudentFees}</span>
                                                </div>
                                                <div className="px-3 mt-2 text-center">
                                                    <span className="fw-semibold fs-6">*This is computer generated fee voucher, No manual corrections will be accepted</span>
                                                </div>
                                                <hr className="my-1" />
                                                <div className="d-flex justify-content-between mt-5">
                                                    <span>Recieved By</span> <span style={{ fontFamily: "sans-serif" }}> ________________________</span>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )
                    })}
                </div>
        );
    };



    const PrintFeeVoucher = () => {
        const voucherRef = useRef<any>(null);

        const handlePrint = () => {
            const printContents = voucherRef.current.innerHTML;
            const originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        };

        return (
            <div>
                {classStudents && <MyButton bgColor="var(--darkBlue)" hoverBgColor="var(--orange)" className="me-2 mb-3" btnValue="Print" onClick={handlePrint} />}
                <div ref={voucherRef}>
                    <FeeVoucherComp />
                </div>
            </div>
        );
    };

    const content = () => {
        return (
            <>
                <div className="container-fluid bg-white p-3 rou1nded">
                    <h2 className='fs-4 mb-3'>Fees Voucher</h2>
                    <form onSubmit={handleSave}>
                        <Row className="mb-3">
                            <Col lg={9}>
                                <MySelect label="Select Class*" required={true} defaultValue="Please Select Class" value={selectedClass} onChange={(e: any) => setSelectedClass(e.target.value)} options={classesName} />
                            </Col>
                            <Col lg={3}>
                                <MyButton type="submit" bgColor="var(--green)" hoverBgColor="#00943e" className="px-4 py-3" btnValue="Filter Data" />
                            </Col>
                        </Row>
                    </form>
                    <div>
                        <PrintFeeVoucher />
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Sidebar element={content()} breadcrumbLink="Fees" pageName="Fee Voucher" breadcrumbNestedLink="Fee Submission" />
        </>
    )
}

export default FeeVoucher
