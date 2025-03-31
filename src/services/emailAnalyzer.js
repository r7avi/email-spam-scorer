class EmailAnalyzer {
  static analyzeEmail(email) {
    const analysis = {
      score: 0,
      issues: [],
      details: {}
    };

    // Check headers
    this.analyzeHeaders(email.headers, analysis);

    // Check content
    this.analyzeContent(email.content, analysis);

    // Check subject
    this.analyzeSubject(email.subject, analysis);

    // Check sender
    this.analyzeSender(email.from, analysis);

    // Calculate final score (0-100, higher is better)
    analysis.score = Math.max(0, Math.min(100, 100 - (analysis.issues.length * 10)));

    return analysis;
  }

  static analyzeHeaders(headers, analysis) {
    if (!headers) return;

    // Check for missing important headers
    if (!headers['dkim-signature']) {
      analysis.issues.push('Missing DKIM signature');
      analysis.details.dkim = false;
    }

    if (!headers['spf']) {
      analysis.issues.push('Missing SPF record');
      analysis.details.spf = false;
    }

    // Check for suspicious headers
    if (headers['x-priority'] === '1') {
      analysis.issues.push('High priority flag used');
      analysis.details.highPriority = true;
    }
  }

  static analyzeContent(content, analysis) {
    if (!content) return;

    // Check for spam trigger words
    const spamWords = ['viagra', 'lottery', 'winner', 'inheritance', 'urgent', 'congratulations'];
    const foundSpamWords = spamWords.filter(word => 
      content.toLowerCase().includes(word)
    );

    if (foundSpamWords.length > 0) {
      analysis.issues.push(`Contains spam trigger words: ${foundSpamWords.join(', ')}`);
      analysis.details.spamWords = foundSpamWords;
    }

    // Check for excessive punctuation
    const exclamationCount = (content.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      analysis.issues.push('Excessive use of exclamation marks');
      analysis.details.exclamationCount = exclamationCount;
    }
  }

  static analyzeSubject(subject, analysis) {
    if (!subject) return;

    // Check for all caps
    if (subject === subject.toUpperCase()) {
      analysis.issues.push('Subject is in all caps');
      analysis.details.allCapsSubject = true;
    }

    // Check for spam trigger words in subject
    const spamWords = ['viagra', 'lottery', 'winner', 'inheritance', 'urgent', 'congratulations'];
    const foundSpamWords = spamWords.filter(word => 
      subject.toLowerCase().includes(word)
    );

    if (foundSpamWords.length > 0) {
      analysis.issues.push(`Subject contains spam trigger words: ${foundSpamWords.join(', ')}`);
      analysis.details.subjectSpamWords = foundSpamWords;
    }
  }

  static analyzeSender(from, analysis) {
    if (!from) return;

    // Check for suspicious sender patterns
    if (from.includes('noreply@') || from.includes('no-reply@')) {
      analysis.issues.push('Uses no-reply address');
      analysis.details.noReplyAddress = true;
    }

    // Check for random-looking sender addresses
    const randomPattern = /[a-z0-9]{10,}@/i;
    if (randomPattern.test(from)) {
      analysis.issues.push('Sender address looks random');
      analysis.details.randomSender = true;
    }
  }
}

module.exports = { EmailAnalyzer }; 