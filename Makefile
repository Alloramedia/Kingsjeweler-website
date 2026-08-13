.PHONY: dev install build start lint

# Install dependencies and start the dev server
dev:
	cd pit-masa && npm install && npm run dev

# Install dependencies only
install:
	cd pit-masa && npm install

# Production build
build:
	cd pit-masa && npm run build

# Start production server (run `make build` first)
start:
	cd pit-masa && npm run start

# Run linter
lint:
	cd pit-masa && npm run lint
