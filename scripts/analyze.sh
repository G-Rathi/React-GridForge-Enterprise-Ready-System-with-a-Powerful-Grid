#!/bin/bash

# Run webpack-bundle-analyzer
npm run build -- --stats
npx webpack-bundle-analyzer dist/stats.json