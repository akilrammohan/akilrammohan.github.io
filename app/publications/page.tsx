import { ExpandableSection } from '@/components/ExpandableSection';
import { GroupedSections } from '@/components/GroupedSections';
import Navigation, { InternalNav } from '@/components/Navigation';

export const metadata = {
  title: 'Publications',
};

export default function PublicationsPage() {
  return (
    <>
      <InternalNav />
      <div className="main-content-column">
        <Navigation />
        <h1 className="floating-title">Publications</h1>

        <GroupedSections className="publications">
          <ExpandableSection
            label="Beyond Human Actors: Leveraging AI for Enhanced Public Safety XR Training"
            lines={[
              <>at {' '}
                <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">
                  NeuroErgonomics Lab
                </a>
                , UW-Madison</>,
              <>under{' '}
                <a href="https://scholar.google.com/citations?user=Khg_OvoAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                  Prof. Ranjana Mehta
                </a>
                {' '}&{' '}
                <a href="https://scholar.google.com/citations?user=aq58DMIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                  Dr. Ronak Mohanty
                </a></>,
              'XR app in Unity for law enforcement deescalation training',
              'explored if AI NPCs can replace human play-actors',
              '\u00A0',
              'implemented AI NPCs & developed consistent prompting framework',
              'built data collection pipeline: implicit bias, eye tracking, heart rate',
              'experiment design & trials w/ university participants, then UWPD officers',
              'summer + fall semester; trained two undergrads in fall',
              '\u00A0',
              <>published <a href="https://journals.sagepub.com/doi/abs/10.1177/10711813251379830" target="_blank" rel="noopener noreferrer">
                  paper
                </a>{' '}
                in Proceedings of the HFES Annual Meeting</>,
            ]}
          />
        </GroupedSections>
      </div>
    </>
  );
}
