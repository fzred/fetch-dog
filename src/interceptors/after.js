export default function (res) {
  try {
    return res.json()
  } catch (e) {
    return res
  }
}
