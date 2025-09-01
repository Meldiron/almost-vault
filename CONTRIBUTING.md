# Contributing to Almost Vault

Thank you for your interest in contributing to Almost Vault! We welcome contributions from everyone and appreciate your help in making this project better.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 22 or later
- npm
- Appwrite CLI
- Git

## How to Contribute

### Reporting Issues

Before creating an issue, please:
- Check if the issue already exists in the issue tracker
- Provide a clear and descriptive title
- Include steps to reproduce the issue
- Add relevant screenshots or error messages
- Specify your environment (OS, Node.js version, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been requested
- Provide a clear description of the feature
- Explain the use case and benefits
- Consider the security implications for a secret-sharing application

### Code Contributions

#### Branch Naming

Use descriptive branch names:
- `feature/add-secret-expiration`
- `fix/encryption-bug`
- `docs/update-api-guide`

#### Making Changes

1. **Create a new branch** from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following our coding standards

3. **Test your changes**:
```bash
# Format and lint backend code
cd function
npm run format
npm run check
npm run test

# Format frontend code
cd site
npm run format
npm run build
```

4. **Commit your changes** with clear, descriptive messages:
```bash
git commit -m "feat: add secret auto-expiration feature"
```

5. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub

#### Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues using `Fixes #issue-number`
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused on a single feature or fix

## Code Style

### Backend (Function)

- Use **Biome** for formatting and linting
- Follow modern JavaScript/ES6+ conventions
- Use meaningful variable and function names
- Handle errors appropriately

### Frontend (Site)

- Use **Prettier** for formatting
- Follow Alpine.js conventions
- Use semantic HTML
- Implement responsive design with Tailwind CSS
- Ensure accessibility standards

## Security Considerations

Since Almost Vault handles sensitive data, please:

- Never log secret content in plain text
- Ensure proper input validation
- Follow secure coding practices
- Consider timing attack vulnerabilities
- Test encryption/decryption thoroughly
- Validate CORS settings

## Documentation

When contributing, please:

- Update relevant documentation
- Add inline code comments
- Update API documentation for endpoint changes
- Include usage examples
- Update README if needed

## Release Process

Maintainers handle releases, but contributors should:

- Follow semantic versioning in commit messages
- Use conventional commit format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code refactoring
  - `test:` for test additions/changes

## Getting Help

If you need help:

- Check the existing documentation
- Look through existing issues and PRs
- Join the [Appwrite Discord](https://appwrite.io/discord)
- Create a discussion thread for questions

## Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes for significant contributions
- Recognized in project documentation

## License

By contributing to Almost Vault, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Almost Vault! 🚀