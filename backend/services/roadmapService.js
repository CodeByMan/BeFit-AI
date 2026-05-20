function getStepsForCareer(title) {
  const map = {
    "web developer": [
      "Learn HTML/CSS",
      "Learn JavaScript basics",
      "Build small portfolio projects"
    ],
    "software engineer": [
      "Master data structures",
      "Learn a backend language",
      "Build real world apps"
    ]
  };

  return map[title.toLowerCase()] || [];
}

module.exports = { getStepsForCareer };
