#!/usr/bin/env bash

echo "BUILD backend"
cd backend 
npm install
cd ..

echo "BUILD frontend"
cd frontend 
npm install
npm run build 
mv dist ../backend
cd ..