import Section from "./Section";
import SectionHeader from "./SectionHeader";
import SectionTitle from "./SectionTitle";
import SectionDescription from "./SectionDescription";
import SectionContent from "./SectionContent";
import SectionAction from "./SectionAction";

const SectionComponent = Object.assign(Section, {
  Header: SectionHeader,
  Title: SectionTitle,
  Description: SectionDescription,
  Content: SectionContent,
  Action: SectionAction,
});

export default SectionComponent;
