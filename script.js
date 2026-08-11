(function () {
  var faixas = {
    1: [250, 450],
    2: [450, 800],
    3: [750, 1250],
    4: [1100, 1900],
  };
  var fmt = function (v) {
    return Math.round(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  };

  document
    .getElementById("btnVerificar")
    .addEventListener("click", function () {
      var nome = document.getElementById("fNome").value.trim();
      var zap = document.getElementById("fZap").value.trim();
      var err = document.getElementById("fError");
      if (!nome || zap.replace(/\D/g, "").length < 10) {
        err.style.display = "block";
        return;
      }
      err.style.display = "none";

      document.getElementById("stForm").style.display = "none";
      document.getElementById("stAnalysis").style.display = "block";

      var steps = ["as1", "as2", "as3", "as4"];
      steps.forEach(function (id, i) {
        setTimeout(
          function () {
            document.getElementById(id).classList.add("active");
            if (i > 0)
              document
                .getElementById(steps[i - 1])
                .classList.replace("active", "done");
          },
          400 + i * 850,
        );
      });
      setTimeout(
        function () {
          document.getElementById("as4").classList.replace("active", "done");
        },
        400 + steps.length * 850,
      );

      setTimeout(showResult, 600 + steps.length * 850);
    });

  function showResult() {
    var nome = document.getElementById("fNome").value.trim().split(" ")[0];
    var vinc = document.getElementById("fVinc").value;
    var renda = parseInt(document.getElementById("fRenda").value, 10);
    var anos = parseInt(document.getElementById("fAnos").value, 10);
    var fx = faixas[renda],
      meses = anos * 12;
    var subMin = fx[0] * meses,
      subMax = fx[1] * meses;
    var selMin = subMin * 0.15,
      selMax = subMax * 0.15;
    var totMin = subMin + selMin,
      totMax = subMax + selMax;

    document.getElementById("rNome").textContent = nome;
    document.getElementById("rExc").textContent =
      fmt(fx[0]) + " – " + fmt(fx[1]);
    document.getElementById("rMeses").textContent = meses + " meses";
    document.getElementById("rSelic").textContent =
      "+ " + fmt(selMin) + " – " + fmt(selMax);
    document.getElementById("rTotal").textContent =
      fmt(totMin) + " – " + fmt(totMax);

    var msg =
      "Olá! Sou " +
      document.getElementById("fNome").value.trim() +
      ", fiz a verificação no site: " +
      vinc +
      " vínculos, " +
      anos +
      " ano(s) na situação. Estimativa: " +
      fmt(totMin) +
      " a " +
      fmt(totMax) +
      ". Quero a análise gratuita do meu CNIS. Meu WhatsApp: " +
      document.getElementById("fZap").value;
    document.getElementById("rWa").href =
      "https://wa.me/5581999898760?text=" + encodeURIComponent(msg);

    document.getElementById("stAnalysis").style.display = "none";
    document.getElementById("stResult").style.display = "block";
  }

  document.getElementById("rAgain").addEventListener("click", function () {
    document.getElementById("stResult").style.display = "none";
    ["as1", "as2", "as3", "as4"].forEach(function (id) {
      document.getElementById(id).classList.remove("active", "done");
    });
    document.getElementById("stForm").style.display = "block";
  });
})();
