# WISE IoT Safety System

WISE is an experimental browser interface for pairing an ESP32-based safety device used by women and children. The interface sends a configuration request to a device on the user's trusted local network.

> **Prototype status:** WISE is research and demonstration software. It has not been independently audited or certified as an emergency system. Do not rely on it as the only way to request help or contact emergency services.

## Recognition and open-source vision

This work grew out of **Nirbhaya – Unobtrusively Assured Safety**, which won **1st Prize at the 9th ACCS Design Challenge 2024**. The project was selected from nine finalist teams, with the finals held at IIIT Bangalore on March 23, 2025. [Read the competition announcement and project story](https://lnkd.in/p/gFRdVn8f).

We are open-sourcing WISE so that developers, researchers, hardware builders, accessibility specialists, and safety advocates can help make the project more reliable, inclusive, and useful. Contributions that improve testing, device compatibility, documentation, privacy, accessibility, and real-world usability are especially welcome.

## What is included

- A responsive, keyboard-accessible pairing interface
- Validation restricted to private/local device addresses
- An eight-second connection timeout and clear error feedback
- Automated tests for device URL validation
- Open-source contribution and security guidance

## Run locally

No build step is required. Clone the repository and serve the project directory with any static web server:

```bash
git clone https://github.com/rihanmn1/Women-Saftey-System-.git
cd Women-Saftey-System-
python3 -m http.server 8000
```

Open `http://localhost:8000/WISE/`, then enter the URL exposed by your ESP32 device. For example:

```text
http://192.168.4.1/set?value=PHONE_NUMBER
```

Only private IPv4 addresses, localhost, and `.local` hostnames are accepted. Use the application on a trusted network. Plain HTTP does not encrypt the URL or query parameters.

## Tests

Node.js 18 or newer is recommended:

```bash
npm test
```

## Project structure

```text
WISE/
  index.html       User interface
  style.css        Application styling
  app.js           Pairing and interaction logic
  url-utils.js     Testable local-device URL validation
tests/
  url-utils.test.js
```

## Contributing

Bug reports, documentation improvements, accessibility work, hardware integrations, and tests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Security concerns should be reported according to [SECURITY.md](SECURITY.md), not through a public issue.

## License

WISE is available under the [MIT License](LICENSE).
