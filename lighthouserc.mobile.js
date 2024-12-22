require('dotenv').config();

module.exports = {
  ci: {
    collect: {
      url: `${process.env.WEBSITE_URL}`,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.8 }],
        'categories:bestPractices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
      },
    },
  },
};
