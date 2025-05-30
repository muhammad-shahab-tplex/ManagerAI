import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const RoadmapPage = () => {
  return (
    <>
      <Head>
        <title>Roadmap | YourManager</title>
        <meta name="description" content="Coming soon - YourManager roadmap" />
      </Head>

      <div className="roadmap-page">
        <h1 className="roadmap-title">Product Roadmap</h1>
        <div className="coming-soon-container">
          <div className="coming-soon-badge">Coming Soon</div>
          <p className="roadmap-description">
            We're crafting the future of productivity management.
            Our roadmap will reveal innovative features designed to transform your workflow.
          </p>
        </div>
        <div className="back-link">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </>
  );
};

export default RoadmapPage;
