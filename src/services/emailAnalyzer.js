class EmailAnalyzer {
  static analyzeEmail(emailData) {
    // Initialize analysis object
    const analysis = {
      hasSpamKeywords: false,
      hasMaliciousLinks: false,
      hasSuspiciousAttachments: false,
      hasDeceptiveSender: false,
      hasExcessiveFormatting: false,
      hasSuspiciousTopic: false,
      score: 0
    };

    // Check for spam keywords in subject and content
    const spamKeywords = [
      'urgent', 'money', 'cash', 'free', 'winner', 'prize', 'offer',
      'limited time', 'act now', 'click here', 'discount', 'congratulations',
      'viagra', 'pharmacy', 'medications', 'pills', 'enlargement',
      'bank account', 'wire transfer', 'prince', 'lottery', 'million'
    ];

    const subject = emailData.subject?.toLowerCase() || '';
    const content = emailData.content?.toLowerCase() || '';

    // Check for spam keywords
    analysis.hasSpamKeywords = spamKeywords.some(keyword => 
      subject.includes(keyword) || content.includes(keyword)
    );

    // Check for suspicious links
    const suspiciousLinkPatterns = [
      /bit\.ly/i, /tinyurl/i, /goo\.gl/i, /click here/i,
      /verify your account/i, /suspicious activity/i
    ];
    
    analysis.hasMaliciousLinks = suspiciousLinkPatterns.some(pattern => 
      pattern.test(content)
    );

    // Check for attachments
    analysis.hasSuspiciousAttachments = content.includes('attachment') && 
      (content.includes('.exe') || content.includes('.zip') || content.includes('.rar'));

    // Check for deceptive sender
    analysis.hasDeceptiveSender = emailData.from && (
      emailData.from.includes('noreply') ||
      emailData.from.includes('notification') ||
      emailData.from.includes('support') ||
      emailData.from.includes('service') ||
      emailData.from.includes('admin')
    );

    // Check for excessive formatting
    analysis.hasExcessiveFormatting = 
      (content.match(/!+/g) || []).length > 3 ||
      (content.match(/\$+/g) || []).length > 2 ||
      content.includes('URGENT') || 
      content.includes('IMPORTANT');

    // Check for suspicious topics
    const suspiciousTopics = [
      'account suspended', 'verify your account', 'payment failed',
      'security alert', 'password reset', 'unusual activity',
      'inheritance', 'business proposal', 'investment opportunity'
    ];
    
    analysis.hasSuspiciousTopic = suspiciousTopics.some(topic => 
      subject.includes(topic.toLowerCase()) || content.includes(topic.toLowerCase())
    );

    // Calculate score (0-100)
    // Higher score means higher spam probability
    let score = 0;
    if (analysis.hasSpamKeywords) score += 25;
    if (analysis.hasMaliciousLinks) score += 30;
    if (analysis.hasSuspiciousAttachments) score += 35;
    if (analysis.hasDeceptiveSender) score += 15;
    if (analysis.hasExcessiveFormatting) score += 15;
    if (analysis.hasSuspiciousTopic) score += 20;

    // Cap score at 100
    analysis.score = Math.min(score, 100);

    return analysis;
  }
}

module.exports = { EmailAnalyzer }; 