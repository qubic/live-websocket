# Qubic Star Rain

## Overview
Qubic Star Rain is a dynamic visualization project that displays moving text with real-time Qubic network statistics. It creates an engaging visual experience by animating text across the screen, updating with the latest data from the Qubic network.

## Features
- Animated moving text display
- Real-time fetching and display of Qubic network statistics
- Responsive design that adjusts to window size
- Smooth transitions between different statistics
- Automatic cycling through various network metrics

## Key Components
- `MovingText` class: Handles the creation, animation, and updating of text elements
- `ApiStatsService`: Fetches the latest statistics from the Qubic network API

## Statistics Displayed
- Timestamp
- Circulating Supply
- Active Addresses
- Price
- Market Cap
- Epoch
- Current Tick
- Ticks in Current Epoch
- Empty Ticks in Current Epoch
- Epoch Tick Quality
- Burned QUs

## Setup and Usage
1. Include the necessary HTML elements in your page
2. Initialize the `MovingText` class with initial text
3. Call the `update` and `draw` methods in your animation loop

## Dependencies
- TypeScript
- A modern web browser with JavaScript enabled

## Future Enhancements
- Customizable color schemes
- User-configurable display options
- Additional Qubic network statistics

## Contributing
Contributions to Qubic Star Rain are welcome. Please ensure you follow the existing code style and add unit tests for any new features.

## License
As we use some parts from the 451 Package to our Wallet also apply the Anti-Military License. See https://github.com/computor-tools/qubic-crypto
Further our Wallet Code is protected by the AGPL-3.0 License. You may use our Source-Code for what you need to do business.

## Contact
[[https://github.com/AndyQus](https://github.com/AndyQus)]
