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
        feedbackThumbUp: [`Thank you for providing your feedback. 😀 Happy to help!`, 'Thank you for providing your feedback.', 'Thank you for providing your feedback. 😎', 'Thank you for providing your feedback. You are the best!'],
        feedbackThumbDown: [` 🙇‍♂️ Noted, thanks!`, '😢 Sorry, my bad. Thank you for providing your feedback.', '😬 Will improve! Thank you for providing your feedback.'],
        contextHref: 'See context',
        unknownError: `😵‍💫 Sorry! Something somehow went wrong.\n ⛑ ️Please ping me later. 🙇‍♂️`,
        networkError: `😶‍🌫️ Sorry! I'm experiencing some technical issues on networking. \n🌐 Please ping me later. 🙇‍♂️`,
        serverError: `🥶 Sorry! My brain is freezing, I mean my server is down.\n 🐛Please ping me later. 🙇‍♂️`,
        tip: `Hi there 👋 \nAsk our docs!`,
        unknownAnswerText: `😵‍💫 I'm sorry but I don't know the answer.`,
        unknownAnswerLink: 'Report',
        unknownAnswerUrl: '',
    },
};
