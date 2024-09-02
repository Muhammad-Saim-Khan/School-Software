import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import AllStudents from "../Pages/Students/AllStudents";
import AdmissionForm from "../Pages/Students/AdmissionForm";
import StudentDetailedPage from "../Pages/Students/StudentDetailedPage";
import AllTeachers from "../Pages/Teachers/AllTeachers";
import AddTeachers from "../Pages/Teachers/AddTeachers";
import TeacherDetailedPage from "../Pages/Teachers/TeacherDetailedPage";
import TeacherAllocation from "../Pages/Teachers/TeacherAllocation";
import StudentPromotion from "../Pages/Students/StudentPromotion";
import AllSubjects from "../Pages/Subjects/AllSubjects";
import AddSubject from "../Pages/Subjects/AddSubject";
import AddClass from "../Pages/Classes/AddClass";
import AllClasses from "../Pages/Classes/AllClasses";
import FeeSubmission from "../Pages/Fees/GenerateFee";
import FeeVoucher from "../Pages/Fees/FeeVoucher";
import FeePaymentStatus from "../Pages/Fees/FeePaymentStatus";
import Registration from "../Pages/School/Registration";
import AllSyllabuses from "../Pages/Syllabus/AllSyllabuses";
import AddSyllabus from "../Pages/Syllabus/AddSyllabus";
import AddExam from "../Pages/Exams/AddExam";
import AllExamsShedule from "../Pages/Exams/AllExamsShedule";
import Protected from "./Protected";
import AllAccounts from "../Pages/Accounts/AllAccounts";
import AddAccount from "../Pages/Accounts/AddAccount";
import Signup from "../Pages/Signin";

function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route
            path="/dashboard"
            element={<Protected Component={Dashboard} />}
          />
          <Route
            path="/dashboard/students/allStudents"
            element={<Protected Component={AllStudents} />}
          />
          <Route
            path="/dashboard/students/admissionForm"
            element={<Protected Component={AdmissionForm} />}
          />
          <Route
            path="/dashboard/students/:id"
            element={<Protected Component={StudentDetailedPage} />}
          />
          <Route
            path="/dashboard/students/studentPromotion"
            element={<Protected Component={StudentPromotion} />}
          />
          <Route
            path="/dashboard/teachers/allTeachers"
            element={<Protected Component={AllTeachers} />}
          />
          <Route
            path="/dashboard/teachers/addTeachers"
            element={<Protected Component={AddTeachers} />}
          />
          <Route
            path="/dashboard/teachers/:id"
            element={<Protected Component={TeacherDetailedPage} />}
          />
          <Route
            path="/dashboard/teachers/teacherAllocation"
            element={<Protected Component={TeacherAllocation} />}
          />
          <Route
            path="/dashboard/subjects/allSubjects"
            element={<Protected Component={AllSubjects} />}
          />
          <Route
            path="/dashboard/subjects/addSubjects"
            element={<Protected Component={AddSubject} />}
          />
          <Route
            path="/dashboard/classes/addClass"
            element={<Protected Component={AddClass} />}
          />
          <Route
            path="/dashboard/classes/allClasses"
            element={<Protected Component={AllClasses} />}
          />
          <Route
            path="/dashboard/fees/generateFee"
            element={<Protected Component={FeeSubmission} />}
          />
          <Route
            path="/dashboard/fees/feesVoucher"
            element={<Protected Component={FeeVoucher} />}
          />
          <Route
            path="/dashboard/fees/feePaymentStatus"
            element={<Protected Component={FeePaymentStatus} />}
          />
          <Route
            path="/dashboard/school/registration"
            element={<Protected Component={Registration} />}
          />
          <Route
            path="/dashboard/syllabus/allSyllabuses"
            element={<Protected Component={AllSyllabuses} />}
          />
          <Route
            path="/dashboard/syllabus/addSyllabus"
            element={<Protected Component={AddSyllabus} />}
          />
          <Route
            path="/dashboard/exams/addExam"
            element={<Protected Component={AddExam} />}
          />
          <Route
            path="/dashboard/exams/allExamsSchedule"
            element={<Protected Component={AllExamsShedule} />}
          />
          <Route
            path="/dashboard/allAccounts"
            element={<Protected Component={AllAccounts} />}
          />
          <Route
            path="/dashboard/addAccount"
            element={<Protected Component={AddAccount} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRouter;
