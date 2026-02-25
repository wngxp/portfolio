export type ProjectCategory =
  | "Neural"
  | "Muscle"
  | "Motion"
  | "Systems"
  | "Applied ML";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tech: string[];
  links: {
    github?: string;
    demo?: string;
  };
  featured: boolean;
  showInConstellation: boolean;
  node: {
    x: number;
    y: number;
    r?: number;
  };
};

export const projects: Project[] = [
  {
    slug: "emg-pickerupper",
    title: "EMG PickerUpper",
    tagline: "Wearable gripper control from forearm muscle intent",
    description:
      "A wearable gripper concept that translates forearm bioelectric signals into open/close assistance. The pipeline includes preprocessing, intent thresholds, and simple adaptive calibration for different users. This project explores prosthetic-like extension behavior for lightweight daily assistance tasks.",
    category: "Muscle",
    tech: ["Python", "Signal Processing", "Embedded C", "Wearables"],
    links: {
      github: "https://github.com/yourusername/emg-pickerupper"
    },
    featured: true,
    showInConstellation: true,
    node: { x: 0.18, y: 0.31, r: 14 }
  },
  {
    slug: "emg-gait",
    title: "EMG Gait Phase",
    tagline: "Muscle-informed gait phase estimation for rehab contexts",
    description:
      "A gait phase estimator combining lower-limb muscle signals with timing heuristics to infer stance and swing transitions. Designed with exoskeleton and rehab robotics contexts in mind, it prioritizes interpretable state transitions and low-latency inference. Early evaluations focus on robustness during speed variation.",
    category: "Motion",
    tech: ["Python", "Time Series", "State Machines", "Rehab Robotics"],
    links: {
      github: "https://github.com/yourusername/emg-gait"
    },
    featured: true,
    showInConstellation: true,
    node: { x: 0.33, y: 0.18, r: 13 }
  },
  {
    slug: "eeg-decoding",
    title: "EEG Decoding",
    tagline: "Neural signal decoding workflow for brain-state inference",
    description:
      "A neural decoding prototype that maps band-limited brain signal features to cognitive-state labels. The project compares classic baselines and compact deep-learning blocks while emphasizing reproducible preprocessing. It is structured for rapid experimentation with channel selection and temporal windows.",
    category: "Neural",
    tech: ["PyTorch", "Feature Engineering", "Jupyter", "Neural Decoding"],
    links: {
      github: "https://github.com/yourusername/eeg-decoding"
    },
    featured: true,
    showInConstellation: true,
    node: { x: 0.49, y: 0.1, r: 12 }
  },
  {
    slug: "imu-cnn",
    title: "IMU-CNN Activity",
    tagline: "Activity recognition from motion sensor windows",
    description:
      "An activity recognition model using multi-axis motion sensor windows and a compact convolutional architecture. The pipeline covers segmentation, normalization, train-validation splitting, and confusion-matrix analysis. It is optimized for practical deployment constraints in wearables.",
    category: "Applied ML",
    tech: ["TensorFlow", "CNN", "IMU", "Model Evaluation"],
    links: {
      github: "https://github.com/yourusername/imu-cnn"
    },
    featured: true,
    showInConstellation: true,
    node: { x: 0.65, y: 0.2, r: 13 }
  },
  {
    slug: "bio322",
    title: "BIO322 Mouse Classifier",
    tagline: "Course project for structured biological classification",
    description:
      "A supervised classification pipeline for mouse-related dataset labels developed in a biomedical coursework setting. It includes feature cleaning, baseline model comparison, and explainability checks to understand prediction drivers. The implementation is framed as a production-style applied ML workflow.",
    category: "Applied ML",
    tech: ["scikit-learn", "Pandas", "XGBoost", "Data Validation"],
    links: {
      github: "https://github.com/yourusername/bio322"
    },
    featured: true,
    showInConstellation: true,
    node: { x: 0.8, y: 0.32, r: 14 }
  },
  {
    slug: "food-aging",
    title: "Food Aging Forecast",
    tagline: "Quality prediction model for shelf-life estimation",
    description:
      "A machine-learning study forecasting food quality changes over time from sensor and metadata features. The project focuses on data integrity, leakage prevention, and realistic evaluation splits to reflect operational conditions. Results are presented with calibration-aware confidence reporting.",
    category: "Applied ML",
    tech: ["Python", "Regression", "Calibration", "MLOps Basics"],
    links: {
      github: "https://github.com/yourusername/food-aging"
    },
    featured: false,
    showInConstellation: false,
    node: { x: 0.87, y: 0.47, r: 12 }
  },
  {
    slug: "coop-secure-uploader",
    title: "Secure Clinical Document Ingestion Pipeline",
    tagline: "Co-op systems project for compliant file intake",
    description:
      "A private company project focused on secure upload, validation, and routing of clinical documents into internal systems. The architecture emphasized traceability, access controls, and resilient processing under operational constraints. Implementation details are intentionally abstracted to protect confidentiality.",
    category: "Systems",
    tech: ["TypeScript", "Secure Upload", "Queueing", "Audit Logging"],
    links: {},
    featured: true,
    showInConstellation: true,
    node: { x: 0.56, y: 0.36, r: 13 }
  }
];

export const projectCategories: ProjectCategory[] = [
  "Neural",
  "Muscle",
  "Motion",
  "Systems",
  "Applied ML"
];

export const bySlug = (slug: string) => projects.find((project) => project.slug === slug);

export const constellationProjects = projects.filter((project) => project.showInConstellation);

export const featuredProjects = projects.filter((project) => project.featured);
