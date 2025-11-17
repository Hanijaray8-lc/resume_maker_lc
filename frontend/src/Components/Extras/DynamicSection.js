import { useSections } from "./SectionContext";
import { useNavigate } from "react-router-dom";
import WebsitesSection from "./WebsitesSection";
import CertificationsSection from "./CertificationsSection";
import LanguagesSection from "./LanguagesSection";
import AccomplishmentsSection from "./AccomplishmentsSection";

const sectionComponents = {
  "Websites, Portfolios, Profiles": WebsitesSection,
  "Certifications": CertificationsSection,
  "Languages": LanguagesSection,
  "Accomplishments": AccomplishmentsSection,
};

export default function DynamicSections() {
  const { sections, currentIndex, goNext, goBack } = useSections();
  const navigate = useNavigate();

  if (!sections.length) {
    return <p>No sections selected</p>;
  }

  const CurrentComponent =
    sectionComponents[sections[currentIndex]] || (() => <p>Not found</p>);

  return (
    <div>
      <CurrentComponent />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button onClick={goBack} disabled={currentIndex === 0}>
          Go Back
        </button>
        {currentIndex < sections.length - 1 ? (
          <button onClick={goNext}>Next</button>
        ) : (
          <button onClick={() => navigate("/final-preview")}>Finish</button>
        )}
      </div>
    </div>
  );
}
