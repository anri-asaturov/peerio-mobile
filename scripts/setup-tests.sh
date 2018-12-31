#!/bin/bash

echo "checking test environment"

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        echo "Linux..."
        ;;
    Darwin*)    
        echo "Mac..."
        brew install ideviceinstaller
        brew install carthage
        brew upgrade carthage
        npm install -g ios-deploy
        ;;
esac

