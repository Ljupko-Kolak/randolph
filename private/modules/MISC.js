// miscellaneous functions module

function simplifyString(string) {
  let simplified = string.toLowerCase().split(" ").join("");
  return simplified;
}

function getCountryCode() {

}

module.exports = {
  simplifyString,
  getCountryCode
};