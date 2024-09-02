import { useNavigate } from "react-router-dom"
import MyButton from "../../Components/MyButton"
import { useEffect, useState } from "react"
import { toastGreen, toastRed } from "../../Components/My Toasts"
import { getData, signupUser } from "../../Config/FirebaseMethods"
import MyLoader from "../../Components/MyLoader"
import Sidebar from "../../Layout/Sidebar"

function AddAccount() {
    const [userData, setUserData] = useState<any>({})
    const [loader, setLoader] = useState<any>(false)
    const [confirmClass, setConfirmClass] = useState<any>("")
    const navigate = useNavigate()
    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (userData.password !== userData.confirmPass) {
            toastRed("Passwords do not match")
            return;
        }
        setLoader(true)
        signupUser(userData.email, userData.password, userData.userName, userData.userType)
            .then(() => {
                setLoader(false)
                toastGreen("Account Successfully created.")
                setUserData({ userName: "", email: "", password: "", confirmPass: "" });
                navigate("/dashboard")
            }).catch((err) => {
                setLoader(false)
                toastRed(err)
            })
    }

    useEffect(() => {
        let id: any = localStorage.getItem("USERID")
        if (id) {
            setLoader(true)
            getData("Users", id).then((res: any) => {
                if (res.UserType !== "Admin") {
                    toastRed("Only admin can create accounts.");
                    navigate("/dashboard");
                }
                setLoader(false)
            }).catch(() => { setLoader(false) })
        }

        if (userData) {
            if (userData.password !== userData.confirmPass) {
                setConfirmClass("confirmPassword")
                console.log("INNER")
            } else {
                setConfirmClass("")
            }
        }
    }, [userData])

    const content = () => {
        return (
            <>
                <div className="container-fluid bg-white p-3 rounded">
                    <div className="overflow-y-auto d-flex flex-column justify-content-center align-items-center main-w3layouts wrapper">
                        <h2 className="text-center display-4  fw-semibold mb-4">Create an account</h2>
                        <div className="w-100">
                            <div className="p-1 py-sm-0 p-sm-5">
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="UserName" className="text-black fs-5">Username</label>
                                    <input id="UserName" value={userData.userName} className="textInputs" type="text" placeholder="Username" required onChange={(e) => setUserData({ ...userData, userName: e.target.value })} />
                                    <label htmlFor="Email" className="text-black fs-5">Email</label>
                                    <input id="Email" value={userData.email} className="textInputs email" type="email" placeholder="Email" required onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                                    <label htmlFor="Type" className="text-black fs-5">User Type</label>
                                    <select id="Type" required className="textInputs" value={userData.userType} onChange={(e) => setUserData({ ...userData, userType: e.target.value })}>
                                        <option className="text-black" value="Admin">Admin</option>
                                        <option className="text-black" value="Accountant" selected>Accountant</option>
                                    </select>
                                    <label htmlFor="Password" className="text-black fs-5">Password</label>
                                    <input id="Password" value={userData.password} className="textInputs" type="password" placeholder="Password" required onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                                    <label htmlFor="ConfirmPassword" className="text-black fs-5">Confirm Password</label>
                                    <input id="ConfirmPassword" value={userData.confirmPass} className={`textInputs ${confirmClass}`} type="password" placeholder="Confirm Password" required onChange={(e) => setUserData({ ...userData, confirmPass: e.target.value })} />
                                    <div className="row px-2">
                                        <MyButton type="submit" textColor="black" bgColor="var(--orange)" hoverBgColor="#b87a00" className="px-4 py-3" btnValue="SIGNUP" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }


    return (
        <>
            {loader && <MyLoader />}
            <Sidebar element={content()} breadcrumbLink="Accounts" breadcrumbNestedLink="Add Account" pageName="Add Account" />
        </>
    )
}

export default AddAccount