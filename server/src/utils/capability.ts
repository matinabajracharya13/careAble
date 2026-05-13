const calculateCapability = (ratio: number) => {
  if (ratio >= 0.75) return 'Strength';
  if (ratio >= 0.5) return 'Growth';
  return 'Support';
};
