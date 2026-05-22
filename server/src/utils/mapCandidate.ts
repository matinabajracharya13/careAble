// utils/mapCandidate.ts

export const mapCandidate = (row: any) => {
  return {
    id: row.user_id,
    name: `${row.first_name} ${row.last_name}`,
    title: row.role || 'Care Worker',
    location: row.postcode || 'N/A',

    score: Number(row.score || 0),

    certs: row.certificate_code ? [row.certificate_code] : [],

    available: row.is_active, // you can replace with DB field later

    experience: calculateExperience(row.created_at)
  };
};

// optional helper
const calculateExperience = (createdAt: string) => {
  if (!createdAt) return 'N/A';

  const years = new Date().getFullYear() - new Date(createdAt).getFullYear();

  return `${years} years`;
};
