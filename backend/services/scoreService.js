function computeOverall({ confidence, communication, technical }) {
  return Math.round((confidence * 0.3) + (communication * 0.35) + (technical * 0.35));
}

function generateBadge(score) {
  if (score >= 90) return 'Elite';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Competent';
  if (score >= 60) return 'Developing';
  return 'Beginner';
}

module.exports = { computeOverall, generateBadge };