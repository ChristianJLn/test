const twitter_data = [];
let authors;

function align() {
  var f = document.getElementById("bottomalign");
  f.style.position = "absolute";
}

const createChart = () => {
  const ctx = document.getElementById("twitterChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: twitter_data.map((tweet) =>
        authors[tweet.authorId] !== undefined
          ? authors[tweet.authorId].displayName
          : tweet.authorId
      ),
      datasets: [
        {
          label: "# of Words",
          backgroundColor: "hsla(277, 41%, 54%, 0.674)",
          borderColor: "hsla(277, 41%, 54%, 1)",
          data: twitter_data.map((tweet) => tweet.noWords),
          borderWidth: 1,
        },
      ],
    },

    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const toggleMenu = () => {
  if ($("#navigationlist").css("max-height") == "75px") {
    $("#navigationlist").css("max-height", "261px");
    $("#navigationlist ul").css("max-height", "186px");
    $("#navigationlist ul li").css("display", "block");
  } else {
    $("#navigationlist").css("max-height", "75px");
    $("#navigationlist ul").css("max-height", "0px");
    $("#navigationlist ul li").css("display", "none");
  }
};

$(document).ready(async () => {
  align();
  $("#bottomalign").css("text-align", "center");
  $("#navigationlist").css("max-height", "75px");
  $("#navigationlist ul").css("max-height", "0px");

  await fetch("../test_feed.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(data => data.json())
    .then(result => {
      result.content.map((t) => {
        let tweet;
        if (t.content.bodyHtml) {
          const words = t.content.bodyHtml.split(" ").filter(word => {
            return (
              word.search(/[=|<|>|"|\\|/|]+/g) === -1 &&
              word.search(/[\w]+/g) !== -1
            );
          });
          tweet = {
            id: t.content.id,
            authorId: t.content.authorId,
            createdAt: t.content.createdAt,
            words: words,
            noWords: words.length,
          };
          twitter_data.push(tweet);
        }
      });
      authors = result.authors;
    })
    .then(createChart);
});
