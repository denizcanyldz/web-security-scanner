// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const runTestsButton = document.getElementById('runTests');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    runTestsButton.addEventListener('click', () => {
        const selectedTests = Array.from(document.querySelectorAll('input[name="tests"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedTests.length === 0) {
            alert('Please select at least one test to run.');
            return;
        }

        console.log('Selected tests:', selectedTests);

        // Clear previous results and show loading indicator
        resultsDiv.innerHTML = '';
        loadingDiv.classList.remove('hidden');

        // Send message to background script to run tests
        chrome.runtime.sendMessage({ action: 'runTests', tests: selectedTests }, (response) => {
            // Hide loading indicator
            loadingDiv.classList.add('hidden');

            console.log('Popup received response:', response);

            if (response && response.success === false) {
                displayError(response.message);
                return;
            }
            displayResults(response);
        });
    });

    // Function to display test results
    function displayResults(results) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        for (const [test, result] of Object.entries(results)) {
            const testDiv = document.createElement('div');
            testDiv.className = 'result';

            const testName = document.createElement('h3');
            testName.textContent = formatTestName(test);
            testDiv.appendChild(testName);

            const status = document.createElement('p');
            status.innerHTML = `<strong>Status:</strong> ${result.status}`;
            testDiv.appendChild(status);

            if (result.details) {
                const details = document.createElement('p');
                details.innerHTML = `<strong>Details:</strong> ${result.details}`;
                testDiv.appendChild(details);
            }

            if (result.fields && result.fields.length > 0) {
                const fields = document.createElement('p');
                fields.innerHTML = `<strong>Fields:</strong> ${result.fields.join(', ')}`;
                testDiv.appendChild(fields);
            }

            resultsContainer.appendChild(testDiv);
        }
    }

    // Function to display errors
    function displayError(message) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `<p class="error">${message}</p>`;
    }

    // Helper function to format test names
    function formatTestName(test) {
        const testNames = {
            sqlInjection: 'SQL Injection',
            xss: 'Cross-Site Scripting (XSS)',
            csrf: 'Cross-Site Request Forgery (CSRF)',
            openRedirect: 'Open Redirect',
            // Add more test names as needed
        };
        return testNames[test] || test;
    }
});
