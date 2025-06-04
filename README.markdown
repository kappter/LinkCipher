# LinkCipher

LinkCipher is a web-based app that helps users discover compatibility in relationships—whether romantic, professional, familial, or otherwise—through a unique, privacy-focused approach. By taking an adaptive survey, users generate a cryptic code that encapsulates their core values and life experiences. Share this code with another person to reveal links, disconnects, and caveats, presented in engaging visualizations like bar charts, Venn diagrams, or vertical lines. No data is stored, ensuring complete privacy.

## Features

- **Adaptive Survey**: Answer 10–20 questions on a 1–5 scale, covering life experiences (e.g., loss, financial background) and values (e.g., trust, empathy). Questions adapt based on your responses for a tailored experience.
- **Cryptic Code**: Generate a unique, time-stamped code (e.g., “X7B4-Z9C2”) that hides your answers, preserving privacy while enabling secure sharing.
- **Compatibility Insights**: Compare two codes to get a narrative summary of links (shared strengths), disconnects (potential differences), and caveats (areas needing discussion), customized for relationship types like romantic partner or business colleague.
- **Dynamic Visuals**: View results as a bar chart, Venn diagram, or vertical lines, with a toggle to switch between formats for intuitive understanding.
- **Personalization**: Choose a theme color (default: Mariner Blue) to customize the interface.
- **Privacy-First**: All processing is client-side; no data is stored or transmitted.
- **Random Code Option**: Test the app by generating a random code for comparison without needing a second user.

## Benefits

- **Build Stronger Connections**: Understand compatibility in any relationship, from roommates to mentors, with insights tailored to your context.
- **Navigate Differences**: Identify potential challenges and receive empathetic advice to foster communication and understanding.
- **Private and Secure**: Share codes confidently, knowing your personal data is never stored or exposed.
- **Engaging Experience**: A sleek interface with dynamic visuals makes exploring compatibility intuitive and engaging.

## Installation

1. **Clone or Download**:
   ```bash
   git clone https://github.com/your-username/linkcipher.git
   ```
   Or download the ZIP from the repository.

2. **File Structure**:
   - `index.html`: Main page with home, survey, code entry, and results screens.
   - `styles.css`: Custom styles for a sleek, responsive interface.
   - `data.js`: Question sets and relationship weights.
   - `script.js`: Logic for survey, code generation, and visualizations.

3. **Dependencies**:
   - Uses [Tailwind CSS](https://cdn.tailwindcss.com) for styling (loaded via CDN).
   - Uses [p5.js](https://p5js.org) for visualizations (loaded via CDN).

4. **Run Locally**:
   - Open `index.html` in a modern browser (e.g., Chrome, Firefox).
   - No server required, as all logic is client-side.

## Usage

1. **Home Screen**: Choose “Take Survey” to create your code or “Enter Codes” to compare two codes.
2. **Survey**: Select a relationship type (e.g., romantic, business) and answer questions on a 1–5 scale. Skip any question if preferred.
3. **Code Generation**: After the survey, get a unique code (e.g., “K8P3-M4V7”) that includes a timestamp for uniqueness.
4. **Comparison**: Enter your code and another’s (or use “Random Code” for testing). View a summary with links, disconnects, and caveats, plus visualizations (toggle between bar chart, Venn diagram, or vertical lines).
5. **Customize**: Pick a theme color to personalize the interface.

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make changes and commit (`git commit -m "Add feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions or feedback, open an issue on GitHub or reach out to the project maintainers.

© 2025 LinkCipher. All rights reserved.