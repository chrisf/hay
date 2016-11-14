cd gh-pages
git rm -rf .
git clean -fxd

cd ../
cp -R hay.js.org/ gh-pages/
cp -f circle.yml gh-pages/circle.yml
echo "hay.js.org" > gh-pages/CNAME
cd gh-pages
git add --all
git commit -m "Release at $(date)"
git push
