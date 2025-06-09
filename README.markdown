# LinkCipher Talking Points Generator

## Overview
LinkCipher is a web-based tool designed to generate talking points and compatibility insights for various relationship types (romantic, friendship, family, professional). It uses a survey-based approach to collect responses, generates unique codes, and compares them to provide detailed reports with visualizations.

## Features
- **Survey System**: Answer questions about your experiences and values to generate a personal code.
- **Random Code Generation**: Create a second code for comparison with randomized data.
- **Compatibility Report**: Compare two codes to get insights, including links, disconnects, caveats, and detailed score comparisons.
- **Visualizations**: Includes bar charts, scatter plots, line charts, and clustered comparisons to visualize data.
- **Printable Reports**: Export a formatted HTML report with all analysis and charts.

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge).
- Internet connection for loading external libraries (Tailwind CSS, Chart.js).

### Installation
1. Clone the repository or download the files:
   ```
   git clone <repository-url>
   ```
2. Ensure all `.js` files (`index.html`, `ui.js`, `survey.js`, `code.js`, `charts.js`, `report.js`, and relationship files like `romantic.js`) are in the same directory.
3. Open `index.html` in a web browser to start.

### Usage
1. **Select Relationship Type**: Choose from "Romantic," "Friendship," "Family," or "Professional" using the dropdown.
2. **Take Survey**: Click "Start Survey," answer questions with the slider (1-5), and use "Next" or "Skip" to proceed. Optional follow-ups may appear for high scores.
3. **Generate Codes**: After completing the survey, `code1` is generated. Click "Generate Random Code" for `code2`.
4. **Compare Codes**: Click "Compare Codes" to see a summary, then "Print Talking Points" to download a report.
5. **View Report**: Open the downloaded `.html` file to review the analysis and visualizations.

## File Structure
- `index.html`: Main HTML structure and entry point.
- `ui.js`: Handles UI interactions and screen transitions.
- `survey.js`: Manages survey question loading and response collection.
- `code.js`: Generates and compares codes based on responses.
- `charts.js`: Initializes chart visualizations.
- `report.js`: Generates the printable report HTML.
- `romantic.js`, `friendship.js`, `family.js`, `professional.js`: Define relationship-specific survey questions.

## Troubleshooting
- **Survey Not Loading**: Clear browser cache (Ctrl+Shift+Delete in Chrome) and ensure relationship files use `window.questions = [...]`.
- **Duplicates in Report**: If random codes produce identical scores, regenerate `code2` or check `code.js` for updates.
- **Incorrect Totals**: Verify all scores are correctly summed in the report; update `code.js` if needed.
- **Console Errors**: Check for `SyntaxError` or `ReferenceError` and ensure files are not cached.

## Contributing
Feel free to fork this repository, submit issues, or propose enhancements. Ensure changes align with the existing structure and test thoroughly.

## License
© 2025 Ken Kapptie | For educational use only | All rights reserved.

## Contact
For support or questions, reach out via the repository or contact the maintainer.