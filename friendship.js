let questions = [
  { id: 'loyalty', text: 'How important is loyalty in your friendships?', followUp: { condition: 4, key: 'loyalty_followup', text: 'Is this due to external trauma (e.g., past betrayals) or internal drama (e.g., trust issues)?' } },
  { id: 'support', text: 'How much support do you offer your friends?', followUp: { condition: 4, key: 'support_followup', text: 'Is this due to external trauma (e.g., life events) or internal drama (e.g., personal capacity)?' } },
  { id: 'shared_interests', text: 'How much do you value shared interests?', followUp: { condition: 4, key: 'shared_interests_followup', text: 'Is this due to external trauma (e.g., social pressure) or internal drama (e.g., personal preferences)?' } },
  { id: 'conflict_friendship', text: 'How do you resolve conflicts with friends?', followUp: { condition: 4, key: 'conflict_friendship_followup', text: 'Is this due to external trauma (e.g., past disputes) or internal drama (e.g., communication style)?' } }
];