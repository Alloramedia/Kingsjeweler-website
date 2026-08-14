.PHONY: dev install build start lint

# Install dependencies and start the dev server
dev:
	cd kings-jeweler && npm install && npm run dev

# Install dependencies only
install:
	cd kings-jeweler && npm install

# Production build
build:
	cd kings-jeweler && npm run build

# Start production server (run `make build` first)
start:
	cd kings-jeweler && npm run start

# Run linter
lint:
	cd kings-jeweler && npm run lint
