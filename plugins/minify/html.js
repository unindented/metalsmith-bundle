import minifier from 'html-minifier'

const options = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true
}

export default function (contents, callback) {
  try {
    let result = minifier.minify(contents, options)
    callback(null, result)
  } catch (err) {
    callback(err)
  }
}
