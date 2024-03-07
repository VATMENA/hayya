#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "master" || "$VERCEL_GIT_COMMIT_REF" == "qa1" || "$VERCEL_GIT_COMMIT_REF" == "qa2"  ]] ; then
  # Proceed with the build
    echo "building"
  exit 1;

else
  # Don't build
  echo "ignoring build because not staging, master, qa1, qa2"
  exit 0;
fi
