import './EnvironmentBanner.css';

const EnvironmentBanner = () => {
  const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
  const label = isDemo ? 'DEMO MODE' : 'MAIN MODE';
  const subLabel = isDemo
    ? 'Using sample data and demo APIs'
    : 'Using production application flow';

  return (
    <div className={`env-banner ${isDemo ? 'env-banner-demo' : 'env-banner-main'}`}>
      <span className="env-banner-label">{label}</span>
      <span className="env-banner-sub">{subLabel}</span>
    </div>
  );
};

export default EnvironmentBanner;
