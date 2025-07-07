module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: [
            'tests/step-definitions/*.ts',
            'tests/support/*.ts'
        ],
        paths: [
            'tests/features/*.feature'
        ],
        dryRun: false,
        // format: ['progress'],
        format: ["allure-cucumberjs/reporter"],
        formatOptions: {
            resultsDir: "allure-results",
        },
        parallel: 1,
        tags: '',
        failFast: false
    }
}