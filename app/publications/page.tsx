import { Navigation } from '@/components/Navigation';

export const metadata = {
  title: 'Publications',
};

export default function PublicationsPage() {
  return (
    <div className="container">
      <h1>Akil Rammohan's Publications</h1>
      <Navigation />

      <div className="paper-card">
        <p className="paper-title">
          <a href="https://doi.org/10.1177/10711813251379830" target="_blank" rel="noopener noreferrer">
            Beyond Human Actors: Leveraging AI for Enhanced Public Safety XR Training
          </a>
        </p>
        <p className="paper-authors">
          R. Mohanty, <strong>A. Rammohan</strong>, K. Pater, W. Chen, R. K. Mehta
        </p>
        <p className="paper-venue">
          <em>Proceedings of the Human Factors and Ergonomics Society Annual Meeting</em>, 2025
        </p>
        <p className="paper-links">
          <a href="https://doi.org/10.1177/10711813251379830" target="_blank" rel="noopener noreferrer">DOI</a>
        </p>
      </div>

      <p>
        I was an undergraduate researcher at the{' '}
        <a href="https://neuroergolab.org/" target="_blank" rel="noopener noreferrer">NeuroErgonomics Lab</a>, under{' '}
        <a href="https://scholar.google.com/citations?user=aq58DMIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Dr. Ronak Mohanty</a> and{' '}
        <a href="https://scholar.google.com/citations?user=Khg_OvoAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Dr. Ranjana Mehta</a>, from summer to winter 2024. We examined the efficacy of embodied AI NPCs at replacing human play-actors in law enforcement deescalation training scenarios. I mainly helped implement the AI NPCs and develop a prompting framework for them, as well as set up the data collection and analysis pipeline for implicit bias, eye tracking, and heart rate data. I ran many participant studies with UW students, and later UWPD officers, and helped train two new undergrads to run studies in the fall.
      </p>
      <p>
        We found that officers participating in our trials decreased their implicit bias scores by 50%, for race and gender.
      </p>
    </div>
  );
}
