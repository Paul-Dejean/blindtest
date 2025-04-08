#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting sync of dist folder to S3 bucket: blindtest-playlists${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first:${NC}"
    echo "npm install -g aws-cli"
    # OR
    echo "brew install awscli"
    exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist folder does not exist!${NC}"
    echo "Please build your project first."
    exit 1
fi

# Sync the dist folder to S3
echo -e "${YELLOW}Syncing files to S3...${NC}"
aws s3 sync dist/ s3://blindtest-playlists --delete

# Check if the sync was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully synced dist folder to S3 bucket: blindtest-playlists${NC}"
else
    echo -e "${RED}Failed to sync to S3. Please check your AWS credentials and permissions.${NC}"
    exit 1
fi

# Print the S3 bucket URL
echo -e "${GREEN}Your files are now available at:${NC}"
echo "https://blindtest-playlists.s3.amazonaws.com/"

exit 0