var client = algoliasearch('WWH064LBS0', '0fb85dc186ad906ed95a01f12cceecfc');
var index = client.initIndex('users');
var imgs = ["https://i.imgur.com/NY38nL2.gif","https://i.imgur.com/FjgwkLp.gifv","https://i.imgur.com/rG3DP0P.gif"]

index.setSettings({
    customRanking: [
        "desc(score)"
    ]
})

var user = "ivankhyung@gmail.com";
chrome.storage.local.get(['user'], function(result) {
  if (result.user) {
    user = result.user;
  };
});

var score = 0;
index.getObject(user, function(err, content) {
  score = content.score;
  document.getElementById("score").innerHTML = document.getElementById("score").innerHTML.slice(0, -2) + score;
});

index.search({
  aroundLatLngViaIP: true
}).then(res => {
  console.log(res.hits);
});
