# Use the latest stable Rust image
FROM rust:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy the Cargo.toml and Cargo.lock to cache dependencies
COPY Cargo.toml Cargo.lock ./

# Pre-build dependencies to cache them
RUN mkdir src && cargo build --release || true

# Copy the source code
COPY ./src ./src

# Build the release version of the project
RUN cargo build --release

# Print the contents of the target/release directory to ensure the binary exists
RUN ls -l ./target/release

# Copy the .env file
COPY .env .env

# Expose the port (optional)
EXPOSE 8000

# Command to run your Rust ingestion program
CMD ["./target/release/rust-ingestion"]
