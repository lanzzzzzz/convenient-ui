module.exports = {
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-recommended-vue"
    ],
    rules: {
        // 1. 禁止使用未知的伪类 (默认报错)
        // 我们必须允许 'deep' 和 'global'，因为这是 Vue 特有的，
        // 但是！我们可以通过下面的规则来限制它的使用。
        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: ["deep", "global", "export"]
            }
        ],

        // 2. 🔥 核心：限制选择器的嵌套深度
        // 这里的数字 3 意味着：不允许超过 3 层的嵌套。
        // 这样就物理上禁止了 .a .b .c .d .e {} 这种“屎山”代码。
        // 同时也让 ::v-deep 很难发挥作用（因为 deep 通常需要很深的层级）。
        "selector-max-compound-selectors": 3,

        // 3. 命名规范：强制类名使用 kebab-case (中划线命名)
        // 禁止 .MyClass 或 .myClass，必须是 .my-class
        "selector-class-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",

        // 4. 禁止空的样式块
        "block-no-empty": true
    }
};