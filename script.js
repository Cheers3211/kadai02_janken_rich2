$(function () {
  const hands = ["グー", "チョキ", "パー"];
  const instructions = ["勝つのだぞー", "負けるのだぞー"];
  let correctCount = 0;
  let currentInstruction = "";
  let enemyHand = "";
  let timer = null;
  let timeLeft = 3;
  let isAnswered = false;

  function setNewQuestion() {
    currentInstruction = instructions[Math.floor(Math.random() * instructions.length)];
    enemyHand = hands[Math.floor(Math.random() * hands.length)];
    timeLeft = 3;
    isAnswered = false;

    $("#instruction").text("指令じゃ：" + currentInstruction);
    $("#enemy-hand").text("相手の手：" + enemyHand);
    $("#your-hand").text("あなたの手：？");
    $("#result").text("結果：？");
    $("#timer").text("タイマー：" + timeLeft);

    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      $("#timer").text("タイマー：" + timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        if (!isAnswered) {
          $("#result").text("時間切れ！不正解…⏰");
          setTimeout(setNewQuestion, 1500);
        }
      }
    }, 1000);
  }

  function judge(player, cpu, instruction) {
    if (player === cpu) return false;

    const winMap = {
      "グー": "チョキ",
      "チョキ": "パー",
      "パー": "グー"
    };

    const didWin = winMap[player] === cpu;

    return (instruction === "勝つのだぞー" && didWin) ||
           (instruction === "負けるのだぞー" && !didWin);
  }

  $(".hand").on("click", function () {
    if (isAnswered) return;
    isAnswered = true;
    clearInterval(timer);

    const userHand = $(this).data("hand");
    $("#your-hand").text("あなたの手：" + userHand);

    const result = judge(userHand, enemyHand, currentInstruction);
    if (result) {
      $("#result").text("正解！🎉");
      correctCount++;
    } else {
      $("#result").text("不正解…😢");
    }
    $("#score").text("正解数：" + correctCount);

    if (correctCount >= 5) {
      $("#result").text("ゲームクリア！🎉");
      $(".hand").prop("disabled", true);
      clearInterval(timer);
      $("#retry").show(); // ← これで表示されるようになる！
      return;
    }

    setTimeout(setNewQuestion, 1500);
  });

  // ✅ ← retryの処理は最初に1回だけ登録！
  $("#retry").on("click", function () {
    correctCount = 0;
    $("#score").text("正解数：0");
    $(".hand").prop("disabled", false);
    $(this).hide();
    setNewQuestion();
  });

  // 🔧 最初の問題を出す
  setNewQuestion();
});
