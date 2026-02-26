export type GlossaryTerm = {
  acronym: "EMG" | "EEG" | "IMU" | "CNN";
  expanded: string;
  definition: string;
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    acronym: "EMG",
    expanded: "Electromyography",
    definition: "Measures electrical activity produced by skeletal muscles, often used for intent detection in wearables."
  },
  {
    acronym: "EEG",
    expanded: "Electroencephalography",
    definition: "Records electrical activity from the scalp to analyze brain states, attention, and neural dynamics."
  },
  {
    acronym: "IMU",
    expanded: "Inertial Measurement Unit",
    definition: "A sensor package combining accelerometers and gyroscopes to track body or device motion."
  },
  {
    acronym: "CNN",
    expanded: "Convolutional Neural Network",
    definition: "A neural network architecture that learns hierarchical patterns from structured signals or images."
  }
];

export const glossaryMap = Object.fromEntries(
  glossaryTerms.map((term) => [term.acronym, term])
) as Record<GlossaryTerm["acronym"], GlossaryTerm>;
