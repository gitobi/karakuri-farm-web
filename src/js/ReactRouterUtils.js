// @flow

const createLinkTo = (match: Object, itemId: string) => {
  let linkTo;
  if (match.params.id) {
    // 現在URLのid部分を置換
    linkTo = match.url.replace(match.params.id, itemId);
  } else {
    linkTo = match.path.replace(':id?', itemId);
  }
  return linkTo;
}

export { createLinkTo };
