set -e
echo "输入版本号: "
read VERSION

read -p "正在发布 $VERSION - 确定吗? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "发布中 $VERSION ..."

  # run tests
  # npm test 2>/dev/null

  # build
  VERSION=$VERSION npm run build

  echo "commit"
  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"

  echo "publish"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish
fi