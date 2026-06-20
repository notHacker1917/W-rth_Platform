// Standard list of English stop words (matching the PoC implementation)
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have',
  'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt',
  'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'shannt', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some',
  'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent',
  'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why',
  'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your',
  'yours', 'yourself', 'yourselves', 'requirements', 'responsibilities', 'key', 'ideal',
  'candidate', 'role', 'team', 'work'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

export interface MatchResult {
  jobId: string;
  score: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export function computeProfileJobMatching(
  studentProfile: { bio: string; skills: string[]; headline: string; interests?: string[] },
  jobs: Array<{ id: string; title: string; description: string; requiredSkills: string[]; department: string }>
): MatchResult[] {
  // 1. Build profile text
  const profileText = `${studentProfile.headline} ${studentProfile.bio} ${studentProfile.skills.join(' ')} ${
    studentProfile.interests?.join(' ') || ''
  }`;
  const profileTokens = tokenize(profileText);
  const profileVocab = new Set(profileTokens);

  // 2. Build and tokenize job texts
  const jobTokens: Record<string, string[]> = {};
  const jobVocabUnion = new Set<string>();

  jobs.forEach(job => {
    const jobText = `${job.title} ${job.department} ${job.description} ${job.requiredSkills.join(' ')}`;
    const tokens = tokenize(jobText);
    jobTokens[job.id] = tokens;
    tokens.forEach(t => jobVocabUnion.add(t));
  });

  // 3. Restrict profile vocabulary to terms that appear in at least one job description
  const filteredProfileTokens = profileTokens.filter(t => jobVocabUnion.has(t));

  // 4. Compute Document Frequency (DF) across the profile + all jobs
  const allDocs = [filteredProfileTokens, ...Object.values(jobTokens)];
  const N = allDocs.length;
  const df: Record<string, number> = {};

  allDocs.forEach(doc => {
    const docVocab = new Set(doc);
    docVocab.forEach(word => {
      df[word] = (df[word] || 0) + 1;
    });
  });

  // 5. Compute Inverse Document Frequency (IDF)
  const idf: Record<string, number> = {};
  Object.keys(df).forEach(word => {
    idf[word] = Math.log(1 + (N / df[word]));
  });

  // Helper to compute TF-IDF vector
  const getTfidfVec = (tokens: string[]): Record<string, number> => {
    const tf: Record<string, number> = {};
    tokens.forEach(t => {
      tf[t] = (tf[t] || 0) + 1;
    });
    
    const docLen = tokens.length;
    const vec: Record<string, number> = {};
    if (docLen === 0) return vec;

    Object.keys(tf).forEach(word => {
      vec[word] = (tf[word] / docLen) * (idf[word] || 0.0);
    });
    return vec;
  };

  const profileVec = getTfidfVec(filteredProfileTokens);

  // 6. Calculate Cosine Similarity and Lexical Coverage for each job
  const rawScores: Record<string, number> = {};

  jobs.forEach(job => {
    const tokens = jobTokens[job.id] || [];
    const jobVec = getTfidfVec(tokens);

    // Cosine Similarity
    const intersection = Object.keys(profileVec).filter(w => w in jobVec);
    let dotProduct = 0;
    intersection.forEach(w => {
      dotProduct += profileVec[w] * jobVec[w];
    });

    let sum1 = 0;
    Object.values(profileVec).forEach(val => {
      sum1 += val ** 2;
    });

    let sum2 = 0;
    Object.values(jobVec).forEach(val => {
      sum2 += val ** 2;
    });

    const cosineSim = (sum1 && sum2) ? dotProduct / (Math.sqrt(sum1) * Math.sqrt(sum2)) : 0.0;

    // Lexical Coverage (% of unique words in job description appearing in the profile)
    const jobVocab = new Set(tokens);
    let overlapCount = 0;
    jobVocab.forEach(w => {
      if (profileVocab.has(w)) {
        overlapCount++;
      }
    });
    const coverage = jobVocab.size > 0 ? overlapCount / jobVocab.size : 0.0;

    // Raw score composite
    rawScores[job.id] = cosineSim * coverage;
  });

  // 7. Scale scores so the highest score maps to 0.90 (90% Match) for presentation
  const maxRawScore = Math.max(...Object.values(rawScores), 0);
  const scaleFactor = maxRawScore > 0 ? 0.90 / maxRawScore : 1.0;

  return jobs.map(job => {
    const rawScore = rawScores[job.id] || 0;
    const score = Math.round((rawScore * scaleFactor) * 100) / 100;
    const matchPercentage = Math.round(score * 100);

    // Match skills directly
    const studentSkillsLower = new Set(studentProfile.skills.map(s => s.toLowerCase()));
    const matchedSkills = job.requiredSkills.filter(skill => studentSkillsLower.has(skill.toLowerCase()));
    const missingSkills = job.requiredSkills.filter(skill => !studentSkillsLower.has(skill.toLowerCase()));

    // Generate smart description based on the weights and overlaps
    let explanation = '';
    if (matchPercentage >= 75) {
      explanation = `Excellent alignment! Your profile features direct experience in ${matchedSkills.slice(0, 2).join(' and ')}, which matches this role's requirements closely.`;
    } else if (matchPercentage >= 50) {
      explanation = `Good potential match. You possess skills like ${matchedSkills.join(', ') || 'related concepts'}, but would benefit from picking up ${missingSkills.slice(0, 2).join(' or ')}.`;
    } else {
      explanation = `Low alignment. This position is highly focused on ${job.requiredSkills.slice(0, 2).join(', ')}, which does not strongly overlap with your current tech stack.`;
    }

    return {
      jobId: job.id,
      score,
      matchPercentage,
      matchedSkills,
      missingSkills,
      explanation
    };
  });
}
