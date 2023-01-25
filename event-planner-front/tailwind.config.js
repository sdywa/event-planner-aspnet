/** @type {import("tailwindcss").Config} */
module.exports = {
    mode: "jit",
    content: [
        "./src/**/*.{ts,tsx}",
        "./public/**/*.html"
    ],
    theme: {
        extend: {
        colors: {
            white: "#FFFFFF",
            backgroundWhite: "#F1F6F9",
            black: "#263147",
            lightgray: "#b4bbca",
            gray: "#858fa4",
            darkgray: "#656e82",
            green: "#00B94F",
            darkgreen: "#079a5a",
            red: "#E02B4C",
            yellow: "#EBB428" 
        },
        fontFamily: {
            ubuntu: ["Ubuntu", "sans-serif"],
            roboto: ["Roboto", "sans-serif"],
        }
        },
    },
    plugins: [],
}
