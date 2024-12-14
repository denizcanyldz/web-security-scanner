// content.js

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'executeTests') {
        const selectedTests = request.tests;
        const results = {};

        // Execute selected tests
        selectedTests.forEach(test => {
            switch (test) {
                case 'sqlInjection':
                    results.sqlInjection = testSQLInjection();
                    break;
                case 'xss':
                    results.xss = testXSS();
                    break;
                // Add more cases for other tests
                default:
                    results[test] = 'Test not implemented.';
            }
        });

        sendResponse(results);
    }
});

// Example: SQL Injection Test
function testSQLInjection() {
    // WARNING: This is a simplified example.
    // In a real-world scenario, performing SQL injection tests requires understanding the backend.
    // This example attempts to find input fields that might be vulnerable.

    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
    let vulnerable = false;
    const vulnerableFields = [];

    inputs.forEach(input => {
        // Attempt to inject a typical SQL payload
        const originalValue = input.value;
        const sqlPayload = "' OR '1'='1";

        input.value = sqlPayload;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        // Submit the form if possible
        const form = input.form;
        if (form) {
            form.submit();

            // Listen for potential errors or changes indicating vulnerability
            // Note: This is a placeholder. Real detection requires backend responses.
            // After submitting, you would need to monitor network responses or page changes.
            // For demonstration, we'll assume vulnerability if form submits.
            vulnerable = true;
            vulnerableFields.push(input.name || input.id || 'Unnamed Field');

            // Reset the input value
            input.value = originalValue;
        }
    });

    if (vulnerable) {
        return {
            status: 'Potential SQL Injection vulnerability detected.',
            fields: vulnerableFields
        };
    } else {
        return {
            status: 'No SQL Injection vulnerabilities detected.',
            fields: []
        };
    }
}

// Example: Cross-Site Scripting (XSS) Test
function testXSS() {
    // WARNING: This is a simplified example.
    // Performing XSS tests can be more complex and may require more sophisticated techniques.

    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
    let vulnerable = false;
    const vulnerableFields = [];

    const xssPayload = '<script>alert("XSS")</script>';

    inputs.forEach(input => {
        const originalValue = input.value;
        input.value = xssPayload;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        // Attempt to submit the form if possible
        const form = input.form;
        if (form) {
            form.submit();

            // Listen for script execution or other indicators
            // This is a placeholder. Real detection requires observing the DOM for payload execution.
            // For demonstration, we'll assume vulnerability if script is executed.
            // Implementing real detection would require more advanced methods.

            // Reset the input value
            input.value = originalValue;
        }
    });

    // Since detecting XSS requires monitoring for script execution,
    // which isn't feasible in this context, we'll return a placeholder.

    return {
        status: 'XSS test executed. Further analysis required to confirm vulnerability.',
        fields: []
    };
}

// Add more test functions as needed
