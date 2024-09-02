import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from './FirebaseConfig';
import MyLoader from '../Components/MyLoader';
import { useNavigate } from 'react-router-dom';
import { toastRed } from '../Components/My Toasts';

function Protected({ Component }: any) {
    const [loader, setLoader] = useState<any>(true)
    const navigate = useNavigate()
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                localStorage.setItem("USERID", uid);
                setLoader(false);
            } else {
                navigate("/");
                if (!localStorage.getItem('USERID')) {
                    toastRed("User is not logged in.");
                }
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    return (
        <>
            {loader ? <MyLoader /> : <Component />}
        </>
    )
}

export default Protected
