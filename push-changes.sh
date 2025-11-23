#!/bin/bash
# Push Rootwise changes to GitHub

cd "/home/tokyo/Desktop/rootwise"

echo "📦 Changes Ready to Push:"
echo ""
git log origin/main..HEAD --oneline
echo ""

read -p "Push these changes to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed!"
        echo ""
        echo "🔗 View commits at:"
        echo "   https://github.com/helloworldxdwastaken/rootwise/commits/main"
        echo ""
        echo "📱 Mobile app fixes also ready:"
        echo "   cd '/home/tokyo/Desktop/rootwise app' && git push origin main"
    else
        echo ""
        echo "❌ Push failed. You may need to authenticate."
        echo ""
        echo "💡 Options:"
        echo "1. Use GitHub Desktop"
        echo "2. Set up SSH keys: https://github.com/settings/keys"
        echo "3. Use Personal Access Token: https://github.com/settings/tokens"
    fi
else
    echo "Push cancelled."
fi

