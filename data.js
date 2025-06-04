const questions = [
  { id: "violence", text: "To what extent has violence (personal or witnessed) shaped your life?", followUp: { condition: 4, text: "Does this experience affect your trust in others?", key: "violence_trust" } },
  { id: "divorce", text: "How have significant relationship endings affected your outlook?", followUp: { condition: 4, text: "Do breakups make you cautious in new relationships?", key: "divorce_caution" } },
  { id: "neglect", text: "Have you experienced emotional or physical neglect?", followUp: { condition: 4, text: "Does this impact your need for validation?", key: "neglect_validation" } },
  { id: "illness", text: "How has serious illness (yours or a loved one’s) influenced your perspective?", followUp: { condition: 4, text: "Does this affect your approach to health?", key: "illness_health" } },
  { id: "money", text: "How does financial abundance or scarcity shape your decisions?", followUp: { condition: 4, text: "Is financial security a priority in relationships?", key: "money_security" } },
  { id: "estrangement", text: "Have you experienced estrangement from family or close relationships?", followUp: { condition: 4, text: "Does this affect your desire for closeness?", key: "estrangement_closeness" } },
  { id: "addiction", text: "How has addiction (personal or in your circle) impacted you?", followUp: { condition: 4, text: "Does this influence your boundaries?", key: "addiction_boundaries" } },
  { id: "death", text: "How has loss through death affected your worldview?", followUp: { condition: 4, text: "Does this shape your approach to life’s priorities?", key: "death_priorities" } },
  { id: "trust", text: "How easily do you trust others?", followUp: null },
  { id: "communication", text: "How direct are you in expressing needs?", followUp: null },
  { id: "conflict", text: "How do you handle conflict?", followUp: null },
  { id: "religion", text: "How significant is religion or spirituality in shaping your values?", followUp: { condition: 4, text: "Do you prefer connections with similar beliefs?", key: "religion_alignment" } },
  { id: "politics", text: "How much do political beliefs or activities shape your worldview?", followUp: { condition: 4, text: "How important is aligning politically with others?", key: "politics_alignment" } },
  { id: "resilience", text: "How easily do you bounce back from challenges or setbacks?", followUp: null },
  { id: "extroversion", text: "How much do you enjoy or seek out social interactions?", followUp: null },
  { id: "risk", text: "How comfortable are you with taking risks or embracing uncertainty?", followUp: null },
  { id: "empathy", text: "How naturally do you tune into others’ feelings or perspectives?", followUp: null },
  { id: "tradition", text: "Do you prefer sticking to traditions or embracing new ways?", followUp: null }
];

const relationshipWeights = {
  romantic: { trust: 1.5, empathy: 1.5, communication: 1.2, conflict: 1.2, extroversion: 1.0, religion: 1.0, politics: 1.0 },
  business: { trust: 1.5, communication: 1.5, conflict: 1.2, risk: 1.2, politics: 1.0 },
  family: { trust: 1.2, empathy: 1.2, communication: 1.0, tradition: 1.2 },
  friend: { empathy: 1.2, extroversion: 1.2, communication: 1.0 },
  roommate: { conflict: 1.2, extroversion: 1.2, communication: 1.0, tradition: 1.0 },
  mentor: { trust: 1.5, communication: 1.2, empathy: 1.0, risk: 1.0 }
};