# LinkCipher

LinkCipher is a web-based compatibility analysis tool designed to help individuals explore the alignment of their experiences and values with others, such as in romantic, friendship, family, or professional relationships. Using a survey-based approach, it generates unique codes that encode Trauma and Values scores, which can then be compared to assess compatibility.

## Features
- **Survey System**: Answer a series of questions to generate a personalized compatibility code.
- **Code Comparison**: Enter two codes to compare compatibility, with insights into Links, Disconnects, and Caveats.
- **Visualizations**: View compatibility data through Bar Charts, Radar Charts, and Vertical Lines visualizations.
- **Detailed Analysis**: Provides a breakdown of individual Trauma and Values scores (available for Person 1 if surveyed).
- **Customizable Themes**: Adjust the theme color and toggle between light and dark modes.
- **Printable Reports**: Generate a detailed HTML report with visualizations and discussion points.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/linkcipher.git
   cd linkcipher
   ```

2. **Ensure Dependencies**:
   - The project uses Chart.js for visualizations and Tailwind CSS for styling, both loaded via CDN.
   - No additional server setup is required; it runs as a static web application.

3. **Prepare Files**:
   - Ensure `index.html`, `script.js`, `styles.css`, `data.js`, and `logo.png` are in the root directory.
   - Verify that `data.js` contains the survey questions array.

4. **Open in Browser**:
   - Double-click `index.html` or serve it via a local web server (e.g., using Python's `http.server`):
     ```bash
     python -m http.server 8000
     ```
   - Navigate to `http://localhost:8000` in your browser.

## Usage

### 1. Start the Survey
- Click "Start Survey" on the welcome screen.
- Answer each question with a score from 1 to 5, or skip to use the default score of 3.
- Complete the survey to generate your unique code.

### 2. Enter Codes
- Click "Enter Codes" on the welcome screen.
- Input your code (generated from the survey) and another person's code (manually entered or randomly generated).
- Click "Compare" to see the results.

### 3. View Results
- Explore the compatibility summary (Links, Disconnects, Caveats) with breakdowns for Finances, Health, and Measurables.
- Switch between Bar Chart, Radar Chart, and Vertical Lines visualizations to analyze the data.
- Click "Print Talking Points" to download a detailed HTML report.

### 4. Customize Experience
- Select a relationship type (Romantic, Friendship, Family, Professional) to tailor the analysis.
- Change the theme color using the color picker.
- Toggle between light and dark modes.

## Project Structure
- `index.html`: Main HTML file with the user interface.
- `script.js`: JavaScript logic for survey, code generation, comparison, and report generation.
- `styles.css`: Custom CSS for additional styling (optional, as Tailwind is used).
- `data.js`: Contains the survey questions array.
- `logo.png`: Project logo (replace with your own if needed).

## Enhancements
- **Detailed Analysis**: The report now includes tables breaking down Person 1's Trauma and Values scores by individual question responses (if surveyed). Person 2's detailed breakdown is unavailable unless their survey data is provided.
- **Radar Chart**: Replaced the Venn Diagram with a Radar Chart for better comparison of Trauma and Values scores between individuals.
- **Improved Report**: The printable report now features a "Detailed Analysis of Scores" section and updated visualizations.

## Contributing
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request. Ensure your code adheres to the existing style and includes tests if applicable.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, please open an issue on the GitHub repository or contact the project maintainer at [your-email@example.com](mailto:your-email@example.com).