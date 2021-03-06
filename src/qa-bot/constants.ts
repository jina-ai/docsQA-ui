export const DEFAULT_PREFERENCE = {
    name: 'DocsQA',
    description: '@Jina AI',
    greeting: 'You should define custom questions inside <qa-bot>. Try:',
    questions: [
        'Create a <dl> block',
        'Set title using <dt>',
        'Set questions using <dd>'
    ],
    texts: {
        feedbackThumbUp: [`Thank you for providing your feedback. π Happy to help!`, 'Thank you for providing your feedback.', 'Thank you for providing your feedback. π', 'Thank you for providing your feedback. You are the best!'],
        feedbackThumbDown: [` πββοΈ Noted, thanks!`, 'π’ Sorry, my bad. Thank you for providing your feedback.', 'π¬ Will improve! Thank you for providing your feedback.'],
        contextHref: 'See context',
        unknownError: `π΅βπ« Sorry! Something somehow went wrong.\n β οΈPlease ping me later. πββοΈ`,
        networkError: `πΆβπ«οΈ Sorry! I'm experiencing some technical issues on networking. \nπ Please ping me later. πββοΈ`,
        serverError: `π₯Ά Sorry! My brain is freezing, I mean my server is down.\n πPlease ping me later. πββοΈ`,
        tip: `Hi there π \nAsk our docs!`,
        unknownAnswerText: `π΅βπ« I'm sorry but I don't know the answer.`,
        unknownAnswerLink: 'Report',
        unknownAnswerUrl: '',
    },
};
