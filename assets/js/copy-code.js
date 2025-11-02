// function copyCode(button) {
//     const codeBlock = button.closest('.code-block-wrapper').querySelector('pre code');
//     const text = codeBlock.textContent;

//     navigator.clipboard.writeText(text).then(() => {
//         const originalText = button.querySelector('.copy-text').textContent;
//         button.classList.add('copied');
//         button.querySelector('.copy-text').textContent = 'Copied!';

//         setTimeout(() => {
//             button.classList.remove('copied');
//             button.querySelector('.copy-text').textContent = originalText;
//         }, 2000);
//     }).catch(err => {
//         console.error('Failed to copy code:', err);
//     });
// }