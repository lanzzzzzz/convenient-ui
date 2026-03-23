const stylelint = require('./stylelint.config.js');
const prettier = require('./prettier.config.js');

// 这里我们暂时不写 eslint 的完整配置，
// 因为 eslint 的依赖链比较复杂，我们先搞定你最关心的 CSS 部分。
// 后续如果需要，可以在这里追加。

module.exports = {
    stylelint,
    prettier
};