import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./Components/HeroSection";
import ResumeShowcase from "./Components/ResumeShowcase";
// In App.js or index.js
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ResumeSection from "./Components/ResumeSection";
import MainPage from "./Components/MainPage";
import HeadingContactPage from "./Components/HeadingContactPage";
import WorkHistry from "./Components/WorkHistory/WorkHistry";
import WorkHistry1 from "./Components/WorkHistory/WorkHistry1";
import WorkExperienceForm from "./Components/WorkHistory/WorkExperienceForm";
import JobDescriptionForm from "./Components/WorkHistory/JobDescriptionForm";
import WorkHistorySummary from "./Components/WorkHistory/WorkHistrySummary";
import Sidebar from "./Components/Sidebar";
import PersonalDetails from "./Components/PersonalDetails";
import Threesteps from "./Components/threesteps";
import EducationTips from "./Components/Education/EducationTips";
import EducationLevel from "./Components/EducationLevel";
import EducationSection from "./Components/Education/EducationSection";
import EducationSummary from "./Components/Education/EducationSummary";
import Skills from "./Components/Skills";
import SkillSection from "./Components/SkillSection";
import ResumeSummary from "./Components/ResumeSummary";
import ResumeSummarySection from './Components/ResumeSummarySection';
import ExtraSection from './Components/Extras/ExtraSection';
import WebsiteSection from './Components/Extras/WebsiteSection';
import AccomplishmentsSection from './Components/Extras/AccomplishmentsSection';
import AdditionalInfoForm from "./Components/Extras/AdditionalInfoForm";
import Language from "./Components/Extras/Language";
import SoftWare from "./Components/Extras/SoftWare";
import Refferences from './Components/Extras/Refferences';
import Volunteer from './Components/Extras/Volunteer';
import Project from './Components/Project';
import ResumeEditor from "./Components/Resume/ResumeEditor";
import Resume1 from "./Components/Resume/Resume1";
import Resume2 from "./Components/Resume/Resume2";
import Resume3 from "./Components/Resume/Resume3";
import Resume4 from "./Components/Resume/Resume4";
import Resume5 from "./Components/Resume/Resume5";
import Resume6 from "./Components/Resume/Resume6";
import Resume7 from "./Components/Resume/Resume7";
import Resume8 from "./Components/Resume/Resume8";
import ResumeList from "./Components/Resume/ResumeList";
import StepsSection from "./Components/Resume/StepsSection";
import ResumeQuestionnaire from "./Components/Resume/ResumeQuestionnaire";
import { SectionProvider } from "./Components/Extras/SectionContext";
import Certifications from "./Components/Extras/Certifications";
import Interest from "./Components/Extras/Interest";
import CustomSectionPage from "./Components/Extras/CustomSectionPage";
import Login from "./Components/Login";
import Signup from "./Components/Resume/SignUp";
import CompleteResume from "./Components/CompleteResume";
import PersonalDetail from "./Components/Extras/PersonalDetails";
import Resume9 from "./Components/Resume/Resume9";
import Resume10 from "./Components/Resume/Resume10";
import Resume11 from "./Components/Resume/Resume11";
import Resume12 from "./Components/Resume/Resume12";
import Resume13 from "./Components/Resume/Resume13";
import Resume14 from "./Components/Resume/Resume14";
import Resume15 from "./Components/Resume/Resume15";
import Resume16 from "./Components/Resume/Resume16";
import Resume17 from "./Components/Resume/Resume17";
import Resume18 from "./Components/Resume/Resume18";
import Resume19 from "./Components/Resume/Resume19";
import Resume20 from "./Components/Resume/Resume20";
import Resume21 from "./Components/Resume/Resume21";
import MyAccountPage from "./Components/MyAccountPage";
import ResumeHistory from "./Components/ResumeHistory";
import TemplatesComponent from "./Components/TemplatesComponent";
      function App() {
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  return (
     <SectionProvider>
    <Router>
      {/* Page Content */}
      <Routes>
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/show" element={<ResumeShowcase />} />
        <Route path="/sho" element={<ResumeSection />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/HeadingContactPage" element={<HeadingContactPage />} />
        <Route path="/WorkHistry" element={<WorkHistry />} />
                <Route path="/WorkHistry1" element={<WorkHistry1 />} />
                <Route path="/WorkExperienceForm" element={<WorkExperienceForm />} />
                <Route path='/JobDescriptionForm' element={<JobDescriptionForm/>}/>
              <Route path='/WorkHistrySummary' element={<WorkHistorySummary/>}/>
                <Route path='/Sidebar' element={<Sidebar/>}/>
                <Route path='/PersonalDetails' element={<PersonalDetails/>}/>
                <Route path='/PersonalDetail' element={<PersonalDetail/>}/>
                <Route path='/Threesteps' element={<Threesteps/>}/>
                <Route path='/EducationTips' element={<EducationTips/>}/>
                <Route path='/EducationLevel' element={<EducationLevel/>}/>
                <Route path='/EducationSection' element={<EducationSection/>}/>
<Route path='/EducationSummary' element={<EducationSummary/>}/>
    <Route path='/Skills' element={<Skills/>}/>
          <Route path='/SkillSection' element={<SkillSection/>}/>
              <Route path='/ResumeSummary' element={<ResumeSummary/>}/>
              <Route path='/ResumeSummarySection' element={<ResumeSummarySection/>}/>
              <Route path='/ExtraSection' element={<ExtraSection/>}/>
              <Route path='/WebsiteSection' element={<WebsiteSection/>}/>
              <Route path='/AccomplishmentsSection' element={<AccomplishmentsSection/>}/>
              <Route path='/AdditionalInfoForm' element={<AdditionalInfoForm/>}/>
              <Route path='/Language' element={<Language/>}/>
              <Route path='/SoftWare' element={<SoftWare/>}/>
              <Route path='/Refferences' element={<Refferences/>}/>
              <Route path='/Volunteer' element={<Volunteer/>}/>
              <Route path='/Project' element={<Project/>}/>
               <Route path='/mainpage' element={<ResumeEditor/>}/>
        <Route path="/resume1" element={<Resume1 />} />
        <Route path="/resume2" element={<Resume2 />} />
        <Route path="/resume3" element={<Resume3 />} />
        <Route path="/resume4" element={<Resume4 />} />
        <Route path="/resume5" element={<Resume5 />} />
        <Route path="/resume6" element={<Resume6 />} />
        <Route path="/resume7" element={<Resume7 />} />
        <Route path="/resume8" element={<Resume8 />} />
        <Route path="/resume10" element={<Resume10 />} />
        <Route path="/resume11" element={<Resume11 />} />
        <Route path="/resume12" element={<Resume12 />} />
        <Route path="/resume13" element={<Resume13 />} />
        <Route path="/resume14" element={<Resume14 />} />
        <Route path="/resume15" element={<Resume15 />} />
        <Route path="/resume16" element={<Resume16 />} />
        <Route path="/resume17" element={<Resume17 />} />
        <Route path="/resume18" element={<Resume18 />} />
        <Route path="/resume19" element={<Resume19 />} />
        <Route path="/resume20" element={<Resume20 />} />
        <Route path="/resume21" element={<Resume21 />} />
        <Route path="/resume9" element={<Resume9 />} />
        <Route path="/resume" element={<ResumeList experience={questionnaireAnswers.experience} />} />
        <Route path='/steps' element={<StepsSection/>}/>
        <Route path='/experience-level' element={<ResumeQuestionnaire answers={questionnaireAnswers} setAnswers={setQuestionnaireAnswers} />}/>
        <Route path='/Certifications' element={<Certifications/>}/>
        <Route path='/Interest' element={<Interest/>}/>
<Route path="/custom-section/:name" element={<CustomSectionPage />} />
        <Route path="/resume11" element={<Resume11 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete" element={<CompleteResume />} />
        <Route path="/myaccount" element={<MyAccountPage />} />
        <Route path="/download" element={<ResumeHistory />} />
        <Route path="/history" element={<TemplatesComponent />} />
      </Routes>
    </Router>
          </SectionProvider>

  );
}

export default App;